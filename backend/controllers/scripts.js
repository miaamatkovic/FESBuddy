import { db } from "../connect.js";
import fs from "fs";
import path from "path";

export const getScriptsByCourse = (req, res) => {
  const { userId, courseId } = req.params;

  const q = `
    SELECT id_script, id_user, id_course, title, file_path, description
    FROM script
    WHERE id_user = ? AND id_course = ?
    ORDER BY id_script DESC
  `;

  db.query(q, [userId, courseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addScript = (req, res) => {
  const { userId, courseId, title, description } = req.body;

  if (!userId || !courseId || !title) {
    // ako je file uploadan a fali polje, pobrisi file da ne ostane smece
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    return res.status(400).json("Missing required fields: userId, courseId, title");
  }

  if (!req.file) {
    return res.status(400).json("Fali uploadani file (PDF/DOC/DOCX).");
  }

  // spremamo relativnu putanju za URL
  const relativePath = `/uploads/scripts/${req.file.filename}`;

  const q = `INSERT INTO script (id_user, id_course, title, file_path, description) VALUES (?)`;
  const values = [userId, courseId, title, relativePath, description || null];

  db.query(q, [values], (err) => {
    if (err) {
      fs.unlink(req.file.path, () => {});
      return res.status(500).json(err);
    }
    return res.status(200).json("Script uploaded successfully");
  });
};

export const deleteScript = (req, res) => {
  const { scriptId } = req.params;

  const qFind = `SELECT file_path FROM script WHERE id_script = ?`;

  db.query(qFind, [scriptId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data || data.length === 0) return res.status(404).json("Script not found");

    const filePath = data[0].file_path; // npr /uploads/scripts/xxx.pdf
    const absolute = path.join(process.cwd(), filePath.replace("/uploads", "uploads"));

    const qDel = `DELETE FROM script WHERE id_script = ?`;
    db.query(qDel, [scriptId], (err2) => {
      if (err2) return res.status(500).json(err2);

      // obrisi file s diska (ako postoji)
      fs.unlink(absolute, () => {});
      return res.status(200).json("Script deleted successfully");
    });
  });
};
