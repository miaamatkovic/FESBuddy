import React, { useState } from "react";
import "../styles/Main.css";  
import { useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

export default function Match()
{
    return (
        <div className="match-page">
            <Header />
            <div className="main-container">
        {/* LEFT COLUMN */}
        <div className="column left-col">

          <img src={"../pictures/match.png"} alt="profile" />

          <h2>FESBuddies</h2>
          <div>
            
          </div>

        </div>

        {/* MIDDLE COLUMN */}
        <div className="column middle-col">
            <h2 className="text-center">TRENUTNO OTVOREN RAZGOVOR - CHAT </h2>
        </div>

        {/* RIGHT COLUMN (empty for now) */}
        <div className="column right-col">
            <h2>ZAHTJEVI</h2>
        </div>

        </div>
            <Footer />
        </div>
    );
}