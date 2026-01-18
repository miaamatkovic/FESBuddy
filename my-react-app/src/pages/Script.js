import React, { useState, useEffect, useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "../styles/Main.css";

export default function Script() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [scripts, setScripts] = useState([]);

  // upload form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  // 1) Get courseId from courseName (kao Notes)
  useEffect(() => {
    if (!currentUser || !currentUser.major) return;

    const getCourseId = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/courses?majorId=${currentUser.major}`
        );
        const allCourses = res.data;

        // OVO prilagodi ako se kod tebe zove "name" umjesto "course_name"
        const course = allCourses.find((c) => c.course_name === courseName || c.name === courseName);

        if (course) {
          setCourseId(course.id_course);
        } else {
          console.error("Course not found:", courseName);
        }
      } catch (e) {
        console.error("Error fetching courses:", e);
      }
    };

    getCourseId();
  }, [courseName, currentUser]);

  // 2) Fetch scripts for user + course
  const fetchScripts = async () => {
    if (!currentUser || !courseId) return;
    try {
      setLoading(true);
        const res = await axios.get(
          `http://localhost:8800/api/scripts/${courseId}`
        );
      setScripts(res.data);
      setErr(null);
    } catch (e) {
      console.error(e);
      setScripts([]);
      setErr("Greška pri dohvaćanju skripti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
    // eslint-disable-next-line
  }, [currentUser, courseId]);

  // 3) Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim()) return setErr("Naslov je obavezan.");
    if (!file) return setErr("Moraš odabrati PDF/DOC/DOCX fajl.");
    if (!courseId) return setErr("Učitavanje kolegija... pokušaj ponovno.");

    try {
      const formData = new FormData();
      formData.append("userId", currentUser.id_user);
      formData.append("courseId", courseId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      await axios.post("http://localhost:8800/api/scripts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setErr(null);

      await fetchScripts();
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message ||
          (typeof e?.response?.data === "string" ? e.response.data : "Greška pri uploadu.")
      );
    }
  };

  // 4) Delete handler
  const handleDelete = async (scriptId) => {
    if (!window.confirm("Jesi siguran/na da želiš obrisati skriptu?")) return;
    try {
      await axios.delete(`http://localhost:8800/api/scripts/${scriptId}`);
      await fetchScripts();
    } catch (e) {
      console.error(e);
      setErr("Greška pri brisanju skripte.");
    }
  };

  return (
    <div className="course-page-container">
      <Header />

      <div className="course-page flex">
        {/* Left Sidebar */}
        <div className="left-panel">
          <div className="course-name-circle">{courseName}</div>
          <div className="buttons-container">
            <button className="course-btn" onClick={() => navigate(`/course/${courseName}`)}>
              <b>Kreiraj zahtjev</b>
            </button>
            <button className="course-btn" onClick={() => navigate(`/posts/${courseName}`)}>
              <b>Zahtjevi</b>
            </button>
            <button className="course-btn" onClick={() => navigate(`/notes/${courseName}`)}>
              <b>Moje bilješke</b>
            </button>
            <button className="course-btn" onClick={() => navigate(`/script/${courseName}`)}>
              <b>Skripte</b>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="right-panel right-panel--notes">
          {/* Upload left */}
          <div className="right-panel-notes--left">
            <h2>UPLOAD SKRIPTE - {courseName}</h2>

            <form onSubmit={handleUpload}>
              <input
                className="input-field"
                type="text"
                placeholder="Naslov skripte"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                className="notes-textarea"
                placeholder="Opis (opcionalno)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                className="input-field"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />

              {err && <span className="error">{err}</span>}

              <button className="course-btn" type="submit">
                <b>Upload</b>
              </button>
            </form>
          </div>

          {/* List right */}
          <div className="right-panel-notes--right">
            <h2>SKRIPTE</h2>

            {loading ? (
              <p>Učitavanje skripti...</p>
            ) : scripts.length === 0 ? (
              <p>Nemaš još skripti za ovaj kolegij.</p>
            ) : (
              <div className="notes-list">
                {scripts.map((s) => (
                  <div key={s.id_script} className="notes-list__note">
                    <p>
                      <b>{s.title}</b>
                    </p>

                    <p>Autor: {s.username}</p>

                    {s.description && <p>{s.description}</p>}

                    <a
                      href={`http://localhost:8800${s.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Otvori / Download
                    </a>

                    {currentUser?.id_user === s.id_user && (
                      <button className="delete-btn" onClick={() => handleDelete(s.id_script)}>
                        Obriši
                      </button>
                    )}
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
