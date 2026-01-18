import { db } from "../connect.js";

// Dohvat podataka posta
export const getPosts = (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "Invalid userId parameter" });
  }

  const q = "SELECT p.*, u.id_user, u.username FROM posts AS p JOIN users AS u ON u.id_user = p.user_id WHERE p.user_id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Dohvat objava za određeni kolegij (prema nazivu kolegija)
export const getPostsByCourse = (req, res) => {
  const courseName = req.params.courseName;
  if (!courseName || typeof courseName !== "string") {
    return res.status(400).json({ error: "Invalid courseName parameter" });
  }

  const q = `SELECT p.*, u.id_user, u.username
    FROM posts AS p
    JOIN users AS u ON u.id_user = p.user_id
    JOIN courses AS c ON c.id_course = p.course_id
    WHERE c.name = ?`;

  db.query(q, [courseName], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Kreiranje nove objave vezane za kolegij
export const createPost = (req, res) => {
  const { id_user, courseName, tip, gradivo, vrijeme, lokacija } = req.body;

  if (!id_user || !Number.isInteger(Number(id_user)) || Number(id_user) <= 0) {
    return res.status(400).json({ error: "Invalid or missing id_user" });
  }
  if (!courseName || typeof courseName !== "string") {
    return res.status(400).json({ error: "Invalid or missing courseName" });
  }

  // Prvo dohvatiti id_course iz naziva kolegija
  const qCourse = "SELECT id_course FROM courses WHERE name = ? LIMIT 1";
  db.query(qCourse, [courseName], (err, courseData) => {
    if (err) return res.status(500).json(err);
    if (!courseData || courseData.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const id_course = courseData[0].id_course;
    const qInsert = "INSERT INTO posts (user_id, course_id, tip, gradivo, vrijeme, lokacija) VALUES (?)";
    const values = [id_user, id_course, tip || null, gradivo || null, vrijeme || null, lokacija || null];

    db.query(qInsert, [values], (err2, result) => {
      if (err2) return res.status(500).json(err2);
      return res.status(201).json({ message: "Post created", id: result.insertId });
    });
  });
};

// Ažuriranje postojećeg posta (samo vlasnik može)
// Update endpoint: ownership enforced. Controller checks that the `id_user` provided
// in the request body is the owner of the `id_post` before applying updates.
// This prevents users from editing posts that nisu njihovi.
export const updatePost = (req, res) => {
  const id_post = Number(req.params.id);
  const { id_user, tip, gradivo, vrijeme, lokacija } = req.body;

  if (!Number.isInteger(id_post) || id_post <= 0) return res.status(400).json({ error: "Invalid post id" });
  if (!id_user || !Number.isInteger(Number(id_user)) || Number(id_user) <= 0) {
    return res.status(400).json({ error: "Invalid or missing id_user" });
  }

  const qCheck = "SELECT * FROM posts WHERE id_post = ? AND user_id = ?";
  db.query(qCheck, [id_post, id_user], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows || rows.length === 0) return res.status(403).json({ error: "Not authorized or post not found" });

    const qUpdate = "UPDATE posts SET tip = ?, gradivo = ?, vrijeme = ?, lokacija = ? WHERE id_post = ?";
    db.query(qUpdate, [tip || null, gradivo || null, vrijeme || null, lokacija || null, id_post], (err2) => {
      if (err2) return res.status(500).json(err2);
      return res.status(200).json({ message: "Post updated" });
    });
  });
};

// Brisanje posta (samo vlasnik može)
// Delete endpoint: ownership enforced. Controller deletes only when both
// `id_post` and `user_id` match a row in `posts`. Frontend should send
// current user's `id_user` to confirm ownership, but server-side check is authoritative.
export const deletePost = (req, res) => {
  const id_post = Number(req.params.id);
  const id_user = req.body.id_user || req.query.id_user;

  if (!Number.isInteger(id_post) || id_post <= 0) return res.status(400).json({ error: "Invalid post id" });
  if (!id_user || !Number.isInteger(Number(id_user)) || Number(id_user) <= 0) {
    return res.status(400).json({ error: "Invalid or missing id_user" });
  }

  const q = "DELETE FROM posts WHERE id_post = ? AND user_id = ?";
  db.query(q, [id_post, id_user], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(403).json({ error: "Not authorized or post not found" });
    return res.status(200).json({ message: "Post deleted" });
  });
};