import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // LOGIN
  const login = async (inputs) => {
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", inputs, { withCredentials: true });
      let user = res.data;

      // Dohvati odabrani major, gender i kolegije
      const userDataRes = await axios.get(`http://localhost:8800/api/users/data/${user.id_user}`);
      user = {
        ...user,
        major: userDataRes.data.major || "",
        selectedCourses: userDataRes.data.selectedCourses.map(c => c.course_name),
        gender: userDataRes.data.gender || "muško"
      };

      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const msg = err.response?.data?.sqlMessage || err.response?.data || err.message;
      alert("Login failed: " + msg);
    }
  };

  // LOGOUT
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Automatski spremi promjene currentUser u localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
