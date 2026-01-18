import express from "express";
import { getScriptsByCourse, addScript, deleteScript } from "../controllers/scripts.js";
import { uploadScriptFile } from "../middleware/uploadScript.js";

const router = express.Router();

// GET all scripts for a specific user and course
router.get("/:userId/:courseId", getScriptsByCourse);

// POST add a new script (multipart/form-data)
router.post("/", uploadScriptFile.single("file"), addScript);

// DELETE a script
router.delete("/:scriptId", deleteScript);

export default router;
