// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { FaBookReader, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="app-logo">
          <FaBookReader className="logo-icon" />
          <span className="brand-name">English Learning App</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-section">
          <FaUserCircle className="profile-icon" title="Profile" />
          <div className="user-details">
            <span className="user-name">{user?.name || "Student"}</span>
            <span className="user-role">{(user?.role || "student").toUpperCase()}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;