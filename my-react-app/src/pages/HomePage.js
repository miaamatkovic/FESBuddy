// src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";
import Footer from "../pages/Footer";
import Header from "../pages/Header";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import Pomodoro from "./Pomodoro";

export default function MainPage() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [spol, setSpol] = useState("muško");
  const [profileImage, setProfileImage] = useState(null);
  //const [about, setAbout] = useState("");
  const [showCourseList, setShowCourseList] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [major, setMajor] = useState(currentUser?.major || "");
  const [selectedCourses, setSelectedCourses] = useState(currentUser?.selectedCourses || []);
  const navigate = useNavigate();

// sinkronizacija lokalnog state-a s currentUser samo jednom
useEffect(() => {
  if (!currentUser) return;
  //setAbout(currentUser.bio || "");
  setSpol(currentUser.gender || "muško");
  setMajor(currentUser.major || "");
  setSelectedCourses(currentUser.selectedCourses || []);
}, [currentUser?.id_user]);


  // ------------------ FETCH MAJORS ------------------
  useEffect(() => {
    axios.get("http://localhost:8800/api/majors")
      .then(res => setMajors(res.data))
      .catch(err => console.error(err));
  }, []);

  // ------------------ FETCH USER DATA ------------------
useEffect(() => {
  if (!currentUser) return;

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/users/data/${currentUser.id_user}`);
      const updatedUser = {
        ...currentUser,
        major: res.data.major || "",
        selectedCourses: res.data.selectedCourses.map(c => c.course_name),
        gender: res.data.gender || "muško",
        //bio: res.data.bio || "",
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // update localStorage
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, [currentUser?.id_user]);


  // ------------------ FETCH COURSES BY MAJOR ------------------
  useEffect(() => {
    if (!major) return;
    axios.get(`http://localhost:8800/api/courses?majorId=${major}`)
      .then(res => setAvailableCourses(res.data))
      .catch(err => console.error(err));
  }, [major]);

  // ------------------ TOGGLE COURSES ------------------
  const toggleCourse = (courseName) => {
    if (!currentUser) return;
    const updated = selectedCourses.includes(courseName)
      ? selectedCourses.filter(c => c !== courseName)
      : [...selectedCourses, courseName];

    setSelectedCourses(updated);
    setCurrentUser(prev => ({ ...prev, selectedCourses: updated }));

    const selectedIds = availableCourses
      .filter(c => updated.includes(c.course_name))
      .map(c => c.id_course);

    axios.post(`http://localhost:8800/api/users/${currentUser.id_user}/courses`, { courseIds: selectedIds })
      .catch(err => console.error(err));
  };

  // ------------------ CHANGE MAJOR ------------------
  const handleMajorChange = (e) => {
    const newMajor = e.target.value;
    setMajor(newMajor);
    if (!currentUser) return;

    setCurrentUser(prev => ({ ...prev, major: newMajor }));
    axios.post(`http://localhost:8800/api/users/${currentUser.id_user}/major`, { majorId: newMajor })
      .catch(err => console.error(err));
  };

  // ------------------ BIO ------------------

// ------------------ CHANGE GENDER ------------------
const handleSpolChange = async (newSpol) => {
  setSpol(newSpol);
  if (!currentUser) return;

  const updatedUser = { ...currentUser, gender: newSpol };
  setCurrentUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));

  try {
    await axios.post(`http://localhost:8800/api/users/${currentUser.id_user}/gender`, { gender: newSpol });
  } catch (err) {
    console.error(err);
  }
};


  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    setProfileImage(null);
    currentUser && setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="main-page">
      <Header />
      <div className="main-container">
        {/* LEFT COLUMN */}
        <div className="column left-col">
          <img src={spol === "muško" ? "../pictures/avatar_m.svg" : "../pictures/av1.png"} alt="profile" />
          <button>{currentUser?.username || "Korisničko ime"}</button>

          <b>Spol:</b>
          <input type="radio" name="spol" value="muško" checked={spol === "muško"} onChange={() => handleSpolChange("muško")} /> Muško
          <input type="radio" name="spol" value="žensko" checked={spol === "žensko"} onChange={() => handleSpolChange("žensko")} /> Žensko

          <select value={major} onChange={handleMajorChange}>
            <option value="">Odaberi smjer</option>
            {majors.map(m => <option key={m.id_major} value={m.id_major}>{m.name}</option>)}
          </select>

          {/*<textarea placeholder="O meni..." value={about} onChange={(e) => handleBioChange(e.target.value)} />*/}
        </div>

        {/* MIDDLE COLUMN */}
        <div className="column middle-col">
          <h2 className="text-center">MOJI KOLEGIJI</h2>
          <button onClick={() => setShowCourseList(!showCourseList)}>+</button>

          {showCourseList && availableCourses.length > 0 && (
            <div className="course-list">
              {availableCourses.map((course, index) => (
                <button key={course.id_course || index} onClick={() => toggleCourse(course.course_name)} className="block">
                  {course.course_name}
                </button>
              ))}
            </div>
          )}

          <div className="selected-courses">
            {selectedCourses.map((course, index) => (
              <button key={index} onClick={() => navigate(`/course/${encodeURIComponent(course)}`)}>
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <Pomodoro/>
      </div>
      <Footer />
    </div>
  );
}

