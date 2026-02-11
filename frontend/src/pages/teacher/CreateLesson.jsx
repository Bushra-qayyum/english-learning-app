// src/pages/teacher/CreateLesson.jsx
import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CreateLesson() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    audioUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      Swal.fire("Error", "Title and description are required!", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/lessons", formData);
      Swal.fire({
        title: "Success!",
        text: "Lesson created successfully!",
        icon: "success",
        confirmButtonColor: "#7c3aed"
      }).then(() => {
        navigate("/teacher/lessons");
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create lesson. Please try again.", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "44px", color: "#6b21a8", textAlign: "center", marginBottom: "40px" }}>
            Create New Lesson
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "30px" }}>
              <label style={{ fontSize: "18px", color: "#4c1d95", display: "block", marginBottom: "10px" }}>
                Lesson Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to English Grammar"
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "2px solid #ddd6fe",
                  fontSize: "18px"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ fontSize: "18px", color: "#4c1d95", display: "block", marginBottom: "10px" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description..."
                rows="6"
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "2px solid #ddd6fe",
                  fontSize: "18px",
                  resize: "none"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ fontSize: "18px", color: "#4c1d95", display: "block", marginBottom: "10px" }}>
                Video URL (YouTube)
              </label>
              <input
                type="text"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "2px solid #ddd6fe",
                  fontSize: "18px"
                }}
              />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <label style={{ fontSize: "18px", color: "#4c1d95", display: "block", marginBottom: "10px" }}>
                Audio URL (optional)
              </label>
              <input
                type="text"
                name="audioUrl"
                value={formData.audioUrl}
                onChange={handleChange}
                placeholder="https://example.com/audio.mp3"
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "2px solid #ddd6fe",
                  fontSize: "18px"
                }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "linear-gradient(45deg, #7c3aed, #6b21a8)",
                  color: "white",
                  padding: "18px 60px",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "22px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 30px rgba(124,58,237,0.3)",
                  transition: "all 0.3s",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Creating..." : "Create Lesson"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLesson;