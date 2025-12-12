import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Main.css";


export default function Script() {

    const { courseName } = useParams();
    const navigate = useNavigate();
   
  return (
    <div className="script-page-container">
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
            <h2>MOJE SKRIPTE</h2>
            <div className="square">
                <p>Ovdje će biti prikazane vaše skripte za kolegij {courseName}.</p>
            </div>
         </div>
       
      </div>
        <Footer />
    </div>
    );
}