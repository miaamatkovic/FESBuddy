// File: src/pages/RegisterPage.js
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [err, setErr] = useState(null);
  const navigate = useNavigate();


  const handleRegister = async (e) => {
  e.preventDefault();
  if (password !== repeatPassword) {
  setErr("Lozinke se ne podudaraju!");
  return;
}
  try {
    const res = await axios.post("http://localhost:8800/api/auth/register", {
      username,
      email,
      password,
      //repeatPassword,
    }); 
    console.log("Uspješno registriran:", res.data);

    navigate("/Connected"); 
    
  } catch (err) {
  if (err?.response?.data?.sqlMessage) {
    setErr(err.response.data.sqlMessage);
  } else if (err?.response?.data) {
    setErr(JSON.stringify(err.response.data));
  } else {
    setErr("Greška kod registracije");
  }
}

};

  return (
    <div className="register-container">

      <div className="content-wrapper">
        {/* LEFT SIDE */}
        <div className="left-box">     
           <h1 className="main-title">FESBuddy</h1>

          <img
            src="../pictures/logo.png"
            alt="buddy"
            className="buddy-img"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-box">
        <h2 className="form-title">Registracija</h2>

        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Lozinka"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="auth-input"
            placeholder="Ponovi lozinku"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          {err && <span className="error">{err}</span>}

          <button className="auth-button" type="submit">
            Registriraj se
          </button>
        </form>

        <p className="switch-text">
          Već imaš račun?
          <Link to="/login" className="switch-link">
          {" "}
          Prijavi se
        </Link>
       </p>
      </div>
      </div>
    </div>
  );
};
