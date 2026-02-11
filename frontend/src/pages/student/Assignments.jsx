// src/pages/student/Assignments.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { FaTasks, FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";

function Assignments() {
  const user = JSON.parse(localStorage.getItem("user")) || { _id: null };
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    api.get("/assignments")
      .then(res => {
        const updated = res.data.map(a => ({
          ...a,
          submitted: a.submissions?.some(sub => sub.student === user._id) || false
        }));
        setAssignments(updated);
      })
      .catch(() => {
        alert("Failed to load assignments");
      });
  }, [user._id]);

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
            Assignments
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "50px" }}>
            Complete your assignments to improve your English skills!
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px"
          }}>
            {assignments.length === 0 ? (
              <p style={{ fontSize: "24px", color: "#9ca3af", gridColumn: "1 / -1" }}>
                No assignments available yet. Check back later!
              </p>
            ) : (
              assignments.map(assignment => (
                <Link key={assignment._id} to={`/assignments/${assignment._id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: assignment.submitted ? "#bbf7d0" : "#f3e8ff",
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
                      <FaTasks style={{ fontSize: "40px", color: "#7c3aed", marginRight: "15px" }} />
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
                        background: assignment.submitted ? "#bbf7d0" : "#fecaca",
                        color: assignment.submitted ? "#166534" : "#991b1b",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}>
                        {assignment.submitted ? <><FaCheckCircle style={{ marginRight: "8px" }} />Submitted</> : <><FaClock style={{ marginRight: "8px" }} />Pending</>}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assignments;