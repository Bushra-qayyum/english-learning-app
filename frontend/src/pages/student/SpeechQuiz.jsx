// src/pages/student/SpeechQuiz.jsx
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import api from "../../utils/api";
import Swal from "sweetalert2"; // npm install sweetalert2 (ek baar run kar lena)

function SpeechQuiz() {
  const targetSentence = "My name is Bushra and I love learning English";
  const correctLower = targetSentence.toLowerCase();
  const [score, setScore] = useState(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div style={{ textAlign: "center", padding: "100px", fontSize: "24px", color: "#e74c3c" }}>
        Sorry, your browser does not support speech recognition.
      </div>
    );
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopAndCheck = async () => {
    SpeechRecognition.stopListening();
    const userLower = transcript.toLowerCase().trim();

    // Accurate word matching
    const correctWords = correctLower.split(" ");
    const userWords = userLower.split(" ");
    let matched = 0;
    userWords.forEach(word => {
      if (correctWords.includes(word)) matched++;
    });

    const accuracy = Math.round((matched / correctWords.length) * 100);
    setScore(accuracy);

    // Save score to backend (optional - agar fail ho to ignore)
    try {
      await api.post("/student/speech-score", { score: accuracy });
    } catch (err) {
      console.log("Score not saved (demo mode)", err);
    }

    // Beautiful SweetAlert Popup
    if (accuracy >= 90) {
      Swal.fire({
        title: "Outstanding!",
        text: `Score: ${accuracy}% — Perfect pronunciation! +${accuracy} points earned!`,
        icon: "success",
        confirmButtonColor: "#27ae60",
        background: "#fff",
        customClass: {
          popup: "animated bounceIn"
        }
      });
    } else if (accuracy >= 70) {
      Swal.fire({
        title: "Great Job!",
        text: `Score: ${accuracy}% — Well done! +${accuracy} points`,
        icon: "success",
        confirmButtonColor: "#3498db"
      });
    } else {
      Swal.fire({
        title: "Keep Practicing!",
        text: `Score: ${accuracy}% — Try to say the exact sentence clearly.`,
        icon: "warning",
        confirmButtonColor: "#f39c12"
      });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      padding: "40px",
      textAlign: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        borderRadius: "24px",
        padding: "50px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "42px", color: "#2c3e50", marginBottom: "30px" }}>
          Speech Quiz
        </h2>

        <div style={{
          background: "#e8f4fd",
          padding: "35px",
          borderRadius: "20px",
          marginBottom: "50px",
          border: "2px dashed #3498db"
        }}>
          <p style={{ fontSize: "24px", color: "#2980b9", marginBottom: "15px" }}>
            Say exactly this sentence:
          </p>
          <p style={{ fontSize: "32px", fontStyle: "italic", color: "#2c3e50" }}>
            "{targetSentence}"
          </p>
        </div>

        <button
          onMouseDown={startListening}
          onMouseUp={stopAndCheck}
          onTouchStart={startListening}
          onTouchEnd={stopAndCheck}
          style={{
            background: "#3498db",
            color: "white",
            padding: "25px 60px",
            fontSize: "24px",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 15px 40px rgba(52,152,219,0.4)",
            transition: "all 0.3s"
          }}
          onMouseOver={e => e.target.style.transform = "scale(1.05)"}
          onMouseOut={e => e.target.style.transform = "scale(1)"}
        >
          Hold to Speak
        </button>

        <button
          onClick={resetTranscript}
          style={{
            marginLeft: "20px",
            padding: "15px 30px",
            background: "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px"
          }}
        >
          Reset
        </button>

        <div style={{ marginTop: "50px" }}>
          <p style={{ fontSize: "22px", color: "#2c3e50" }}>
            <strong>You said:</strong>
          </p>
          <p style={{ fontSize: "28px", fontStyle: "italic", color: "#34495e", marginTop: "20px" }}>
            {transcript || "Waiting for your voice..."}
          </p>
        </div>

        {score !== null && (
          <div style={{
            marginTop: "40px",
            padding: "30px",
            background: score >= 80 ? "#d4edda" : score >= 60 ? "#fff3cd" : "#f8d7da",
            borderRadius: "20px",
            fontSize: "36px",
            fontWeight: "bold",
            color: score >= 80 ? "#155724" : score >= 60 ? "#856404" : "#721c24"
          }}>
            Your Score: {score}%
          </div>
        )}
      </div>
    </div>
  );
}

export default SpeechQuiz;