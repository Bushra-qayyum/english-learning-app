import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Swal from "sweetalert2";
import { FaClock, FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    startQuizAttempt();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  const startQuizAttempt = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/quizzes/${id}/start`);
      const { attemptId, quiz, timeLimit, startTime } = response.data;
      
      setQuizData(quiz);
      setAttemptId(attemptId);
      setTimeLeft(timeLimit);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Initialize answers array
      const initialAnswers = quiz.questions.map((q, index) => ({
        questionId: q._id,
        questionIndex: index,
        questionType: q.questionType,
        studentAnswer: "",
        selectedOptions: [],
        timeSpent: 0
      }));
      setAnswers(initialAnswers);

    } catch (error) {
      console.error("Error starting quiz:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to start quiz",
        confirmButtonText: "Go Back"
      }).then(() => {
        navigate("/quizzes");
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value, isCheckbox = false) => {
    const updatedAnswers = [...answers];
    const currentAnswer = updatedAnswers[currentQuestion];

    if (currentAnswer.questionType === "multiple-choice") {
      if (isCheckbox) {
        const selected = currentAnswer.selectedOptions.includes(value)
          ? currentAnswer.selectedOptions.filter(v => v !== value)
          : [...currentAnswer.selectedOptions, value];
        currentAnswer.selectedOptions = selected;
        currentAnswer.studentAnswer = selected.join(", ");
      } else {
        currentAnswer.selectedOptions = [value];
        currentAnswer.studentAnswer = value;
      }
    } else {
      currentAnswer.studentAnswer = value;
    }

    // Update time spent
    currentAnswer.timeSpent = (currentAnswer.timeSpent || 0) + 1;

    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    Swal.fire({
      icon: "warning",
      title: "Time's Up!",
      text: "Your quiz will be submitted automatically.",
      showConfirmButton: false,
      timer: 2000
    });

    await submitQuiz();
  };

  const submitQuiz = async () => {
    if (!attemptId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalAnswers = answers.map((answer, index) => ({
        ...answer,
        questionIndex: index
      }));

      await api.post("/quizzes/submit", {
        attemptId,
        answers: finalAnswers,
        timeLeft
      });

      clearInterval(timerRef.current);
      
      // Navigate to results page
      navigate(`/quizzes/results/${attemptId}`);
      
    } catch (error) {
      console.error("Error submitting quiz:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Failed to submit quiz",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSubmit = () => {
    Swal.fire({
      title: "Submit Quiz?",
      text: "Are you sure you want to submit your answers?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        submitQuiz();
      }
    });
  };

  // Styles
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)",
      padding: "20px"
    },
    mainContainer: {
      maxWidth: "1000px",
      margin: "0 auto"
    },
    headerCard: {
      background: "white",
      borderRadius: "20px",
      padding: "25px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      marginBottom: "20px"
    },
    headerTop: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginBottom: "20px"
    },
    backBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#8b5cf6",
      background: "none",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
      padding: "0"
    },
    quizTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#1f2937",
      margin: "0"
    },
    quizDesc: {
      fontSize: "16px",
      color: "#6b7280",
      margin: "5px 0 0 0"
    },
    timerContainer: {
      background: "linear-gradient(45deg, #ef4444, #f97316)",
      color: "white",
      padding: "15px 25px",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      gap: "15px"
    },
    timerIcon: {
      fontSize: "24px"
    },
    timerText: {
      fontSize: "32px",
      fontWeight: "bold",
      fontFamily: "monospace"
    },
    timerLabel: {
      fontSize: "12px",
      opacity: "0.9"
    },
    progressBar: {
      marginTop: "25px"
    },
    progressInfo: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "8px"
    },
    progressTrack: {
      height: "8px",
      background: "#e5e7eb",
      borderRadius: "4px",
      overflow: "hidden"
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(45deg, #8b5cf6, #6366f1)",
      transition: "width 0.3s"
    },
    navigationCard: {
      background: "white",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      marginBottom: "20px"
    },
    questionNumbers: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px"
    },
    questionNumber: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "all 0.2s"
    },
    questionCard: {
      background: "white",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      marginBottom: "20px"
    },
    questionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "25px"
    },
    questionInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px"
    },
    difficultyBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500"
    },
    pointsBadge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500",
      background: "#dbeafe",
      color: "#1e40af"
    },
    questionNumberText: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1f2937",
      margin: "0"
    },
    timeSpent: {
      textAlign: "right"
    },
    timeSpentLabel: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "5px"
    },
    timeSpentValue: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1f2937"
    },
    questionText: {
      fontSize: "20px",
      color: "#374151",
      lineHeight: "1.6",
      marginBottom: "30px"
    },
    optionsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "15px"
    },
    optionLabel: {
      display: "block",
      padding: "20px",
      borderRadius: "15px",
      border: "2px solid #e5e7eb",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    optionContent: {
      display: "flex",
      alignItems: "center"
    },
    radio: {
      width: "20px",
      height: "20px",
      accentColor: "#8b5cf6",
      marginRight: "15px"
    },
    optionText: {
      fontSize: "18px",
      color: "#374151"
    },
    trueFalseGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px"
    },
    trueFalseOption: {
      padding: "25px",
      borderRadius: "15px",
      border: "2px solid #e5e7eb",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center"
    },
    trueFalseText: {
      fontSize: "20px",
      fontWeight: "500"
    },
    answerTextarea: {
      width: "100%",
      minHeight: "150px",
      padding: "20px",
      borderRadius: "15px",
      border: "2px solid #e5e7eb",
      fontSize: "18px",
      resize: "vertical",
      outline: "none",
      transition: "all 0.2s"
    },
    tipText: {
      fontSize: "14px",
      color: "#6b7280",
      marginTop: "10px"
    },
    navButtons: {
      background: "white",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    prevNextGroup: {
      display: "flex",
      gap: "15px"
    },
    navButton: {
      padding: "12px 30px",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none"
    },
    prevButton: {
      background: "white",
      border: "2px solid #e5e7eb",
      color: "#374151"
    },
    nextButton: {
      background: "#8b5cf6",
      color: "white"
    },
    submitButton: {
      padding: "15px 40px",
      background: "linear-gradient(45deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "500px"
    },
    spinner: {
      width: "60px",
      height: "60px",
      border: "5px solid #e5e7eb",
      borderTop: "5px solid #8b5cf6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "20px"
    },
    errorContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "500px",
      textAlign: "center"
    },
    errorTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#dc2626",
      marginBottom: "20px"
    },
    backButton: {
      padding: "12px 30px",
      background: "#8b5cf6",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      marginTop: "20px"
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={styles.spinner}></div>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>Quiz Not Found</h2>
          <button
            onClick={() => navigate("/quizzes")}
            style={styles.backButton}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.headerTop}>
            <button onClick={() => navigate("/quizzes")} style={styles.backBtn}>
              <FaArrowLeft /> Back to Quizzes
            </button>
            <div>
              <h1 style={styles.quizTitle}>{quizData.title}</h1>
              <p style={styles.quizDesc}>{quizData.description}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div></div>
            <div style={styles.timerContainer}>
              <FaClock style={styles.timerIcon} />
              <div style={{ textAlign: "center" }}>
                <div style={styles.timerText}>{formatTime(timeLeft)}</div>
                <div style={styles.timerLabel}>Time Remaining</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={styles.progressInfo}>
              <span>Question {currentQuestion + 1} of {quizData.questions.length}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div style={styles.navigationCard}>
          <div style={styles.questionNumbers}>
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                style={{
                  ...styles.questionNumber,
                  background: currentQuestion === index
                    ? "#8b5cf6"
                    : answers[index]?.studentAnswer || answers[index]?.selectedOptions?.length > 0
                    ? "#10b981"
                    : "#f3f4f6",
                  color: currentQuestion === index
                    ? "white"
                    : answers[index]?.studentAnswer || answers[index]?.selectedOptions?.length > 0
                    ? "white"
                    : "#6b7280"
                }}
                onMouseEnter={(e) => {
                  if (currentQuestion !== index) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentQuestion !== index) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div style={styles.questionCard}>
          {/* Question Header */}
          <div style={styles.questionHeader}>
            <div>
              <div style={styles.questionInfo}>
                <span style={{
                  ...styles.difficultyBadge,
                  background: currentQ.difficulty === "easy" ? "#d1fae5" : 
                            currentQ.difficulty === "medium" ? "#fef3c7" : "#fee2e2",
                  color: currentQ.difficulty === "easy" ? "#065f46" : 
                        currentQ.difficulty === "medium" ? "#92400e" : "#991b1b"
                }}>
                  {currentQ.difficulty}
                </span>
                <span style={styles.pointsBadge}>
                  {currentQ.points} points
                </span>
              </div>
              <h2 style={styles.questionNumberText}>
                Question {currentQuestion + 1}
              </h2>
            </div>
            <div style={styles.timeSpent}>
              <div style={styles.timeSpentLabel}>Time spent</div>
              <div style={styles.timeSpentValue}>
                {Math.floor((answers[currentQuestion]?.timeSpent || 0) / 60)}:
                {(answers[currentQuestion]?.timeSpent || 0) % 60 < 10 ? '0' : ''}
                {(answers[currentQuestion]?.timeSpent || 0) % 60}s
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: "30px" }}>
            <p style={styles.questionText}>{currentQ.questionText}</p>
          </div>

          {/* Answer Options */}
          <div>
            {currentQ.questionType === "multiple-choice" && currentQ.options?.map((option, index) => (
              <label
                key={index}
                style={{
                  ...styles.optionLabel,
                  borderColor: currentAnswer?.selectedOptions?.includes(option.text)
                    ? "#8b5cf6"
                    : "#e5e7eb",
                  background: currentAnswer?.selectedOptions?.includes(option.text)
                    ? "#f5f3ff"
                    : "white"
                }}
                onMouseEnter={(e) => {
                  if (!currentAnswer?.selectedOptions?.includes(option.text)) {
                    e.currentTarget.style.borderColor = "#c4b5fd";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!currentAnswer?.selectedOptions?.includes(option.text)) {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }
                }}
              >
                <div style={styles.optionContent}>
                  {currentQ.options?.filter(opt => opt.isCorrect).length > 1 ? (
                    <input
                      type="checkbox"
                      checked={currentAnswer?.selectedOptions?.includes(option.text) || false}
                      onChange={() => handleAnswerChange(option.text, true)}
                      style={styles.radio}
                    />
                  ) : (
                    <input
                      type="radio"
                      checked={currentAnswer?.selectedOptions?.includes(option.text) || false}
                      onChange={() => handleAnswerChange(option.text)}
                      style={styles.radio}
                    />
                  )}
                  <span style={styles.optionText}>{option.text}</span>
                </div>
              </label>
            ))}

            {currentQ.questionType === "true-false" && (
              <div style={styles.trueFalseGrid}>
                {["True", "False"].map((option) => (
                  <label
                    key={option}
                    style={{
                      ...styles.trueFalseOption,
                      borderColor: currentAnswer?.studentAnswer === option.toLowerCase()
                        ? "#10b981"
                        : "#e5e7eb",
                      background: currentAnswer?.studentAnswer === option.toLowerCase()
                        ? "#d1fae5"
                        : "white"
                    }}
                    onMouseEnter={(e) => {
                      if (currentAnswer?.studentAnswer !== option.toLowerCase()) {
                        e.currentTarget.style.borderColor = "#a7f3d0";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentAnswer?.studentAnswer !== option.toLowerCase()) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="trueFalse"
                      checked={currentAnswer?.studentAnswer === option.toLowerCase()}
                      onChange={() => handleAnswerChange(option.toLowerCase())}
                      style={{ display: "none" }}
                    />
                    <div style={styles.trueFalseText}>{option}</div>
                  </label>
                ))}
              </div>
            )}

            {(currentQ.questionType === "fill-blank" || currentQ.questionType === "short-answer") && (
              <div>
                <textarea
                  value={currentAnswer?.studentAnswer || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  style={styles.answerTextarea}
                  placeholder={
                    currentQ.questionType === "fill-blank" 
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
                {currentQ.questionType === "fill-blank" && (
                  <p style={styles.tipText}>
                    Tip: Write the exact word or phrase that completes the sentence.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={styles.navButtons}>
          <div style={styles.buttonGroup}>
            <div style={styles.prevNextGroup}>
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                style={{
                  ...styles.navButton,
                  ...styles.prevButton,
                  opacity: currentQuestion === 0 ? "0.5" : "1",
                  cursor: currentQuestion === 0 ? "not-allowed" : "pointer"
                }}
                onMouseEnter={(e) => {
                  if (currentQuestion > 0) {
                    e.target.style.background = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentQuestion > 0) {
                    e.target.style.background = "white";
                  }
                }}
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === quizData.questions.length - 1}
                style={{
                  ...styles.navButton,
                  ...styles.nextButton,
                  opacity: currentQuestion === quizData.questions.length - 1 ? "0.5" : "1",
                  cursor: currentQuestion === quizData.questions.length - 1 ? "not-allowed" : "pointer"
                }}
                onMouseEnter={(e) => {
                  if (currentQuestion < quizData.questions.length - 1) {
                    e.target.style.background = "#7c3aed";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentQuestion < quizData.questions.length - 1) {
                    e.target.style.background = "#8b5cf6";
                  }
                }}
              >
                Next Question
              </button>
            </div>
            
            <button
              onClick={confirmSubmit}
              disabled={isSubmitting}
              style={{
                ...styles.submitButton,
                opacity: isSubmitting ? "0.5" : "1",
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 10px 20px rgba(16, 185, 129, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;