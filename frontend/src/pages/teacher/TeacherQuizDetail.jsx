// src/pages/teacher/TeacherQuizDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";

function TeacherQuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    api.get(`/api/quizzes/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => {
        setQuiz({
          title: "Vocabulary Quiz 1",
          description: "Test basic English vocabulary",
          questions: [
            { type: "mcq", question: "What is the opposite of 'happy'?", options: ["Sad", "Joyful", "Excited", "Calm"], answer: "Sad" },
            { type: "fill", question: "The capital of France is _____.", answer: "Paris" }
          ],
          attempts: 42,
          averageScore: 78
        });
      });
  }, [id]);

  if (!quiz) return <p style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>Loading quiz details...</p>;

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
          <h1 style={{ fontSize: "44px", color: "#6b21a8", textAlign: "center", marginBottom: "20px" }}>
            {quiz.title} - Results
          </h1>

          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "20px", color: "#9333ea" }}>
              Total Attempts: <strong>{quiz.attempts || 0}</strong> | Average Score: <strong>{quiz.averageScore || "N/A"}%</strong>
            </p>
          </div>

          <h2 style={{ fontSize: "32px", color: "#6b21a8", marginBottom: "30px" }}>
            Questions ({quiz.questions?.length || 0})
          </h2>

          <div style={{ display: "grid", gap: "25px" }}>
            {quiz.questions?.map((q, index) => (
              <div key={index} style={{
                background: "#f3e8ff",
                padding: "30px",
                borderRadius: "20px",
                border: "2px solid #ddd6fe"
              }}>
                <p style={{ fontSize: "20px", color: "#6b21a8", fontWeight: "bold", marginBottom: "15px" }}>
                  {index + 1}. {q.question}
                </p>
                {q.type === "mcq" ? (
                  <div>
                    <p style={{ fontSize: "16px", color: "#4c1d95" }}>Options:</p>
                    <ul style={{ marginLeft: "20px" }}>
                      {q.options.map((opt, i) => (
                        <li key={i} style={{ fontSize: "16px", color: opt === q.answer ? "#16a34a" : "#4c1d95" }}>
                          {opt} {opt === q.answer && "(Correct Answer)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ fontSize: "16px", color: "#16a34a" }}>
                    Correct Answer: <strong>{q.answer}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <button
              onClick={() => navigate("/teacher/quizzes")}
              style={{
                background: "#7c3aed",
                color: "white",
                padding: "15px 40px",
                border: "none",
                borderRadius: "30px",
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherQuizDetail;