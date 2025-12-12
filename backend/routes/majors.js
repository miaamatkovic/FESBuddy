import express from "express";
import { db } from "../connect.js";

const router = express.Router();

// GET /api/majors
router.get("/", (req, res) => {
  const q = "SELECT id_major, name FROM majors";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data); // vraća niz svih smjerova
  });
});

export default router;


