// File: src/pages/LoginPage.js
import { useContext, useState } from "react";
import { useNavigate ,Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../styles/Main.css";

export default function LoginPage() {
  const [inputs, setInputs] = useState({
  username: "",
  password: "",
});

const [err, setErr] = useState(null);

const handleChange = (e) => {
  setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
const navigate = useNavigate();
const { login } = useContext(AuthContext);

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login(inputs); // login iz AuthContext koji radi axios.post na backend
    navigate("/HomePage"); // nakon uspješnog login-a ideš na Home
  } catch (err) {
    setErr(err?.response?.data || "Greška kod prijave");
  }
};


  return (
    <div className="login-container">
      <div className="content-wrapper">
        {/* LEFT side */}
        <div className="left-box">
          <h1 className="main-title">FESBuddy</h1>
          <img
            src="../pictures/logo.png"
            alt="buddy"
            className="buddy-img"
          />
        </div>

        {/* RIGHT side */}
        <div className="right-box">
          <h2 className="form-title">Prijava</h2>

          <form onSubmit={handleLogin}>

          <input
            className="auth-input"
            placeholder="Korisničko ime"
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            placeholder="Lozinka"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
          {err && <span className="error">{err}</span>}
          <button className="auth-button" type="submit">Prijavi se</button>
          </form>
          <p className="switch-text">
            Nemaš račun?
            <Link to="/register" className="switch-link">
              {" "}
              Registriraj se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}