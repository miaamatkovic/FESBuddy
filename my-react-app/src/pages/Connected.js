// File: src/pages/LoginPage.js
import "../styles/Main.css";
import { useNavigate } from "react-router-dom";

export default function Connected() {

    const navigate = useNavigate();

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
            <form className="auth-form" >
                <h2 className="form-title">Uspješno ste povezani!</h2>
          <button className="auth-button" type="submit" onClick={() => navigate("/login")}>Prijavi se</button>
          </form>
        </div>
      </div>
    </div>
  );
}