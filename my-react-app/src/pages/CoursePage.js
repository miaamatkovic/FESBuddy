import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Main.css";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

export default function CoursePage() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);



return (
  <div className="course-page-container">
    <Header />
  <div className="course-page flex">
    {/* Left Sidebar */}
    <div className="left-panel">
      <div className="course-name-circle">
        {courseName}
      </div>
      <div className="buttons-container">
         <button className="course-btn" onClick={() => navigate(`/course/${courseName}`)}><b>Kreiraj zahtjev</b></button>
            <button className="course-btn" onClick={() => navigate(`/notes/${courseName}`)}><b>Moje bilješke</b></button>
            <button className="course-btn" onClick={() => navigate(`/script/${courseName}`)}><b>Moje skripte</b></button>
      </div>
    </div>

    {/* Right Content Area */}
   <div className="right-panel">
    <h2>KREIRAJ ZAHTJEV</h2>
  <div className="square">
    <form
      className="request-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = {
          kolokvij: e.target.kolokvij.value,
          tim: e.target.tim.value,
          mjesto: e.target.mjesto.value,
          vrijeme: e.target.vrijeme.value,
        };
        console.log("Podaci za zahtjev:", data);
        alert("Zahtjev poslan!");
      }}
    >
      {/* 1. Kolokvij/Ispit */}
      <div className="form-group">
        <label><b>Odaberi gradivo: </b></label>
        <div className="radio-group">
          <label><input type="radio" name="kolokvij" value="1. kolokvij" required /> 1. kolokvij</label>
          <label><input type="radio" name="kolokvij" value="2. kolokvij" /> 2. kolokvij</label>
          <label><input type="radio" name="kolokvij" value="ispit" /> Ispit</label>
        </div>
      </div>

      {/* 2. Rad u timu ili paru */}
      <div className="form-group">
        <label><b>Učenje u timu ili paru?</b></label>
        <div className="radio-group">
          <label><input type="radio" name="tim" value="tim" required /> Tim</label>
          <label><input type="radio" name="tim" value="par" /> Par</label>
        </div>
      </div>

      {/* 3. Mjesto učenja */}
      <div className="form-group">
        <label><b>Predloži lokaciju učenja:</b></label>
        <input type="text" name="mjesto" placeholder="Npr. knjižnica, doma..." required className="input-field" />
      </div>

      {/* 4. Vrijeme učenja */}
      <div className="form-group">
        <label><b>Predloži vrijeme učenja:</b></label>
        <input type="text" name="vrijeme" placeholder="Npr. pon 16-18h, pet 10-12h..." required className="input-field" />
      </div>

      <button type="submit" className="course-btn1"><b>Pošalji zahtjev</b></button>
    </form>
  </div>
</div>
  </div>
    <Footer />
  </div>
);
}