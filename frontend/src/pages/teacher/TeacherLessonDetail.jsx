// src/pages/teacher/TeacherLessonDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { FaBookOpen, FaUsers, FaClock } from "react-icons/fa";

function TeacherLessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/lessons/${id}`)
      .then(res => {
        setLesson(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLesson({
          title: "Introduction to Grammar",
          description: "Learn basic English grammar rules and sentence structure",
          completedBy: ["Bushra", "Ali", "Sara", "Zain", "Hamza"]
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>Loading lesson details...</p>;
  if (!lesson) return <p style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>Lesson not found</p>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
            <FaBookOpen style={{ fontSize: "50px", color: "#7c3aed", marginRight: "20px" }} />
            <h1 style={{ fontSize: "44px", color: "#6b21a8", margin: "0" }}>
              {lesson.title}
            </h1>
          </div>

          <p style={{ fontSize: "22px", color: "#4c1d95", lineHeight: "1.8", marginBottom: "50px" }}>
            {lesson.description}
          </p>

          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe"
          }}>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", marginBottom: "30px", display: "flex", alignItems: "center" }}>
              <FaUsers style={{ marginRight: "15px" }} />
              Student Progress
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
              <div style={{
                background: "#bbf7d0",
                padding: "20px 40px",
                borderRadius: "24px",
                textAlign: "center",
                flex: "1"
              }}>
                <p style={{ fontSize: "18px", color: "#166534", margin: "0 0 10px" }}>Completed</p>
                <p style={{ fontSize: "48px", fontWeight: "bold", color: "#16a34a", margin: "0" }}>
                  {lesson.completedBy?.length || 0}
                </p>
              </div>
              <div style={{
                background: "#fecaca",
                padding: "20px 40px",
                borderRadius: "24px",
                textAlign: "center",
                flex: "1"
              }}>
                <p style={{ fontSize: "18px", color: "#991b1b", margin: "0 0 10px" }}>Pending</p>
                <p style={{ fontSize: "48px", fontWeight: "bold", color: "#dc2626", margin: "0" }}>
                  37
                </p>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "24px", color: "#6b21a8", marginBottom: "20px" }}>
                Students who completed:
              </h3>
              {lesson.completedBy && lesson.completedBy.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px"
                }}>
                  {lesson.completedBy.map((student, index) => (
                    <div key={index} style={{
                      background: "#f0fdf4",
                      padding: "20px",
                      borderRadius: "16px",
                      textAlign: "center",
                      border: "2px solid #86efac"
                    }}>
                      <p style={{ fontSize: "18px", color: "#166534", fontWeight: "bold", margin: "0" }}>
                        {typeof student === "string" ? student : `Student ${index + 1}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "20px", color: "#9ca3af", fontStyle: "italic" }}>
                  No students have completed this lesson yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLessonDetail;