import { Link } from "react-router-dom";
//import "../styles/Main.css";

export default function Footer() {
  return (
    <footer>
      <p>© 2025 FESBuddy. Sva prava pridržana.</p>
      <div className="footer-links">
        <Link to="/about">O nama</Link>
        <hr></hr>
        <Link to="/contact">Kontakt</Link>
        <hr></hr>
        <Link to="/privacy">Politika privatnosti</Link>
      </div>
    </footer>
  );
  
}