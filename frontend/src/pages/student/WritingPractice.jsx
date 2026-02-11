// src/pages/student/WritingPractice.jsx
import { useState } from "react";

function WritingPractice() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  const checkGrammar = () => {
    if (text.trim() === "") {
      setFeedback("Please write something first!");
      setScore(0);
      return;
    }

    const wordCount = text.split(" ").filter(word => word.length > 0).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const errors = [];

    if (wordCount < 30) errors.push("Write at least 30 words for better practice.");
    if (sentenceCount < 3) errors.push("Use at least 3 sentences.");
    if (!text.match(/[A-Z]/)) errors.push("Start sentences with capital letters.");
    if (text.match(/(\w+)\s+\1/)) errors.push("Avoid repeating the same word too often.");

    const calculatedScore = Math.max(0, 100 - errors.length * 15);
    setScore(calculatedScore);
    setFeedback(errors.length > 0 ? errors.join(" • ") : "Excellent writing! Keep it up! 🌟");
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
          <h1 style={{ fontSize: "44px", color: "#6b21a8", marginBottom: "15px" }}>
            Writing Practice
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "40px" }}>
            Write a paragraph and get instant feedback!
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing in English... (aim for 50+ words)"
            style={{
              width: "100%",
              height: "300px",
              padding: "20px",
              borderRadius: "20px",
              border: "2px solid #ddd6fe",
              fontSize: "18px",
              resize: "none",
              marginBottom: "30px"
            }}
          />

          <button onClick={checkGrammar} style={{
            background: "linear-gradient(45deg, #7c3aed, #6b21a8)",
            color: "white",
            padding: "18px 50px",
            border: "none",
            borderRadius: "30px",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(124,58,237,0.3)",
            transition: "all 0.3s"
          }}
          onMouseOver={e => e.target.style.transform = "scale(1.05)"}
          onMouseOut={e => e.target.style.transform = "scale(1)"}
          >
            Check My Writing
          </button>

          {score !== null && (
            <div style={{
              marginTop: "50px",
              padding: "40px",
              background: "#f3e8ff",
              borderRadius: "24px",
              border: "2px solid #ddd6fe"
            }}>
              <h2 style={{ fontSize: "36px", color: "#6b21a8", marginBottom: "20px" }}>
                Your Score: {score}/100
              </h2>
              <p style={{ fontSize: "24px", color: score >= 70 ? "#22c55e" : "#dc2626", fontWeight: "bold" }}>
                {feedback}
              </p>
              <p style={{ fontSize: "18px", color: "#9333ea", marginTop: "20px" }}>
                Word count: {text.split(" ").filter(w => w.length > 0).length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WritingPractice;