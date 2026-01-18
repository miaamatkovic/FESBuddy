import { db } from "../connect.js";

// Dohvat osnovnih podataka korisnika
export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT id_user, username, email FROM users WHERE id_user = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");
    res.status(200).json(data[0]);
  });
};

// Dohvat user data: major, gender i kolegiji
export const getUserData = (req, res) => {
  const userId = req.params.userId;

  const queryUser = "SELECT major_id, gender FROM users WHERE id_user = ?";  
  const queryCourses = `
    SELECT c.id_course, c.name AS course_name
    FROM user_course uc
    JOIN courses c ON uc.id_course = c.id_course
    WHERE uc.id_user = ?`;

  db.query(queryUser, [userId], (err, majorData) => {
    if (err) return res.status(500).json(err);
    const major = majorData[0]?.major_id || null;
    const gender = majorData[0]?.gender || "muško";

    db.query(queryCourses, [userId], (err, coursesData) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ major, gender, selectedCourses: coursesData });
    });
  });
};

// Spremanje user kolegija
export const saveUserCourses = (req, res) => {
  const userId = req.params.userId;
  const { courseIds } = req.body;

  const deleteQuery = "DELETE FROM user_course WHERE id_user = ?";
  db.query(deleteQuery, [userId], (err) => {
    if (err) return res.status(500).json(err);
    if (courseIds.length === 0) return res.status(200).json("Kolegiji spremljeni");

    const insertQuery = "INSERT INTO user_course (id_user, id_course) VALUES ?";
    const values = courseIds.map(id => [userId, id]);
    db.query(insertQuery, [values], (err) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Kolegiji spremljeni");
    });
  });
};

// Spremanje user major
export const saveUserMajor = (req, res) => {
  const userId = req.params.userId;
  const { majorId } = req.body;

  const query = "UPDATE users SET major_id = ? WHERE id_user = ?";
  db.query(query, [majorId, userId], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("Smjer spremljen");
  });
};

// Spremanje user gender
export const saveUserGender = (req, res) => {
  const userId = req.params.userId;
  const { gender } = req.body;

  const query = "UPDATE users SET gender = ? WHERE id_user = ?";
  db.query(query, [gender, userId], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("Spol spremljen");
  });
};

