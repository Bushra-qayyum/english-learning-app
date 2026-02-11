// src/pages/teacher/TeacherAssignments.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { FaTasks, FaPlus, FaUsers, FaCalendarAlt } from "react-icons/fa";

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/assignments")
      .then(res => setAssignments(res.data))
      .catch(() => {
        setAssignments([
          { _id: 1, title: "Grammar Basics", description: "Write a detailed note on Noun.", deadline: "2025-12-20", submissions: [{}, {}, {}] },
          { _id: 2, title: "Vocabulary Quiz", description: "Write 10 sentences using new words.", deadline: "2025-12-25", submissions: [{}] }
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
            My Assignments
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "50px" }}>
            Create and grade student assignments
          </p>

          <Link to="/teacher/assignments/create">
            <button style={{
              background: "linear-gradient(45deg, #e74c3c, #c0392b)",
              color: "white",
              padding: "18px 50px",
              border: "none",
              borderRadius: "30px",
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(231,76,60,0.3)",
              transition: "all 0.3s",
              marginBottom: "50px",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px"
            }}
            onMouseOver={e => e.target.style.transform = "scale(1.05)"}
            onMouseOut={e => e.target.style.transform = "scale(1)"}
            >
              <FaPlus /> Create New Assignment
            </button>
          </Link>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px"
          }}>
            {assignments.length === 0 ? (
              <p style={{ fontSize: "24px", color: "#9ca3af", gridColumn: "1 / -1" }}>
                No assignments created yet.
              </p>
            ) : (
              assignments.map(assignment => (
                <div
                  key={assignment._id}
                  onClick={() => navigate(`/teacher/assignments/${assignment._id}`)}
                  style={{
                    background: "#f3e8ff",
                    padding: "30px",
                    borderRadius: "32px",
                    boxShadow: "0 10px 30px rgba(139,92,246,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    border: "1px solid #ddd6fe"
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-10px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <FaTasks style={{ fontSize: "40px", color: "#e74c3c", marginRight: "15px" }} />
                    <h3 style={{ fontSize: "26px", color: "#6b21a8", margin: "0" }}>
                      {assignment.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "18px", color: "#4c1d95", lineHeight: "1.6", marginBottom: "20px" }}>
                    {assignment.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", color: "#9333ea" }}>
                      <FaCalendarAlt style={{ marginRight: "8px" }} />
                      Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : "No deadline"}
                    </span>
                    <span style={{
                      background: "#fed7aa",
                      color: "#9a3412",
                      padding: "12px 20px",
                      borderRadius: "30px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <FaUsers />
                      {assignment.submissions?.length || 0} Submissions
                    </span>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <span style={{ fontSize: "16px", color: "#7c3aed", fontWeight: "bold" }}>
                      Click to view submissions →
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

export default TeacherAssignments;