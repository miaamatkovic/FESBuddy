import { db } from "../connect.js";

// Get all notes for a specific user and course
export const getNotesByCourse = (req, res) => {
  const { userId, courseId } = req.params;

  const q = "SELECT id_note, id_user, id_course, text FROM notes WHERE id_user = ? AND id_course = ?";

  db.query(q, [userId, courseId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

// Add a new note
export const addNote = (req, res) => {
  const { userId, courseId, noteText } = req.body;

  if (!userId || !courseId || !noteText) {
    return res.status(400).json("Missing required fields: userId, courseId, noteText");
  }

  const q = "INSERT INTO notes (id_user, id_course, text) VALUES (?)";
  const values = [userId, courseId, noteText];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("Note added successfully");
  });
};

// Delete a note
export const deleteNote = (req, res) => {
  const { noteId } = req.params;

  if (!noteId) {
    return res.status(400).json("Missing note ID");
  }

  const q = "DELETE FROM notes WHERE id_note = ?";

  db.query(q, [noteId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("Note deleted successfully");
  });
};