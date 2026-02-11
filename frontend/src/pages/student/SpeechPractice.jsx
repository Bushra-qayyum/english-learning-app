// src/pages/student/SpeechPractice.jsx
import { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

function SpeechPractice() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(null);

  const targetSentence = "Hello, my name is Bushra and I love learning English with confidence every day.";

  const startListening = () => {
    setTranscript("");
    setScore(null);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const current = event.results[event.results.length - 1];
      const text = current[0].transcript;
      setTranscript(text);

      if (current.isFinal) {
        const confidence = current[0].confidence || 0.7; // Lower default confidence
        const targetWords = targetSentence.toLowerCase().split(" ").filter(w => w.length > 2); // Ignore short words
        const spokenWords = text.toLowerCase().split(" ").filter(w => w.length > 2);

        let matched = 0;
        spokenWords.forEach(word => {
          if (targetWords.includes(word)) matched++;
        });

        const accuracy = targetWords.length > 0 ? (matched / targetWords.length) * 100 : 0;
        const finalScore = Math.round(accuracy * confidence * 100); // Strict scoring
        setScore(finalScore);
      }
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.start();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          borderRadius: "32px",
          padding: "50px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#4c1d95", marginBottom: "20px" }}>
            Speaking Practice
          </h1>
          <p style={{ fontSize: "22px", color: "#6366f1", marginBottom: "50px" }}>
            Speak the sentence exactly to get high score!
          </p>

          <div style={{
            background: "linear-gradient(135deg, #6366f1, #4c1d95)",
            color: "white",
            padding: "40px",
            borderRadius: "24px",
            marginBottom: "50px",
            boxShadow: "0 15px 35px rgba(99,102,241,0.3)"
          }}>
            <h3 style={{ fontSize: "28px", marginBottom: "20px" }}>Speak This Sentence:</h3>
            <p style={{ fontSize: "32px", lineHeight: "1.6", fontStyle: "italic" }}>
              "{targetSentence}"
            </p>
          </div>

          <button
            onClick={startListening}
            disabled={listening}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: listening ? "#dc2626" : "#6366f1",
              border: "none",
              color: "white",
              fontSize: "80px",
              cursor: listening ? "not-allowed" : "pointer",
              boxShadow: "0 20px 50px rgba(99,102,241,0.4)",
              transition: "all 0.4s",
              animation: listening ? "pulse 1.5s infinite" : "none"
            }}
          >
            {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>

          <p style={{ marginTop: "30px", fontSize: "24px", color: "#4c1d95" }}>
            {listening ? "Listening... Speak clearly!" : "Click the microphone to start"}
          </p>

          {transcript && (
            <div style={{
              marginTop: "60px",
              background: "#f8fafc",
              padding: "40px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ fontSize: "30px", color: "#4c1d95", marginBottom: "20px" }}>
                Your Speech
              </h3>
              <p style={{ fontSize: "28px", lineHeight: "1.6", color: "#334155", marginBottom: "40px" }}>
                "{transcript}"
              </p>

              {score !== null && (
                <>
                  <div style={{ fontSize: "24px", color: "#4c1d95", marginBottom: "15px" }}>
                    Pronunciation Score
                  </div>
                  <div style={{
                    width: "100%",
                    background: "#e2e8f0",
                    borderRadius: "50px",
                    height: "40px",
                    overflow: "hidden",
                    marginBottom: "30px"
                  }}>
                    <div style={{
                      width: `${score}%`,
                      height: "100%",
                      background: score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444",
                      borderRadius: "50px",
                      transition: "width 1.5s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "28px",
                      fontWeight: "bold"
                    }}>
                      {score}%
                    </div>
                  </div>

                  <p style={{ fontSize: "32px", fontWeight: "bold", color: score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444" }}>
                    {score >= 90 ? "Outstanding! Perfect!" : score >= 70 ? "Great Job!" : "Keep Practicing! Try to match the sentence exactly."}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.8); }
          70% { box-shadow: 0 0 0 30px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
      `}</style>
    </div>
  );
}

export default SpeechPractice;