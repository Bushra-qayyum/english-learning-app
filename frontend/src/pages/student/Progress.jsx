// src/pages/student/Progress.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import jsPDF from "jspdf";

function Progress() {
  const [progress, setProgress] = useState({ lessons: 0, assignments: 0, quizzes: 0, points: 0 });
  const [canDownload, setCanDownload] = useState(false);

  useEffect(() => {
    api.get("/student/progress")
      .then(res => {
        setProgress(res.data);
        setCanDownload(res.data.lessons >= 100); // Example condition
      })
      .catch(() => {
        setProgress({ lessons: 75, assignments: 60, quizzes: 85, points: 2850 });
        setCanDownload(false);
      });
  }, []);

  const generateCertificate = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(40);
    doc.text("Certificate of Completion", 105, 60, { align: "center" });
    doc.setFontSize(24);
    doc.text("English Language Learning Course", 105, 90, { align: "center" });
    doc.setFontSize(20);
    doc.text(`Awarded to: ${JSON.parse(localStorage.getItem("user"))?.name || "Student"}`, 105, 120, { align: "center" });
    doc.text(`Total Points: ${progress.points}`, 105, 140, { align: "center" });
    doc.text("Congratulations on your achievement!", 105, 170, { align: "center" });
    doc.save("english-certificate.pdf");
  };

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
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "44px", color: "#6b21a8", marginBottom: "40px" }}>
            My Progress
          </h1>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "30px",
            marginBottom: "60px"
          }}>
            <div style={{
              background: "#e9d5ff",
              padding: "30px",
              borderRadius: "24px"
            }}>
              <h3 style={{ fontSize: "22px", color: "#6b21a8" }}>Lessons</h3>
              <p style={{ fontSize: "48px", fontWeight: "bold", color: "#7c3aed" }}>{progress.lessons}%</p>
            </div>

            <div style={{
              background: "#bbf7d0",
              padding: "30px",
              borderRadius: "24px"
            }}>
              <h3 style={{ fontSize: "22px", color: "#166534" }}>Assignments</h3>
              <p style={{ fontSize: "48px", fontWeight: "bold", color: "#16a34a" }}>{progress.assignments}%</p>
            </div>

            <div style={{
              background: "#fecaca",
              padding: "30px",
              borderRadius: "24px"
            }}>
              <h3 style={{ fontSize: "22px", color: "#991b1b" }}>Quizzes</h3>
              <p style={{ fontSize: "48px", fontWeight: "bold", color: "#dc2626" }}>{progress.quizzes}%</p>
            </div>
          </div>

          <button onClick={generateCertificate} disabled={!canDownload} style={{
            background: canDownload ? "linear-gradient(45deg, #7c3aed, #6b21a8)" : "#e5e7eb",
            color: canDownload ? "white" : "#9ca3af",
            padding: "20px 60px",
            border: "none",
            borderRadius: "30px",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: canDownload ? "pointer" : "not-allowed",
            boxShadow: "0 10px 30px rgba(124,58,237,0.3)",
            transition: "all 0.3s"
          }}>
            {canDownload ? "Download Certificate 🎉" : "Complete Course to Unlock Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Progress;