import { db } from "../connect.js";

/**
 * Helper: returns accepted match row between two users (either direction),
 * or null if not found / not accepted.
 */
const getAcceptedMatchBetweenUsers = (userA, userB, cb) => {
  const q = `
    SELECT id_match, followerUserId, followedUserId, status
    FROM \`match\`
    WHERE status = 'accepted'
      AND (
        (followerUserId = ? AND followedUserId = ?)
        OR
        (followerUserId = ? AND followedUserId = ?)
      )
    LIMIT 1
  `;

  db.query(q, [userA, userB, userB, userA], (err, rows) => {
    if (err) return cb(err);
    if (!rows || rows.length === 0) return cb(null, null);
    return cb(null, rows[0]);
  });
};

/**
 * GET /api/messages/conversations
 * Returns conversation list for authenticated user (one row per buddy)
 * includes last message preview + unread count for that buddy.
 */
export const getConversations = (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  // We select only conversations where there is an accepted match
  // and pull the latest message per match, plus unread count.
  const q = `
    SELECT
      m2.id_match,
      m2.text AS last_text,
      m2.sent_at AS last_sent_at,
      CASE
        WHEN mt.followerUserId = ? THEN mt.followedUserId
        ELSE mt.followerUserId
      END AS buddyId,
      u.username AS buddyUsername,
      (
        SELECT COUNT(*)
        FROM messages um
        WHERE um.id_match = mt.id_match
          AND um.id_recipient = ?
          AND um.is_read = 0
      ) AS unreadCount
    FROM \`match\` mt
    JOIN users u
      ON u.id_user = CASE
        WHEN mt.followerUserId = ? THEN mt.followedUserId
        ELSE mt.followerUserId
      END
    JOIN messages m2
      ON m2.id_message = (
        SELECT m3.id_message
        FROM messages m3
        WHERE m3.id_match = mt.id_match
        ORDER BY m3.sent_at DESC
        LIMIT 1
      )
    WHERE mt.status = 'accepted'
      AND (mt.followerUserId = ? OR mt.followedUserId = ?)
    ORDER BY m2.sent_at DESC
  `;

  db.query(q, [userId, userId, userId, userId, userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ conversations: rows || [] });
  });
};

/**
 * GET /api/messages/with/:buddyId
 * Returns all messages between authenticated user and buddy (ascending by time).
 * Also marks incoming messages as read.
 */
export const getMessagesWithBuddy = (req, res) => {
  const userId = req.userId;
  const buddyId = Number(req.params.buddyId);

  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  if (!Number.isInteger(buddyId) || buddyId <= 0) {
    return res.status(400).json({ error: "Invalid buddyId" });
  }
  if (buddyId === userId) {
    return res.status(400).json({ error: "Cannot open chat with yourself" });
  }

  getAcceptedMatchBetweenUsers(userId, buddyId, (err, matchRow) => {
    if (err) return res.status(500).json(err);
    if (!matchRow) {
      return res.status(403).json({ error: "Chat allowed only for accepted buddies" });
    }

    const qMsgs = `
      SELECT id_message, id_match, id_sender, id_recipient, is_read, text, sent_at
      FROM messages
      WHERE id_match = ?
      ORDER BY sent_at ASC
    `;

    db.query(qMsgs, [matchRow.id_match], (err2, msgs) => {
      if (err2) return res.status(500).json(err2);

      // Mark messages as read where current user is recipient and buddy is sender
      const qRead = `
        UPDATE messages
        SET is_read = 1
        WHERE id_match = ?
          AND id_sender = ?
          AND id_recipient = ?
          AND is_read = 0
      `;

      db.query(qRead, [matchRow.id_match, buddyId, userId], (err3) => {
        if (err3) return res.status(500).json(err3);

        return res.status(200).json({
          id_match: matchRow.id_match,
          messages: msgs || [],
        });
      });
    });
  });
};

/**
 * POST /api/messages
 * Body: { buddyId, text }
 * Uses authenticated user as sender, resolves id_match from accepted match.
 */
export const sendMessage = (req, res) => {
  const userId = req.userId;
  const buddyId = Number(req.body.buddyId);
  const text = (req.body.text || "").trim();

  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  if (!Number.isInteger(buddyId) || buddyId <= 0) {
    return res.status(400).json({ error: "Invalid or missing buddyId" });
  }
  if (!text) return res.status(400).json({ error: "Text is required" });

  getAcceptedMatchBetweenUsers(userId, buddyId, (err, matchRow) => {
    if (err) return res.status(500).json(err);
    if (!matchRow) {
      return res.status(403).json({ error: "Message allowed only for accepted buddies" });
    }

    const qInsert = `
      INSERT INTO messages (id_match, id_sender, id_recipient, is_read, text, sent_at)
      VALUES (?, ?, ?, 0, ?, NOW())
    `;

    db.query(qInsert, [matchRow.id_match, userId, buddyId, text], (err2, result) => {
      if (err2) return res.status(500).json(err2);
      return res.status(201).json({
        message: "Message sent",
        id_message: result.insertId,
        id_match: matchRow.id_match,
      });
    });
  });
};

/**
 * PUT /api/messages/mark-read
 * Body: { buddyId }
 * Marks all unread messages from buddy to current user as read (for that match).
 */
export const markAsRead = (req, res) => {
  const userId = req.userId;
  const buddyId = Number(req.body.buddyId);

  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  if (!Number.isInteger(buddyId) || buddyId <= 0) {
    return res.status(400).json({ error: "Invalid buddyId" });
  }

  getAcceptedMatchBetweenUsers(userId, buddyId, (err, matchRow) => {
    if (err) return res.status(500).json(err);
    if (!matchRow) {
      return res.status(403).json({ error: "Not an accepted buddy" });
    }

    const q = `
      UPDATE messages
      SET is_read = 1
      WHERE id_match = ?
        AND id_sender = ?
        AND id_recipient = ?
        AND is_read = 0
    `;

    db.query(q, [matchRow.id_match, buddyId, userId], (err2, result) => {
      if (err2) return res.status(500).json(err2);
      return res.status(200).json({
        message: "Messages marked as read",
        updated: result.affectedRows,
      });
    });
  });
};
