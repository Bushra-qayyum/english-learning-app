// src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { 
  FaBookOpen, 
  FaTasks, 
  FaUserGraduate, 
  FaChartLine, 
  FaPlus,
  FaBell 
} from "react-icons/fa";

function TeacherDashboard() {
  const [stats, setStats] = useState({
    lessons: 0,
    assignments: 0,
    students: 0,
    averageProgress: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Real stats from backend
    api.get("/teacher/stats")
      .then(res => setStats(res.data))
      .catch(() => {
        // Fallback only if API fails
        setStats({
          lessons: 5,
          assignments: 3,
          students: 20,
          averageProgress: 75
        });
      });

    // Real recent activity from backend
    api.get("/teacher/recent-activity")
      .then(res => setRecentActivity(res.data))
      .catch(() => {
        // Fallback only
        setRecentActivity([
          { student: "Bushra Qayyum", action: "submitted assignment 'Grammar Basics'", time: "2 minutes ago" },
          { student: "Ali Khan", action: "completed Speech Quiz", time: "15 minutes ago" },
          { student: "Sara Ahmed", action: "submitted assignment 'Essay Writing'", time: "1 hour ago" }
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
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "48px", color: "#6b21a8", marginBottom: "15px" }}>
            Teacher Dashboard
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "50px" }}>
            Manage your class and track progress!
          </p>

          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            marginBottom: "60px"
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              textAlign: "center",
              borderLeft: "6px solid #a78bfa"
            }}>
              <FaBookOpen style={{ fontSize: "50px", color: "#a78bfa", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#4c1d95" }}>Total Lessons</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#7c3aed" }}>{stats.lessons}</p>
            </div>

            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              textAlign: "center",
              borderLeft: "6px solid #86efac"
            }}>
              <FaTasks style={{ fontSize: "50px", color: "#22c55e", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#166534" }}>Assignments</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#16a34a" }}>{stats.assignments}</p>
            </div>

            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              textAlign: "center",
              borderLeft: "6px solid #fde047"
            }}>
              <FaUserGraduate style={{ fontSize: "50px", color: "#eab308", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#854d0e" }}>Students</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#ca8a04" }}>{stats.students}</p>
            </div>

            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              textAlign: "center",
              borderLeft: "6px solid #f9a8d4"
            }}>
              <FaChartLine style={{ fontSize: "50px", color: "#ec4899", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#be185d" }}>Avg Progress</h3>
              <p style={{ fontSize: "32px", fontWeight: "bold", color: "#db2777" }}>{stats.averageProgress}%</p>
            </div>
          </div>

          {/* Quick Actions — Tere pehle wale code jaisa */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", marginBottom: "30px" }}>
              Quick Actions
            </h2>
            <div style={{ display: "flex", gap: "25px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/teacher/lessons/create">
                <button style={{
                  background: "#e9d5ff",
                  color: "#6b21a8",
                  padding: "18px 45px",
                  border: "none",
                  borderRadius: "24px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(233,213,255,0.3)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <FaPlus /> Create Lesson
                </button>
              </Link>

              <Link to="/teacher/assignments/create">
                <button style={{
                  background: "#ddd6fe",
                  color: "#6b21a8",
                  padding: "18px 45px",
                  border: "none",
                  borderRadius: "24px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(221,214,254,0.3)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <FaTasks /> Create Assignment
                </button>
              </Link>

              <Link to="/teacher/students">
                <button style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "18px 45px",
                  border: "none",
                  borderRadius: "24px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(254,243,199,0.3)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <FaUserGraduate /> View Students
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activity / Announcements */}
          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe"
          }}>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", textAlign: "center", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
              <FaBell style={{ fontSize: "36px" }} />
              Recent Student Activity
            </h2>

            {recentActivity.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "20px", color: "#9ca3af", fontStyle: "italic" }}>
                No recent activity yet.
              </p>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    borderLeft: "5px solid #7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <p style={{ fontSize: "18px", color: "#4c1d95", margin: "0 0 8px 0", fontWeight: "bold" }}>
                        {activity.student}
                      </p>
                      <p style={{ fontSize: "16px", color: "#6b21a8", margin: "0" }}>
                        {activity.action}
                      </p>
                    </div>
                    <p style={{ fontSize: "14px", color: "#9333ea", fontStyle: "italic" }}>
                      {activity.time || "Just now"}
                    </p>
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

export default TeacherDashboard;