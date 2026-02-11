// src/pages/student/Certificate.jsx
import jsPDF from "jspdf";

function Certificate() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    // Background
    doc.setFillColor(248, 250, 255);
    doc.rect(0, 0, 297, 210, "F");

    // Elegant border
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(5);
    doc.rect(15, 15, 267, 180);

    doc.setDrawColor(167, 139, 250);
    doc.setLineWidth(2);
    doc.rect(20, 20, 257, 170);

    // Header ribbon
    doc.setFillColor(167, 139, 250);
    doc.rect(0, 40, 297, 30, "F");
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 45, 297, 20, "F");

    // Title
    doc.setFontSize(50);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("CERTIFICATE", 148.5, 85, { align: "center" });

    doc.setFontSize(36);
    doc.setTextColor(99, 102, 241);
    doc.text("OF COMPLETION", 148.5, 110, { align: "center" });

    // Student Name
    doc.setFontSize(42);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bolditalic");
    doc.text(user.name.toUpperCase(), 148.5, 140, { align: "center" });

    // Message
    doc.setFontSize(24);
    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the", 148.5, 160, { align: "center" });
    doc.text("Advanced English Language Course", 148.5, 175, { align: "center" });
    doc.text("with dedication and excellence.", 148.5, 190, { align: "center" });

    // Date
    doc.setFontSize(18);
    doc.setTextColor(107, 114, 128);
    doc.text(`Issued on: ${new Date().toLocaleDateString("en-GB")}`, 148.5, 210, { align: "center" });

    // Footer
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.text("English Learning Academy", 148.5, 225, { align: "center" });
    doc.text("© 2025 English Learning App • Verified Certificate", 148.5, 235, { align: "center" });

    doc.save(`${user.name.replace(/\s+/g, "_")}_Certificate.pdf`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
      padding: "50px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        borderRadius: "32px",
        padding: "60px",
        boxShadow: "0 30px 80px rgba(139,92,246,0.2)",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "52px", color: "#6b21a8", marginBottom: "20px" }}>
          Congratulations, {user.name}! 🎉
        </h1>
        <p style={{ fontSize: "24px", color: "#4c1d95", marginBottom: "50px" }}>
          You have successfully completed the course!
        </p>

        <div style={{
          background: "#f3e8ff",
          padding: "40px",
          borderRadius: "24px",
          border: "3px solid #a78bfa",
          margin: "40px 0"
        }}>
          <p style={{ fontSize: "26px", color: "#6b21a8", fontWeight: "600" }}>
            Your achievement is recognized!
          </p>
          <p style={{ fontSize: "20px", color: "#4c1d95" }}>
            Download your official certificate below.
          </p>
        </div>

        <button
          onClick={generateCertificate}
          style={{
            background: "linear-gradient(45deg, #7c3aed, #6b21a8)",
            color: "white",
            padding: "20px 60px",
            fontSize: "26px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 15px 40px rgba(124,58,237,0.4)",
            transition: "all 0.3s"
          }}
          onMouseOver={e => e.target.style.transform = "translateY(-5px)"}
          onMouseOut={e => e.target.style.transform = "translateY(0)"}
        >
          Download Certificate
        </button>

        <p style={{ marginTop: "40px", color: "#9333ea", fontSize: "18px" }}>
          Your certificate will be downloaded as a beautiful PDF
        </p>
      </div>
    </div>
  );
}

export default Certificate;