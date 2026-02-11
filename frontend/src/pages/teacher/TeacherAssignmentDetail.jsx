// src/pages/teacher/TeacherAssignmentDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import { FaUser, FaCheckCircle } from "react-icons/fa";

function TeacherAssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [markInputs, setMarkInputs] = useState({});

  useEffect(() => {
    api.get(`/assignments/${id}`)
      .then(res => setAssignment(res.data))
      .catch(() => {
        setAssignment({
          title: "Write an Essay on My Hobby",
          submissions: [
            { _id: "1", studentName: "Bushra Qayyum", answer: "My hobby is reading books...", marks: undefined },
            { _id: "2", studentName: "Ali Khan", answer: "I love playing cricket...", marks: 85 }
          ]
        });
      });
  }, [id]);

  const giveMarks = async (submissionId) => {
    const marks = markInputs[submissionId];
    if (!marks || marks < 0 || marks > 100) {
      Swal.fire("Invalid", "Please enter marks between 0-100", "warning");
      return;
    }

    try {
      await api.post(`/assignments/${id}/grade`, { submissionId, marks: Number(marks) });
      Swal.fire("Success!", `Marks ${marks}/100 given successfully!`, "success");
      
      // Refresh
      api.get(`/assignments/${id}`).then(res => setAssignment(res.data));
      setMarkInputs(prev => ({ ...prev, [submissionId]: "" }));
    } catch {
      Swal.fire("Error", "Failed to give marks", "error");
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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "44px", color: "#6b21a8", textAlign: "center", marginBottom: "40px" }}>
            {assignment.title}
          </h1>

          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "24px", color: "#9333ea" }}>
              Total Submissions: <strong>{assignment.submissions?.length || 0}</strong>
            </p>
          </div>

          {assignment.submissions?.map(sub => (
            <div key={sub._id} style={{
              background: "#f3e8ff",
              padding: "35px",
              borderRadius: "24px",
              marginBottom: "30px",
              border: "2px solid #ddd6fe",
              boxShadow: "0 10px 30px rgba(139,92,246,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <FaUser style={{ fontSize: "40px", color: "#7c3aed", marginRight: "15px" }} />
                <h3 style={{ fontSize: "28px", color: "#6b21a8", margin: "0" }}>
                  {sub.studentName || "Student"}
                </h3>
              </div>

              <div style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                marginBottom: "30px",
                minHeight: "150px"
              }}>
                <p style={{ fontSize: "18px", color: "#4c1d95", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                  {sub.answer || "No answer submitted yet."}
                </p>
              </div>

              {sub.marks !== undefined ? (
                <div style={{
                  background: "#bbf7d0",
                  color: "#166534",
                  padding: "25px",
                  borderRadius: "24px",
                  textAlign: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px"
                }}>
                  <FaCheckCircle style={{ fontSize: "50px" }} />
                  Marks Given: {sub.marks}/100
                </div>
              ) : (
                <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "center" }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter marks (0-100)"
                    value={markInputs[sub._id] || ""}
                    onChange={(e) => setMarkInputs({ ...markInputs, [sub._id]: e.target.value })}
                    style={{
                      padding: "18px",
                      width: "200px",
                      borderRadius: "16px",
                      border: "2px solid #ddd6fe",
                      fontSize: "20px",
                      textAlign: "center"
                    }}
                  />
                  <button
                    onClick={() => giveMarks(sub._id)}
                    style={{
                      background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                      color: "white",
                      padding: "18px 40px",
                      border: "none",
                      borderRadius: "30px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 10px 30px rgba(231,76,60,0.3)"
                    }}
                  >
                    Give Marks
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignmentDetail;