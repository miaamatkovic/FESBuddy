import express from "express";
import { db } from "../connect.js";

const router = express.Router();

router.get("/", (req, res) => {
  const majorId = req.query.majorId;

  const q = "SELECT id_course, name AS course_name FROM courses WHERE id_major = ?";

  db.query(q, [majorId], (err, data) => {
    if(err) return res.status(500).json(err);
    console.log(data); // ovdje vidi što backend stvarno vraća
    return res.json(data);
  });
});


export default router;


