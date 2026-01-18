import React, { useState, useEffect, useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../styles/Main.css";


export default function Notes() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get course ID from course name
  useEffect(() => {
    if (!currentUser || !currentUser.major) return;

    const getCourseId = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/courses?majorId=${currentUser.major}`);
        const allCourses = res.data;
        const course = allCourses.find(c => c.course_name === courseName);
        if (course) {
          setCourseId(course.id_course);
        } else {
          console.error("Course not found:", courseName);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    getCourseId();
  }, [courseName, currentUser]);

  // Fetch notes for the current user and course
  useEffect(() => {
    if (!currentUser || !courseId) return;

    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8800/api/notes/${currentUser.id_user}/${courseId}`
        );
        setNotes(res.data);
        setErr(null);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [currentUser, courseId]);

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!note.trim()) {
      setErr("Bilješka ne može biti prazna!");
      return;
    }

    if (!courseId) {
      setErr("Učitavanje kolegija... pokušajte ponovno.");
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/notes", {
        userId: currentUser.id_user,
        courseId: courseId,
        noteText: note
      });

      setNote("");
      setErr(null);

      // Refresh notes list
      const res = await axios.get(
        `http://localhost:8800/api/notes/${currentUser.id_user}/${courseId}`
      );
      setNotes(res.data);
    } catch (err) {
      if (err?.response?.data?.sqlMessage) {
        setErr(err.response.data.sqlMessage);
      } else if (err?.response?.data) {
        setErr(JSON.stringify(err.response.data));
      } else {
        setErr("Greška prilikom dodavanja bilješke!");
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Jeste li sigurni da želite obrisati ovu bilješku?")) {
      try {
        await axios.delete(`http://localhost:8800/api/notes/${noteId}`);
        
        // Refresh notes list
        const res = await axios.get(
          `http://localhost:8800/api/notes/${currentUser.id_user}/${courseId}`
        );
        setNotes(res.data);
      } catch (err) {
        setErr("Greška prilikom brisanja bilješke!");
      }
    }
  };

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
            <button className="course-btn" onClick={() => navigate(`/posts/${courseName}`)}><b>Zahtjevi</b></button>
            <button className="course-btn" onClick={() => navigate(`/notes/${courseName}`)}><b>Moje bilješke</b></button>
            <button className="course-btn" onClick={() => navigate(`/script/${courseName}`)}><b>Skripte</b></button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="right-panel right-panel--notes">
          <div className="right-panel-notes--left">
            <h2>NAPIŠI BILJEŠKE - {courseName}</h2>
            <form onSubmit={handleAddNote}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                className="notes-textarea"
                placeholder="Ovdje možete pisati i spremati svoje bilješke za kolegij."
              ></textarea>
              {err && <span className="error">{err}</span>}
              <button className="course-btn" type="submit"><b>Dodaj bilješku</b></button>
            </form>
          </div>

          <div className="right-panel-notes--right">
            <h2>MOJE BILJEŠKE</h2>
            {loading ? (
              <p>Učitavanje bilješki...</p>
            ) : notes.length === 0 ? (
              <p>Nemaš još bilješki za ovaj kolegij.</p>
            ) : (
              <div className="notes-list">
                {notes.map((n) => (
                  <div key={n.id_note} className="notes-list__note">
                    <p>{n.text}</p>
                    <button className="delete-btn" onClick={() => handleDeleteNote(n.id_note)}>Obriši</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}