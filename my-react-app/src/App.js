// File: src/App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Match from "./pages/Match";
import CoursePage from "./pages/CoursePage";
import Script from "./pages/Script";
import Notes from "./pages/Notes";
import Posts from "./pages/Posts";
import Connected from "./pages/Connected";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/match" element={<Match />} />
        <Route path="/course/:courseName" element={<CoursePage />} />
        <Route path="/script/:courseName" element={<Script />} />
        <Route path="/notes/:courseName" element={<Notes />} />
        <Route path="/posts/:courseName" element={<Posts />} />
        <Route path="/Connected" element={<Connected />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


