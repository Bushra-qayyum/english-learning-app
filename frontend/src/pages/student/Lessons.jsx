// src/pages/student/Lessons.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { FaBookOpen, FaUser, FaClock } from "react-icons/fa";

function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    api.get("/lessons")
      .then(res => setLessons(res.data))
      .catch(() => {
        // Demo data
        setLessons([
          { _id: 1, title: "Basic Greetings", description: "Learn how to greet people in English", teacher: { name: "Haleema" } },
          { _id: 2, title: "Daily Conversations", description: "Practice everyday English conversations", teacher: { name: "Ali" } }
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
            All Lessons
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "50px" }}>
            Choose a lesson to start learning!
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px"
          }}>
            {lessons.map(lesson => (
              <Link key={lesson._id} to={`/lessons/${lesson._id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#f3e8ff",
                  padding: "30px",
                  borderRadius: "24px",
                  boxShadow: "0 10px 30px rgba(139,92,246,0.1)",
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
                    <span style={{ fontSize: "16px", color: "#9333ea" }}>
                      <FaUser style={{ marginRight: "8px" }} />
                      {lesson.teacher?.name || "Teacher"}
                    </span>
                    <span style={{ fontSize: "16px", color: "#7c3aed" }}>
                      <FaClock style={{ marginRight: "8px" }} />
                      20 min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {lessons.length === 0 && (
            <p style={{ fontSize: "24px", color: "#9ca3af", marginTop: "60px" }}>
              No lessons available yet. Check back later!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lessons;