//ovo je kao autentifikacija

import { db } from "../connect.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//provjeravamo je li vec user postoji pri registraciji

export const register = (req, res) => {
    const qCheck = "SELECT * FROM users WHERE username = ?";

    db.query(qCheck, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err.sqlMessage);
        if (data.length) return res.status(409).json("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const qInsert =
            "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";

        const values = [
            req.body.username,
            req.body.email,
            hashedPassword
        ];

        db.query(qInsert, [values], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err.sqlMessage);
            }
            return res.status(200).json("User has been created.");
        });
    });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // CHECK PASSWORD
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    //  token mora koristiti id_user, ne id
    const token = jwt.sign({ id: data[0].id_user }, "REMOVED_JWT_SECRET");

    const { password, ...others } = data[0];

    //  također frontend treba id_user, pa ga moramo poslati
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        id_user: others.id_user,
        username: others.username,
        email: others.email,
        major: others.major_id || null
      });
  });
};


export const logout = (req, res)=>{
    res.clearCookie("accessToken", {
        secure: true,
        sameSite:"none"
    }).status(200).json("User has been logged out.")
};