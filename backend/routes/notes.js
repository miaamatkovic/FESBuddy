import express from "express";
import { getNotesByCourse, addNote, deleteNote } from "../controllers/notes.js";

const router = express.Router();

// GET all notes for a specific user and course
router.get("/:userId/:courseId", getNotesByCourse);

// POST add a new note
router.post("/", addNote);

// DELETE a note
router.delete("/:noteId", deleteNote);

export default router;