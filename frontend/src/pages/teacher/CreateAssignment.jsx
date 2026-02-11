// src/pages/teacher/CreateAssignment.jsx
import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CreateAssignment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.deadline) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/assignments", formData);
      Swal.fire({
        title: "Success!",
        text: "Assignment created successfully!",
        icon: "success",
        confirmButtonColor: "#7c3aed"
      }).then(() => {
        navigate("/teacher/assignments");
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to create assignment. Please try again.", "error");
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
            Create New Assignment
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "30px" }}>
              <label style={{ fontSize: "18px", color: "#4c1d95", display: "block", marginBottom: "10px" }}>
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Write an Essay on My Hobby"
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
                placeholder="Write detailed instructions..."
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

            <div style={{ marginBottom: "40px" }}>
              <label style={{ fontSize: "18px", color: "#4c1d95", display: "block", marginBottom: "10px" }}>
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
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

            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                  color: "white",
                  padding: "18px 60px",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "22px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 30px rgba(231,76,60,0.3)",
                  transition: "all 0.3s",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAssignment;