import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Main.css";


export default function Notes() {

    const { courseName } = useParams();
    const navigate = useNavigate();
   
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
            <h2>MOJE BILJEŠKE - {courseName}</h2>
            <textarea
              className="notes-textarea" placeholder="Ovdje možete pisati i spremati svoje bilješke za kolegij."
            ></textarea>
         </div>
       
      </div>
        <Footer />
    </div>
    );
}