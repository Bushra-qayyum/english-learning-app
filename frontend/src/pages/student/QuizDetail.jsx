import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";

function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data.quiz || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Quiz load error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load quiz",
        confirmButtonText: "Go Back"
      }).then(() => {
        navigate("/quizzes");
      });
      setLoading(false);
    }
  };

  const handleAnswer = (qIndex, value, isMultipleChoice = false) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      if (isMultipleChoice) {
        // For multiple choice with multiple correct answers
        const currentAnswers = newAnswers[qIndex] || [];
        if (currentAnswers.includes(value)) {
          newAnswers[qIndex] = currentAnswers.filter(ans => ans !== value);
        } else {
          newAnswers[qIndex] = [...currentAnswers, value];
        }
      } else {
        newAnswers[qIndex] = value;
      }
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = [];
    quiz.questions.forEach((q, index) => {
      if (!answers[index] || 
          (Array.isArray(answers[index]) && answers[index].length === 0)) {
        unansweredQuestions.push(index + 1);
      }
    });

    if (unansweredQuestions.length > 0) {
      Swal.fire("Incomplete", `Please answer questions: ${unansweredQuestions.join(", ")}`, "warning");
      return;
    }

    try {
      // Start quiz attempt
      const startResponse = await api.post(`/quizzes/${id}/start`);
      const attemptId = startResponse.data.attemptId;

      // Prepare answers for submission
      const formattedAnswers = quiz.questions.map((question, index) => {
        const answer = answers[index];
        return {
          questionId: question._id,
          questionIndex: index,
          questionType: question.questionType,
          studentAnswer: Array.isArray(answer) ? answer.join(", ") : answer,
          selectedOptions: Array.isArray(answer) ? answer : [answer],
          timeSpent: 0 // You can track time if needed
        };
      });

      // Submit quiz
      const submitResponse = await api.post("/quizzes/submit", {
        attemptId,
        answers: formattedAnswers,
        timeLeft: 0 // You can calculate actual time left
      });

      const result = submitResponse.data.result;
      setScore(result.percentage);
      setSubmitted(true);
      
      Swal.fire({
        icon: "success",
        title: "Great Job!",
        text: `You scored ${result.percentage}%`,
        confirmButtonText: "View Results"
      }).then(() => {
        navigate(`/quizzes/results/${attemptId}`);
      });

    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to submit quiz", "error");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #8b5cf6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)",
        textAlign: "center"
      }}>
        <div>
          <h2 style={{ fontSize: "28px", color: "#dc2626", marginBottom: "20px" }}>Quiz Not Found</h2>
          <button
            onClick={() => navigate("/quizzes")}
            style={{
              padding: "12px 30px",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions?.length || 0;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "30px",
          boxShadow: "0 20px 60px rgba(139, 92, 246, 0.1)"
        }}>
          {/* Header */}
          <div style={{ marginBottom: "30px" }}>
            <button
              onClick={() => navigate("/quizzes")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#8b5cf6",
                background: "none",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                marginBottom: "20px",
                padding: "0"
              }}
            >
              <FaArrowLeft /> Back to Quizzes
            </button>
            
            <h1 style={{ fontSize: "32px", color: "#6b21a8", textAlign: "center", marginBottom: "15px" }}>
              {quiz.title}
            </h1>
            
            {quiz.description && (
              <p style={{ fontSize: "18px", color: "#6b7280", textAlign: "center", marginBottom: "30px" }}>
                {quiz.description}
              </p>
            )}

            {/* Quiz Info */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap"
            }}>
              <div style={{
                padding: "10px 20px",
                background: "#f3f4f6",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Total Questions</div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>{totalQuestions}</div>
              </div>
              
              <div style={{
                padding: "10px 20px",
                background: "#f3f4f6",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Time Limit</div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>{quiz.timeLimit} min</div>
              </div>
              
              <div style={{
                padding: "10px 20px",
                background: "#f3f4f6",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Answered</div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>{answeredQuestions}/{totalQuestions}</div>
              </div>
            </div>
          </div>

          {submitted ? (
            <div style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center"
            }}>
              <FaCheckCircle style={{ fontSize: "60px", marginBottom: "20px", color: "#10b981" }} />
              <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>Quiz Completed!</h2>
              <p style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0", color: "#059669" }}>
                {score}%
              </p>
              <p style={{ fontSize: "18px", marginBottom: "30px", color: "#047857" }}>
                Your score has been recorded
              </p>
              <button
                onClick={() => navigate("/quizzes")}
                style={{
                  background: "#8b5cf6",
                  color: "white",
                  padding: "15px 40px",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#7c3aed";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#8b5cf6";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Back to Quizzes
              </button>
            </div>
          ) : (
            <div>
              {/* Questions */}
              {quiz.questions?.map((question, index) => {
                const userAnswer = answers[index];
                const isMultipleCorrect = question.options?.filter(opt => opt.isCorrect).length > 1;
                
                return (
                  <div key={index} style={{
                    background: "#faf5ff",
                    padding: "25px",
                    borderRadius: "16px",
                    marginBottom: "20px",
                    border: "2px solid #e9d5ff"
                  }}>
                    {/* Question Header */}
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <span style={{
                          padding: "6px 12px",
                          background: question.difficulty === "easy" ? "#d1fae5" : 
                                    question.difficulty === "medium" ? "#fef3c7" : "#fee2e2",
                          color: question.difficulty === "easy" ? "#065f46" : 
                                question.difficulty === "medium" ? "#92400e" : "#991b1b",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}>
                          {question.difficulty}
                        </span>
                        <span style={{
                          padding: "6px 12px",
                          background: "#dbeafe",
                          color: "#1e40af",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}>
                          {question.points} point{question.points !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <p style={{
                        fontSize: "20px",
                        color: "#6b21a8",
                        fontWeight: "600",
                        marginBottom: "15px"
                      }}>
                        {index + 1}. {question.questionText}
                      </p>
                    </div>

                    {/* Answer Options */}
                    <div>
                      {question.questionType === "multiple-choice" && question.options?.map((option, i) => (
                        <label
                          key={i}
                          style={{
                            display: "block",
                            padding: "15px",
                            borderRadius: "12px",
                            border: "2px solid #e5e7eb",
                            marginBottom: "10px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            background: (
                              (isMultipleCorrect && Array.isArray(userAnswer) && userAnswer.includes(option.text)) ||
                              (!isMultipleCorrect && userAnswer === option.text)
                            ) ? "#f3e8ff" : "white"
                          }}
                          onMouseEnter={(e) => {
                            if (!(
                              (isMultipleCorrect && Array.isArray(userAnswer) && userAnswer.includes(option.text)) ||
                              (!isMultipleCorrect && userAnswer === option.text)
                            )) {
                              e.currentTarget.style.borderColor = "#c4b5fd";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!(
                              (isMultipleCorrect && Array.isArray(userAnswer) && userAnswer.includes(option.text)) ||
                              (!isMultipleCorrect && userAnswer === option.text)
                            )) {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                            }
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            {isMultipleCorrect ? (
                              <input
                                type="checkbox"
                                checked={Array.isArray(userAnswer) && userAnswer.includes(option.text)}
                                onChange={() => handleAnswer(index, option.text, true)}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  accentColor: "#8b5cf6",
                                  marginRight: "15px"
                                }}
                              />
                            ) : (
                              <input
                                type="radio"
                                name={`question-${index}`}
                                checked={userAnswer === option.text}
                                onChange={() => handleAnswer(index, option.text)}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  accentColor: "#8b5cf6",
                                  marginRight: "15px"
                                }}
                              />
                            )}
                            <span style={{ fontSize: "18px", color: "#374151" }}>{option.text}</span>
                          </div>
                        </label>
                      ))}

                      {question.questionType === "true-false" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                          {["True", "False"].map((option) => (
                            <label
                              key={option}
                              style={{
                                padding: "20px",
                                borderRadius: "12px",
                                border: "2px solid #e5e7eb",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.2s",
                                background: userAnswer === option.toLowerCase() ? "#d1fae5" : "white"
                              }}
                              onMouseEnter={(e) => {
                                if (userAnswer !== option.toLowerCase()) {
                                  e.currentTarget.style.borderColor = "#a7f3d0";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (userAnswer !== option.toLowerCase()) {
                                  e.currentTarget.style.borderColor = "#e5e7eb";
                                }
                              }}
                            >
                              <input
                                type="radio"
                                name={`question-${index}`}
                                checked={userAnswer === option.toLowerCase()}
                                onChange={() => handleAnswer(index, option.toLowerCase())}
                                style={{ display: "none" }}
                              />
                              <div style={{ fontSize: "20px", fontWeight: "500", color: "#374151" }}>
                                {option}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {(question.questionType === "fill-blank" || question.questionType === "short-answer") && (
                        <div>
                          <textarea
                            value={userAnswer || ""}
                            onChange={(e) => handleAnswer(index, e.target.value)}
                            style={{
                              width: "100%",
                              minHeight: "100px",
                              padding: "15px",
                              borderRadius: "12px",
                              border: "2px solid #e5e7eb",
                              fontSize: "18px",
                              resize: "vertical",
                              outline: "none",
                              transition: "all 0.2s"
                            }}
                            placeholder={
                              question.questionType === "fill-blank" 
                                ? "Fill in the blank..." 
                                : "Type your answer here..."
                            }
                            onFocus={(e) => {
                              e.target.style.borderColor = "#8b5cf6";
                              e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                          {question.questionType === "fill-blank" && (
                            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "10px" }}>
                              Write the exact word or phrase that completes the sentence.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Submit Button */}
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    background: "linear-gradient(45deg, #10b981, #059669)",
                    color: "white",
                    padding: "18px 60px",
                    border: "none",
                    borderRadius: "16px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 15px 30px rgba(16, 185, 129, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 10px 20px rgba(16, 185, 129, 0.3)";
                  }}
                >
                  Submit Quiz
                </button>
                
                <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "15px" }}>
                  {answeredQuestions} of {totalQuestions} questions answered
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizDetail;