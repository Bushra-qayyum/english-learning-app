// src/pages/student/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaBookOpen, FaTasks, FaTrophy, FaFire, FaBell } from "react-icons/fa";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    pendingAssignments: 0,
    totalPoints: 0,
    currentStreak: 0,
    marks: [] // <-- Marks add ki
  });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get("/student/stats")
      .then(res => setStats(res.data))
      .catch(() => {
        setStats({
          totalLessons: 12,
          completedLessons: 8,
          pendingAssignments: 3,
          totalPoints: 2041,
          currentStreak: 7,
          marks: [85, 92, 78]
        });
      });

    api.get("/student/announcements")
      .then(res => setAnnouncements(res.data))
      .catch(() => {
        setAnnouncements([
          "New assignment: Write an Essay on My Hobby (Due: Jan 10)",
          "New lesson: Introduction to Grammar added",
          "Live session scheduled for tomorrow at 5 PM"
        ]);
      });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "48px", color: "#6b21a8", textAlign: "center", marginBottom: "15px" }}>
            Welcome back, {user.name}! 🎉
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", textAlign: "center", marginBottom: "50px" }}>
            Let's continue your English learning journey!
          </p>

          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            marginBottom: "60px"
          }}>
            <div style={{
              background: "#f3e8ff",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(139,92,246,0.1)",
              textAlign: "center",
              borderLeft: "6px solid #a78bfa"
            }}>
              <FaBookOpen style={{ fontSize: "50px", color: "#7c3aed", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#4c1d95" }}>Lessons Progress</h3>
              <p style={{ fontSize: "36px", fontWeight: "bold", color: "#6b21a8" }}>
                {stats.completedLessons}/{stats.totalLessons}
              </p>
            </div>

            <div style={{
              background: "#fecaca",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(239,68,68,0.2)",
              textAlign: "center",
              borderLeft: "6px solid #ef4444"
            }}>
              <FaTasks style={{ fontSize: "50px", color: "#dc2626", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#991b1b" }}>Pending Assignments</h3>
              <p style={{ fontSize: "42px", fontWeight: "bold", color: "#b91c1c" }}>
                {stats.pendingAssignments}
              </p>
            </div>

            <div style={{
              background: "#bbf7d0",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(34,197,94,0.2)",
              textAlign: "center",
              borderLeft: "6px solid #22c55e"
            }}>
              <FaTrophy style={{ fontSize: "50px", color: "#16a34a", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#166534" }}>Total Points</h3>
              <p style={{ fontSize: "42px", fontWeight: "bold", color: "#15803d" }}>
                {stats.totalPoints.toLocaleString()}
              </p>
            </div>

            <div style={{
              background: "#fef3c7",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(251,191,36,0.2)",
              textAlign: "center",
              borderLeft: "6px solid #eab308"
            }}>
              <FaFire style={{ fontSize: "50px", color: "#ca8a04", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#854d0e" }}>Current Streak</h3>
              <p style={{ fontSize: "42px", fontWeight: "bold", color: "#92400e" }}>
                {stats.currentStreak} days
              </p>
            </div>
          </div>

          {/* Announcements */}
          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe"
          }}>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", textAlign: "center", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
              <FaBell style={{ fontSize: "36px" }} />
              Recent Announcements
            </h2>

            {announcements.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "20px", color: "#9ca3af", fontStyle: "italic" }}>
                No new announcements right now. Check back soon!
              </p>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {announcements.map((ann, index) => (
                  <div key={index} style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    borderLeft: "5px solid #7c3aed",
                    fontSize: "18px",
                    color: "#4c1d95"
                  }}>
                    📢 {ann}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;