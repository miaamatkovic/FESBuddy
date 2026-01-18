import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import "../styles/Main.css";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

export default function CoursePage() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);



return (
  <div className="course-page-container">
    <Header />
    <div className="course-page flex">
      {/* Left Sidebar */}
      <div className="left-panel">
        <div className="course-name-circle">{courseName}</div>
        <div className="buttons-container">
          <button className="course-btn" onClick={() => navigate(`/course/${courseName}`)}><b>Kreiraj zahtjev</b></button>
          <button className="course-btn" onClick={() => navigate(`/posts/${courseName}`)}><b>Zahtjevi</b></button>
          <button className="course-btn" onClick={() => navigate(`/notes/${courseName}`)}><b>Moje bilješke</b></button>
          <button className="course-btn" onClick={() => navigate(`/script/${courseName}`)}><b>Moje skripte</b></button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="right-panel">
        <h2>KREIRAJ ZAHTJEV</h2>
        <div className="square create-request">
          <form id="requestForm" className="request-form" onSubmit={async (e) => {
            // Form submit handler: assemble payload and POST to backend
            // Payload fields:
            // - id_user: current user's id (taken from AuthContext). Backend also enforces ownership.
            // - courseName: current course (used by backend to resolve course_id)
            // - tip/gradivo/vrijeme/lokacija: values collected from form inputs
            // After successful POST we navigate to the posts list for the course.
            e.preventDefault();
            const payload = {
              id_user: currentUser?.id_user || null, // must be set (user should be logged in)
              courseName: courseName,
              tip: e.target.tim.value,
              gradivo: e.target.kolokvij.value,
              vrijeme: e.target.vrijeme.value,
              lokacija: e.target.mjesto.value,
            };
            try {
              // Create new post on server; server will resolve course id from courseName
              const res = await axios.post("http://localhost:8800/api/posts/create", payload);
              alert("Zahtjev poslan!");
              // Navigate to the posts view for this course (which will fetch fresh data)
              navigate(`/posts/${courseName}`);
            } catch (err) {
              console.error(err);
              alert("Greška pri slanju zahtjeva: " + (err.response?.data?.error || err.message));
            }
          }}>
            <div className="form-group">
              <label><b>Odaberi gradivo: </b></label>
              <div className="radio-group">
                <label><input type="radio" name="kolokvij" value="1. kolokvij" required /> 1. kolokvij</label>
                <label><input type="radio" name="kolokvij" value="2. kolokvij" /> 2. kolokvij</label>
                <label><input type="radio" name="kolokvij" value="ispit" /> Ispit</label>
              </div>
            </div>

            <div className="form-group">
              <label><b>Učenje u timu ili paru?</b></label>
              <div className="radio-group">
                <label><input type="radio" name="tim" value="tim" required /> Tim</label>
                <label><input type="radio" name="tim" value="par" /> Par</label>
              </div>
            </div>

            <div className="form-group">
              <label><b>Predloži lokaciju učenja:</b></label>
              <input type="text" name="mjesto" placeholder="Npr. knjižnica, doma..." required className="input-field" />
            </div>

            <div className="form-group">
              <label><b>Predloži vrijeme učenja:</b></label>
              <input type="text" name="vrijeme" placeholder="Npr. pon 16-18h, pet 10-12h..." required className="input-field" />
            </div>
          </form>
          <button type="submit" form="requestForm" className="course-btn1"><b>Pošalji zahtjev</b></button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
}