import { db } from "../connect.js";

// Create a match/request between two users.
// Uses matches table schema: id_match, matched_at, followerUserId, followedUserId, status
export const createMatchRequest = (req, res) => {
  // Prefer authenticated user as follower if available (req.userId set by middleware).
  const follower = req.userId || req.body.followerUserId;
  const followed = req.body.followedUserId;

  if (!follower || !Number.isInteger(Number(follower)) || Number(follower) <= 0) {
    return res.status(400).json({ error: "Invalid or missing followerUserId" });
  }
  if (!followed || !Number.isInteger(Number(followed)) || Number(followed) <= 0) {
    return res.status(400).json({ error: "Invalid or missing followedUserId" });
  }
  if (Number(follower) === Number(followed)) {
  return res.status(400).json({ error: "Cannot send a match request to yourself" });
}


  // prevent duplicate pending requests between same users
  const qExists = "SELECT * FROM `match` WHERE followerUserId = ? AND followedUserId = ? AND status = 'pending'";
  db.query(qExists, [follower, followed], (err, rows) => {
    if (err) {
      console.error('DB error on qExists:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (rows && rows.length > 0) return res.status(409).json({ error: "Request already sent" });

    const qInsert = "INSERT INTO `match` (followerUserId, followedUserId, status, matched_at) VALUES (?, ?, 'pending', NOW())";
    db.query(qInsert, [follower, followed], (err2, result) => {
      if (err2) {
        console.error('DB error on qInsert:', err2);
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(201).json({ message: "Match request created", id: result.insertId });
    });
  });
};

// Get incoming and outgoing match requests for authenticated user
export const getMatchesForUser = (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const qIncoming = `SELECT m.*, u.username AS followerName FROM ` + "`match`" + ` m JOIN users u ON u.id_user = m.followerUserId WHERE m.followedUserId = ? ORDER BY m.matched_at DESC`;
  const qOutgoing = `SELECT m.*, u.username AS followedName FROM ` + "`match`" + ` m JOIN users u ON u.id_user = m.followedUserId WHERE m.followerUserId = ? ORDER BY m.matched_at DESC`;

  db.query(qIncoming, [userId], (err, incoming) => {
    if (err) return res.status(500).json(err);
    db.query(qOutgoing, [userId], (err2, outgoing) => {
      if (err2) return res.status(500).json(err2);
      return res.status(200).json({ incoming, outgoing });
    });
  });
};

// Accept a match: only the followedUserId may accept
export const acceptMatch = (req, res) => {
  const id_match = Number(req.params.id);
  const userId = req.userId;
  if (!Number.isInteger(id_match) || id_match <= 0) return res.status(400).json({ error: "Invalid match id" });
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const qCheck = "SELECT * FROM `match` WHERE id_match = ? AND followedUserId = ?";
  db.query(qCheck, [id_match, userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows || rows.length === 0) return res.status(403).json({ error: "Not authorized or match not found" });

    const qUpdate = "UPDATE `match` SET status = 'accepted', matched_at = NOW() WHERE id_match = ?";
    db.query(qUpdate, [id_match], (err2) => {
      if (err2) return res.status(500).json(err2);
      return res.status(200).json({ message: "Match accepted" });
    });
  });
};

// Reject a match: only the followedUserId may reject
export const rejectMatch = (req, res) => {
  const id_match = Number(req.params.id);
  const userId = req.userId;
  if (!Number.isInteger(id_match) || id_match <= 0) return res.status(400).json({ error: "Invalid match id" });
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const qCheck = "SELECT * FROM `match` WHERE id_match = ? AND followedUserId = ?";
  db.query(qCheck, [id_match, userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows || rows.length === 0) return res.status(403).json({ error: "Not authorized or match not found" });

    const qUpdate = "UPDATE `match` SET status = 'rejected' WHERE id_match = ?";
    db.query(qUpdate, [id_match], (err2) => {
      if (err2) return res.status(500).json(err2);
      return res.status(200).json({ message: "Match rejected" });
    });
  });
};

// Return accepted buddies (FESBuddies) for authenticated user
export const getFriendsForUser = (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const q = `
    SELECT DISTINCT
      mt.id_match,
      mt.matched_at,
      CASE
        WHEN mt.followerUserId = ? THEN mt.followedUserId
        ELSE mt.followerUserId
      END AS buddyId,
      u.username
    FROM \`match\` mt
    JOIN users u
      ON u.id_user = CASE
        WHEN mt.followerUserId = ? THEN mt.followedUserId
        ELSE mt.followerUserId
      END
    WHERE mt.status = 'accepted'
      AND (mt.followerUserId = ? OR mt.followedUserId = ?)
      AND CASE
        WHEN mt.followerUserId = ? THEN mt.followedUserId
        ELSE mt.followerUserId
      END <> ?
    ORDER BY mt.matched_at DESC
  `;

  db.query(q, [userId, userId, userId, userId, userId, userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ buddies: rows || [] });
  });
};

