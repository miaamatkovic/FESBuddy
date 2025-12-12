// File: src/App.js
/*
 import "./App.css";
 import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import LoginPage from "./pages/LoginPage";
 import RegisterPage from "./pages/RegisterPage";
 import HomePage from "./pages/HomePage";
 import Match from "./pages/Match";
 import CoursePage from "./pages/CoursePage";
import Script from "./pages/Script";
 import Notes from "./pages/Notes";
import Connected from "./pages/Connected";

 function App() {

   const router = createBrowserRouter([
    
     {
       path: "/login",
       element: <LoginPage />,
     },
     {
       path: "/",
       element: <LoginPage />,
     },
     {
       path: "/register",
       element: <RegisterPage />,
     },
     {
       path: "/HomePage",
       element: <HomePage />,
     },
     {
      path: "/Match",
      element: <Match />
     },
     {
      path: "/course/:courseName",
      element: <CoursePage />
     },
     {
      path: "/script/:courseName",
      element: <Script />
     },
     {
      path: "/notes/:courseName",
      element: <Notes />
     },
     {
      path: "/Connected",
      element: <Connected />
     },

   ]);

   return <RouterProvider router={router} />;
 }

 export default App;*/

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
import Connected from "./pages/Connected";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/Match" element={<Match />} />
        <Route path="/course/:courseName" element={<CoursePage />} />
        <Route path="/script/:courseName" element={<Script />} />
        <Route path="/notes/:courseName" element={<Notes />} />
        <Route path="/Connected" element={<Connected />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


