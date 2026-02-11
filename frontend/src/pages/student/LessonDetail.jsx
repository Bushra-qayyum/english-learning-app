// src/pages/student/LessonDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaArrowLeft, FaVideo, FaVolumeUp, FaCheckCircle } from "react-icons/fa";

function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    api.get(`/lessons/${id}`)
      .then(res => setLesson(res.data))
      .catch(() => console.error("Failed to load lesson"));
  }, [id]);

  const markComplete = async () => {
    if (lesson.completed) return;

    try {
      const res = await api.post(`/lessons/${id}/complete`);
      alert(`🎉 ${res.data.message}\nPoints: ${res.data.points}`);
      setLesson({ ...lesson, completed: true });
    } catch {
      alert("❌ Failed to mark as complete. Try again!");
    }
  };

  if (!lesson) return <p style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>Loading lesson...</p>;

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
          <Link to="/lessons" style={{
            display: "inline-flex",
            alignItems: "center",
            color: "#7c3aed",
            fontSize: "20px",
            marginBottom: "30px",
            textDecoration: "none"
          }}>
            <FaArrowLeft style={{ marginRight: "10px" }} />
            Back to Lessons
          </Link>

          <h1 style={{ fontSize: "48px", color: "#6b21a8", marginBottom: "20px" }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize: "22px", color: "#4c1d95", lineHeight: "1.8", marginBottom: "40px" }}>
            {lesson.description}
          </p>

          {lesson.videoUrl && (
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontSize: "32px", color: "#6b21a8", marginBottom: "20px", display: "flex", alignItems: "center" }}>
                <FaVideo style={{ marginRight: "15px" }} />
                Watch Video
              </h2>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "24px", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}>
                <iframe
                  src={lesson.videoUrl.replace("watch?v=", "embed/")}
                  title="Lesson Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "24px"
                  }}
                ></iframe>
              </div>
            </div>
          )}

          {lesson.audioUrl && (
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontSize: "32px", color: "#6b21a8", marginBottom: "20px", display: "flex", alignItems: "center" }}>
                <FaVolumeUp style={{ marginRight: "15px" }} />
                Listen to Audio
              </h2>
              <audio controls style={{
                width: "100%",
                height: "60px",
                borderRadius: "30px"
              }}>
                <source src={lesson.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={markComplete}
              disabled={lesson.completed}
              style={{
                background: lesson.completed ? "#e5e7eb" : "linear-gradient(45deg, #7c3aed, #6b21a8)",
                color: lesson.completed ? "#9ca3af" : "white",
                padding: "20px 60px",
                border: "none",
                borderRadius: "50px",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: lesson.completed ? "not-allowed" : "pointer",
                boxShadow: lesson.completed ? "none" : "0 15px 40px rgba(124,58,237,0.3)",
                transition: "all 0.3s"
              }}
              onMouseOver={e => !lesson.completed && (e.target.style.transform = "scale(1.05)")}
              onMouseOut={e => e.target.style.transform = "scale(1)"}
            >
              {lesson.completed ? (
                <>
                  <FaCheckCircle style={{ marginRight: "12px" }} />
                  Completed
                </>
              ) : (
                <>
                  🎯 Mark as Complete (+100 points)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonDetail;