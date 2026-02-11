import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CreateQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    passingScore: 70,
    attemptsAllowed: 1,
    category: "grammar",
    languageLevel: "intermediate",
    tags: "",
    questions: [
      {
        questionType: "multiple-choice",
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ],
        points: 1,
        difficulty: "medium"
      }
    ]
  });

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionType: "multiple-choice",
          questionText: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
          ],
          points: 1,
          difficulty: "medium"
        }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    
    if (field === "options") {
      updatedQuestions[index].options = value;
    } else if (field.startsWith("optionText")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].options[optIndex].text = value;
    } else if (field.startsWith("optionCorrect")) {
      const optIndex = parseInt(field.split("-")[1]);
      // For radio buttons (single correct answer), uncheck all others
      if (updatedQuestions[index].questionType === "multiple-choice") {
        updatedQuestions[index].options = updatedQuestions[index].options.map((opt, i) => ({
          ...opt,
          isCorrect: i === optIndex
        }));
      } else {
        // For checkboxes (multiple correct answers)
        updatedQuestions[index].options[optIndex].isCorrect = !updatedQuestions[index].options[optIndex].isCorrect;
      }
    } else {
      updatedQuestions[index][field] = value;
    }
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate
    if (!quizData.title.trim() || !quizData.description.trim()) {
      Swal.fire("Error", "Title and description are required!", "error");
      setLoading(false);
      return;
    }

    if (quizData.questions.length === 0) {
      Swal.fire("Error", "Please add at least one question!", "error");
      setLoading(false);
      return;
    }

    // Validate each question
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      
      // Check if question text is provided
      if (!q.questionText.trim()) {
        Swal.fire("Error", `Question ${i + 1} text is required!`, "error");
        setLoading(false);
        return;
      }

      // Validate based on question type
      switch (q.questionType) {
        case "multiple-choice":
          // Check if any option has text
          const hasEmptyOptions = q.options.some(opt => !opt.text.trim());
          if (hasEmptyOptions) {
            Swal.fire("Error", `Question ${i + 1} has empty options!`, "error");
            setLoading(false);
            return;
          }
          
          // Check if at least one option is marked as correct
          const hasCorrectAnswer = q.options.some(opt => opt.isCorrect);
          if (!hasCorrectAnswer) {
            Swal.fire("Error", `Question ${i + 1} must have at least one correct answer!`, "error");
            setLoading(false);
            return;
          }
          break;

        case "true-false":
          // For true/false, we need a correctAnswer field
          if (!q.correctAnswer) {
            Swal.fire("Error", `Question ${i + 1} requires selecting True or False as correct answer!`, "error");
            setLoading(false);
            return;
          }
          break;

        case "fill-blank":
          // For fill in blank, we need a correctAnswer field
          if (!q.correctAnswer || !q.correctAnswer.trim()) {
            Swal.fire("Error", `Question ${i + 1} requires a correct answer for fill in the blank!`, "error");
            setLoading(false);
            return;
          }
          break;

        case "short-answer":
          // Short answer can be empty, will be graded manually
          break;

        default:
          Swal.fire("Error", `Question ${i + 1} has invalid question type!`, "error");
          setLoading(false);
          return;
      }
    }

    try {
      // Process tags
      const processedData = {
        ...quizData,
        tags: quizData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      await api.post("/quizzes", processedData);
      Swal.fire("Success!", "Quiz created successfully!", "success");
      navigate("/teacher/quizzes");
    } catch (error) {
      console.error("Create quiz error:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to create quiz", "error");
    } finally {
      setLoading(false);
    }
  };

  // Styles (same as before)
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)",
      padding: "20px"
    },
    mainContainer: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    card: {
      background: "white",
      borderRadius: "24px",
      padding: "30px",
      boxShadow: "0 20px 60px rgba(139, 92, 246, 0.1)",
      marginBottom: "30px"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    title: {
      fontSize: "32px",
      color: "#6b21a8",
      fontWeight: "bold",
      marginBottom: "10px"
    },
    subtitle: {
      fontSize: "16px",
      color: "#6b7280"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "30px"
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "8px"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s"
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      fontSize: "16px",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      transition: "all 0.3s"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      fontSize: "16px",
      outline: "none",
      background: "white",
      transition: "all 0.3s"
    },
    settingsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "15px",
      marginBottom: "30px"
    },
    questionCard: {
      background: "#faf5ff",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "20px",
      border: "2px solid #e9d5ff"
    },
    questionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px"
    },
    questionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#6b21a8"
    },
    removeBtn: {
      padding: "8px 16px",
      color: "#dc2626",
      background: "#fef2f2",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.3s"
    },
    optionRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px"
    },
    checkbox: {
      width: "20px",
      height: "20px",
      accentColor: "#8b5cf6"
    },
    radio: {
      width: "20px",
      height: "20px",
      accentColor: "#8b5cf6"
    },
    addOptionBtn: {
      padding: "6px 12px",
      background: "#ede9fe",
      color: "#6b21a8",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "10px",
      transition: "all 0.3s"
    },
    addQuestionBtn: {
      padding: "12px 24px",
      background: "#8b5cf6",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      margin: "0 auto 30px",
      transition: "all 0.3s"
    },
    submitBtn: {
      padding: "16px 48px",
      background: "linear-gradient(45deg, #f59e0b, #d97706)",
      color: "white",
      border: "none",
      borderRadius: "16px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      display: "block",
      margin: "30px auto 0",
      transition: "all 0.3s",
      boxShadow: "0 10px 20px rgba(245, 158, 11, 0.3)"
    },
    submitBtnDisabled: {
      opacity: "0.5",
      cursor: "not-allowed"
    },
    pointsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      marginTop: "20px"
    },
    correctAnswerLabel: {
      marginLeft: "10px",
      fontSize: "14px",
      color: "#374151",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create New Quiz</h1>
            <p style={styles.subtitle}>Create engaging quizzes for your students</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Quiz Title *</label>
                <input
                  type="text"
                  value={quizData.title}
                  onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                  style={styles.input}
                  placeholder="Enter quiz title"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={quizData.category}
                  onChange={(e) => setQuizData({...quizData, category: e.target.value})}
                  style={styles.select}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="grammar">Grammar</option>
                  <option value="vocabulary">Vocabulary</option>
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                  <option value="writing">Writing</option>
                  <option value="speaking">Speaking</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                value={quizData.description}
                onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                style={styles.textarea}
                placeholder="Describe what this quiz covers"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Settings */}
            <div style={styles.settingsGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Time Limit (min)</label>
                <input
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => setQuizData({...quizData, timeLimit: parseInt(e.target.value) || 30})}
                  style={styles.input}
                  min="1"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Passing Score (%)</label>
                <input
                  type="number"
                  value={quizData.passingScore}
                  onChange={(e) => setQuizData({...quizData, passingScore: parseInt(e.target.value) || 70})}
                  style={styles.input}
                  min="0"
                  max="100"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Attempts Allowed</label>
                <input
                  type="number"
                  value={quizData.attemptsAllowed}
                  onChange={(e) => setQuizData({...quizData, attemptsAllowed: parseInt(e.target.value) || 1})}
                  style={styles.input}
                  min="1"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Language Level</label>
                <select
                  value={quizData.languageLevel}
                  onChange={(e) => setQuizData({...quizData, languageLevel: e.target.value})}
                  style={styles.select}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Tags (comma separated)</label>
              <input
                type="text"
                value={quizData.tags}
                onChange={(e) => setQuizData({...quizData, tags: e.target.value})}
                style={styles.input}
                placeholder="grammar, vocabulary, beginner"
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Questions */}
            <div style={{ marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#6b21a8" }}>Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  style={styles.addQuestionBtn}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#7c3aed";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#8b5cf6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  + Add Question
                </button>
              </div>

              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} style={styles.questionCard}>
                  <div style={styles.questionHeader}>
                    <h3 style={styles.questionTitle}>Question {qIndex + 1}</h3>
                    {quizData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        style={styles.removeBtn}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#fecaca";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#fef2f2";
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Question Type */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Question Type</label>
                    <select
                      value={question.questionType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        const updatedQuestions = [...quizData.questions];
                        updatedQuestions[qIndex].questionType = newType;
                        
                        // Reset options or correctAnswer based on type
                        if (newType === "multiple-choice") {
                          updatedQuestions[qIndex].options = [
                            { text: "", isCorrect: false },
                            { text: "", isCorrect: false },
                            { text: "", isCorrect: false },
                            { text: "", isCorrect: false }
                          ];
                          delete updatedQuestions[qIndex].correctAnswer;
                        } else if (newType === "true-false" || newType === "fill-blank") {
                          updatedQuestions[qIndex].correctAnswer = "";
                          delete updatedQuestions[qIndex].options;
                        } else if (newType === "short-answer") {
                          delete updatedQuestions[qIndex].correctAnswer;
                          delete updatedQuestions[qIndex].options;
                        }
                        
                        setQuizData({ ...quizData, questions: updatedQuestions });
                      }}
                      style={styles.select}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="fill-blank">Fill in the Blank</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Question Text *</label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      style={styles.textarea}
                      rows="2"
                      placeholder="Enter your question here"
                      required
                      onFocus={(e) => {
                        e.target.style.borderColor = "#8b5cf6";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Multiple Choice Options */}
                  {question.questionType === "multiple-choice" && (
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <label style={styles.label}>Options * (Check correct answers)</label>
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          style={styles.addOptionBtn}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#ddd6fe";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#ede9fe";
                          }}
                        >
                          + Add Option
                        </button>
                      </div>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} style={styles.optionRow}>
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={() => updateQuestion(qIndex, `optionCorrect-${optIndex}`, true)}
                            style={styles.checkbox}
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateQuestion(qIndex, `optionText-${optIndex}`, e.target.value)}
                            style={styles.input}
                            placeholder={`Option ${optIndex + 1}`}
                            required
                            onFocus={(e) => {
                              e.target.style.borderColor = "#8b5cf6";
                              e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e5e7eb";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                        </div>
                      ))}
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "5px" }}>
                        ✓ Check the boxes next to correct answers (multiple correct answers allowed)
                      </div>
                    </div>
                  )}

                  {/* True/False Options */}
                  {question.questionType === "true-false" && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Correct Answer *</label>
                      <div style={{ display: "flex", gap: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name={`trueFalse-${qIndex}`}
                            value="true"
                            checked={question.correctAnswer === "true"}
                            onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                            style={styles.radio}
                          />
                          <span style={styles.correctAnswerLabel}>True</span>
                        </label>
                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name={`trueFalse-${qIndex}`}
                            value="false"
                            checked={question.correctAnswer === "false"}
                            onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                            style={styles.radio}
                          />
                          <span style={styles.correctAnswerLabel}>False</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Fill in the Blank */}
                  {question.questionType === "fill-blank" && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Correct Answer *</label>
                      <input
                        type="text"
                        value={question.correctAnswer || ""}
                        onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                        style={styles.input}
                        placeholder="Enter the correct answer"
                        required
                        onFocus={(e) => {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "5px" }}>
                        Example: If question is "The capital of France is ____", enter "Paris"
                      </div>
                    </div>
                  )}

                  {/* Short Answer */}
                  {question.questionType === "short-answer" && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Expected Answer (Optional)</label>
                      <textarea
                        value={question.correctAnswer || ""}
                        onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                        style={styles.textarea}
                        rows="2"
                        placeholder="Enter expected answer for reference (will be graded manually)"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "5px" }}>
                        Note: Short answer questions will be graded manually by the teacher
                      </div>
                    </div>
                  )}

                  {/* Points and Difficulty */}
                  <div style={styles.pointsGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Points</label>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value) || 1)}
                        style={styles.input}
                        min="1"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Difficulty</label>
                      <select
                        value={question.difficulty}
                        onChange={(e) => updateQuestion(qIndex, "difficulty", e.target.value)}
                        style={styles.select}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#8b5cf6";
                          e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 15px 30px rgba(245, 158, 11, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 10px 20px rgba(245, 158, 11, 0.3)";
                }
              }}
            >
              {loading ? "Creating..." : "Create Quiz"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;