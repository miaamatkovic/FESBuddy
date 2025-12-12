import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";
export default function Header() {

       const navigate = useNavigate();
       const [profileImage, setProfileImage] = useState(null);
  const [major, setMajor] = useState("");
  const [about, setAbout] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCourseList, setShowCourseList] = useState(false);


  // Dark mode toggle function
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };

    
      const handleLogout = () => {
        // 1) Reset stanja
        setProfileImage(null);
        setMajor("");
        setAbout("");
        setSelectedCourses([]);
    
        // 2) Očisti localStorage
        localStorage.clear();
    
        // 3) Prebaci na login stranicu
        navigate("/");
      };

  return (
    <div className="main-header">
        <div className="header-left">
          <div className="header-img-circle">
            <img src={"../pictures/logo.png"} alt="profile" />
          </div>
        </div>

        <div className="header-buttons">
          <button onClick={() => navigate("/HomePage")}>Početna</button>
          <button onClick={() => navigate("/match")}>Match</button>
          <button onClick={() => window.open("https://www.isvu.hr/studomat/prijava")}>Studomat</button>
          <button onClick={() => window.open("https://korisnik.fesb.unist.hr/prijava?returnUrl=https://raspored.fesb.unist.hr")}>Moj raspored</button>
          <button onClick={toggleDarkMode}><img  className="mode" src={"https://cdn-icons-png.flaticon.com/512/4797/4797327.png"} /></button>
          <button onClick={handleLogout}>Odjava</button>
        </div>
      </div>
  );
}