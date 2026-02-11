// src/pages/teacher/TeacherLessons.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { FaBookOpen, FaUsers, FaPlus } from "react-icons/fa";

function TeacherLessons() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/lessons")
      .then(res => setLessons(res.data))
      .catch(() => {
        // Demo data
        setLessons([
          { _id: 1, title: "Introduction to English Grammar", description: "Basic grammar rules and sentence structure", completedBy: [1,2,3,4,5] },
          { _id: 2, title: "Daily Conversations", description: "Common phrases for everyday communication", completedBy: [1,2] }
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
            My Lessons
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "50px" }}>
            Create and manage your teaching content
          </p>

          <Link to="/teacher/lessons/create">
            <button style={{
              background: "linear-gradient(45deg, #7c3aed, #6b21a8)",
              color: "white",
              padding: "18px 50px",
              border: "none",
              borderRadius: "30px",
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(124,58,237,0.3)",
              transition: "all 0.3s",
              marginBottom: "50px",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px"
            }}
            onMouseOver={e => e.target.style.transform = "scale(1.05)"}
            onMouseOut={e => e.target.style.transform = "scale(1)"}
            >
              <FaPlus /> Create New Lesson
            </button>
          </Link>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px"
          }}>
            {lessons.length === 0 ? (
              <p style={{ fontSize: "24px", color: "#9ca3af", gridColumn: "1 / -1" }}>
                No lessons created yet. Click above to create your first lesson!
              </p>
            ) : (
              lessons.map(lesson => (
                <div
                  key={lesson._id}
                  onClick={() => navigate(`/teacher/lesson/${lesson._id}`)}
                  style={{
                    background: "#f3e8ff",
                    padding: "30px",
                    borderRadius: "24px",
                    boxShadow: "0 10px 30px rgba(139,92,246,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    border: "1px solid #ddd6fe"
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-10px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <FaBookOpen style={{ fontSize: "40px", color: "#7c3aed", marginRight: "15px" }} />
                    <h3 style={{ fontSize: "26px", color: "#6b21a8", margin: "0" }}>
                      {lesson.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "18px", color: "#4c1d95", lineHeight: "1.6", marginBottom: "20px" }}>
                    {lesson.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", color: "#22c55e", fontWeight: "bold" }}>
                      <FaUsers style={{ marginRight: "8px" }} />
                      {lesson.completedBy?.length || 0} students completed
                    </span>
                    <span style={{ fontSize: "16px", color: "#7c3aed", fontWeight: "bold" }}>
                      View Details →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLessons;