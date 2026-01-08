import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Main.css"

export default function Posts() {
    const { courseName } = useParams();
    const navigate = useNavigate();

    // fake objave posli cu backend
    const posts = [
       {
      id: 1,
      student: "Student ABC",
      tip: "u paru",
      gradivo: "Ispit",
      vrijeme: "utorak u 12:00",
      lokacija: "Akademija",
    },
    {
      id: 2,
      student: "Student DEF",
      tip: "grupno",
      gradivo: "1. kolokvij",
      vrijeme: "srijeda u 17:00",
      lokacija: "Dom",
    }, 
    ];
    return (
        <div className="course-page-container">
            <Header />
            <div className="course-page flex">
                {/* LEFT PANEL */}
                <div className="left-panel">
                <div className="course-name-circle">
                    {courseName}
                </div>
                <div className="buttons-container">
                    <button className="course-btn" onClick={() => navigate(`/course/${courseName}`)}><b>Kreiraj zahtjev</b></button>
                    <button className="course-btn" onClick={() => navigate(`/posts/${courseName}`)}><b>Zahtjevi</b></button>
                    <button className="course-btn" onClick={() => navigate(`/notes/${courseName}`)}><b>Moje bilješke</b></button>
                    <button className="course-btn" onClick={() => navigate(`/script/${courseName}`)}><b>Moje skripte</b></button>
                </div>
                </div>
                {/* RIGHT PANEL */}
                <div className="right-panel">
                <h2>ZAHTJEVI ZA UČENJE – {courseName}</h2>

                {posts.map(post => (
                    <div className="square" key={post.id}>
                    <div className="request-form">

                        <h3>{post.student}</h3>

                        <div className="form-group">
                        <b>Tip učenja:</b> {post.tip}
                        </div>

                        <div className="form-group">
                        <b>Gradivo:</b> {post.gradivo}
                        </div>

                        <div className="form-group">
                        <b>Prijedlog termina:</b> {post.vrijeme}
                        </div>

                        <div className="form-group">
                        <b>Prijedlog lokacije:</b> {post.lokacija}
                        </div>

                        <button className="course-btn1">
                        <b>BeBuddy</b>
                        </button>

                    </div>
                    </div>
                ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}