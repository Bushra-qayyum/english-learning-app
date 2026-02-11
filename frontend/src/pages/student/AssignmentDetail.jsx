// src/pages/student/AssignmentDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Student", _id: null };
  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);

  const fetchAssignment = useCallback(() => {
    api.get(`/assignments/${id}`)
      .then(res => {
        setAssignment(res.data);
        const sub = res.data.submissions?.find(sub => sub.student === user._id);
        setSubmitted(!!sub);
        setMarks(sub ? sub.marks : null);
      })
      .catch(() => {
        alert("Assignment not found");
      });
  }, [id, user._id]);

  useEffect(() => {
    fetchAssignment();
    const interval = setInterval(fetchAssignment, 30000);
    return () => clearInterval(interval);
  }, [fetchAssignment]);

  const handleSubmit = async () => {
    if (!answer.trim()) return Swal.fire("Error", "Please write your answer!", "error");

    try {
      await api.post(`/assignments/${id}/submit`, { answer: answer.trim() });
      Swal.fire({
        title: "Submitted!",
        text: `Your assignment has been submitted successfully, ${user.name}! 🎉`,
        icon: "success",
        confirmButtonColor: "#7c3aed"
      });
      setSubmitted(true);
      navigate("/assignments");
    } catch {
      Swal.fire("Error", "Failed to submit. Try again!", "error");
    }
  };

  if (!assignment) return <p style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>Loading...</p>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "44px", color: "#6b21a8", marginBottom: "20px" }}>
            {assignment.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "40px" }}>
            <FaCalendarAlt style={{ fontSize: "28px", color: "#7c3aed" }} />
            <p style={{ fontSize: "22px", color: "#9333ea", margin: "0" }}>
              Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : "No deadline"}
            </p>
          </div>

          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe",
            marginBottom: "50px"
          }}>
            <p style={{ fontSize: "22px", color: "#4c1d95", lineHeight: "1.8" }}>
              {assignment.description}
            </p>
          </div>

          {marks !== null && (
            <div style={{
              background: "#bbf7d0",
              color: "#166534",
              padding: "40px",
              borderRadius: "24px",
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "50px"
            }}>
              <FaCheckCircle style={{ fontSize: "60px", marginBottom: "20px" }} />
              Your Marks: {marks}/100
            </div>
          )}

          {submitted ? (
            <div style={{
              background: "#bbf7d0",
              color: "#166534",
              padding: "60px",
              borderRadius: "24px",
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "bold"
            }}>
              <FaCheckCircle style={{ fontSize: "80px", marginBottom: "30px" }} />
              Assignment Submitted Successfully!
              <p style={{ fontSize: "22px", marginTop: "20px" }}>
                You cannot submit again.
              </p>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: "32px", color: "#6b21a8", marginBottom: "20px" }}>
                Submit Your Answer
              </h2>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your detailed answer here..."
                style={{
                  width: "100%",
                  height: "350px",
                  padding: "25px",
                  borderRadius: "20px",
                  border: "2px solid #ddd6fe",
                  fontSize: "18px",
                  resize: "none",
                  marginBottom: "30px"
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                  color: "white",
                  padding: "20px 60px",
                  border: "none",
                  borderRadius: "50px",
                  fontSize: "22px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(231,76,60,0.4)",
                  transition: "all 0.3s"
                }}
              >
                Submit Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetail;