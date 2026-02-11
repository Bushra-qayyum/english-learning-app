// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaTasks,
  FaVideo,
  FaChartLine,
  FaUsers,
  FaCog,
  FaUserGraduate,
  FaComments,
  FaTrophy,
  FaCertificate,
  FaMicrophone,
  FaHeadphones,
  FaClipboardList // <-- YE SAHI ICON HAI QUIZZES KE LIYE (FaClipboardQuestion nahi tha)
} from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar({ role }) {
  const location = useLocation();
  const userRole = role ? role.toLowerCase() : "student";

  let menu = [];

  if (userRole === "student") {
    menu = [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Lessons", path: "/lessons", icon: <FaBook /> },
      { name: "Assignments", path: "/assignments", icon: <FaTasks /> },
      { name: "Quizzes", path: "/quizzes", icon: <FaClipboardList /> },
      { name: "Speech Quiz", path: "/speech-quiz", icon: <FaMicrophone /> },
      { name: "Speech Practice", path: "/speech-practice", icon: <FaHeadphones /> },
      { name: "Live Sessions", path: "/livesessions", icon: <FaVideo /> },
      { name: "My Progress", path: "/progress", icon: <FaChartLine /> },
      { name: "Leaderboard", path: "/leaderboard", icon: <FaTrophy /> },
      { name: "Community", path: "/community", icon: <FaComments /> },
      { name: "Certificate", path: "/certificate", icon: <FaCertificate /> },
    ];
  } else if (userRole === "teacher") {
    menu = [
      { name: "Dashboard", path: "/teacher/dashboard", icon: <FaTachometerAlt /> },
      { name: "Students", path: "/teacher/students", icon: <FaUserGraduate /> },
      { name: "Assignments", path: "/teacher/assignments", icon: <FaTasks /> },
      { name: "Quizzes", path: "/teacher/quizzes", icon: <FaClipboardList /> }, // <-- YE FIXED
      { name: "Live Sessions", path: "/teacher/livesessions", icon: <FaVideo /> },
      { name: "Progress Report", path: "/teacher/progress", icon: <FaChartLine /> },
      { name: "Community", path: "/teacher/community", icon: <FaComments /> },
    ];
  } else if (userRole === "admin") {
    menu = [
      { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
      { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
      { name: "Analytics", path: "/admin/analytics", icon: <FaChartLine /> },
      { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
    ];
  }

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">{userRole.toUpperCase()}</h2>
      <ul className="sidebar-menu">
        {menu.map((item, index) => (
          <li key={index} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path} className="sidebar-link">
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;