import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaClock, FaStar, FaUserGraduate } from "react-icons/fa";
import Swal from "sweetalert2";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAttempts, setMyAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
    fetchMyAttempts();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quizzes/published");
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      Swal.fire("Error", "Failed to load quizzes", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAttempts = async () => {
    try {
      const response = await api.get("/quizzes/student/attempts");
      setMyAttempts(response.data.attempts || []);
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  const getAttemptInfo = (quizId) => {
    const attempts = myAttempts.filter(attempt => attempt.quizId?._id === quizId);
    if (attempts.length === 0) return null;
    
    const bestScore = Math.max(...attempts.map(a => a.percentage || 0));
    const lastAttempt = attempts[attempts.length - 1];
    
    return {
      attempts: attempts.length,
      bestScore,
      lastAttempt,
      isPassed: lastAttempt?.isPassed
    };
  };

  // Styles
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)",
      padding: "20px"
    },
    mainContainer: {
      maxWidth: "1400px",
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
      color: "#6b7280",
      marginBottom: "20px"
    },
    statsContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "15px",
      marginTop: "20px"
    },
    statBadge: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500"
    },
    quizzesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "20px"
    },
    quizCard: {
      background: "white",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      cursor: "pointer",
      transition: "all 0.3s",
      position: "relative",
      border: "2px solid transparent"
    },
    quizCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)"
    },
    statusBadge: {
      position: "absolute",
      top: "15px",
      right: "15px",
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600"
    },
    quizIcon: {
      width: "60px",
      height: "60px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "15px",
      fontSize: "24px"
    },
    quizTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "10px",
      minHeight: "60px"
    },
    quizDesc: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "15px",
      minHeight: "40px"
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "15px"
    },
    tag: {
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500"
    },
    quizStats: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "14px",
      color: "#6b7280",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "15px",
      marginBottom: "15px"
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    attemptInfo: {
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #e5e7eb"
    },
    scoreRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "5px"
    },
    attemptsInfo: {
      fontSize: "12px",
      color: "#9ca3af"
    },
    startBtn: {
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      border: "none",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s",
      marginTop: "15px"
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px"
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "4px solid #e5e7eb",
      borderTop: "4px solid #8b5cf6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "20px"
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px"
    },
    emptyIcon: {
      fontSize: "60px",
      color: "#d1d5db",
      marginBottom: "20px"
    },
    emptyTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "10px"
    },
    emptyText: {
      fontSize: "16px",
      color: "#6b7280"
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
          <p style={{ color: "#6b7280" }}>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Available Quizzes</h1>
            <p style={styles.subtitle}>Test your English skills with these engaging quizzes</p>
            
            <div style={styles.statsContainer}>
              <div style={{ ...styles.statBadge, background: "#ede9fe", color: "#6b21a8" }}>
                <FaClipboardList />
                <span>{quizzes.length} Quizzes</span>
              </div>
              <div style={{ ...styles.statBadge, background: "#fef3c7", color: "#92400e" }}>
                <FaUserGraduate />
                <span>{myAttempts.length} Attempts</span>
              </div>
            </div>
          </div>

          {/* Quizzes Grid */}
          {quizzes.length === 0 ? (
            <div style={styles.emptyState}>
              <FaClipboardList style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>No Quizzes Available</h3>
              <p style={styles.emptyText}>Check back later for new quizzes!</p>
            </div>
          ) : (
            <div style={styles.quizzesGrid}>
              {quizzes.map((quiz) => {
                const attemptInfo = getAttemptInfo(quiz._id);
                const isAttempted = attemptInfo !== null;
                const categoryColors = {
                  grammar: { bg: "#dbeafe", text: "#1e40af", icon: "#3b82f6" },
                  vocabulary: { bg: "#d1fae5", text: "#065f46", icon: "#10b981" },
                  reading: { bg: "#f3e8ff", text: "#6b21a8", icon: "#8b5cf6" },
                  listening: { bg: "#fce7f3", text: "#9d174d", icon: "#ec4899" },
                  writing: { bg: "#fef3c7", text: "#92400e", icon: "#f59e0b" },
                  speaking: { bg: "#fef3c7", text: "#92400e", icon: "#f59e0b" }
                };
                const colors = categoryColors[quiz.category] || categoryColors.grammar;

                return (
                  <div
                    key={quiz._id}
                    style={{
                      ...styles.quizCard,
                      borderColor: isAttempted 
                        ? attemptInfo.isPassed 
                          ? "#10b981" 
                          : "#f59e0b"
                        : colors.icon + "20"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
                    }}
                    onClick={() => navigate(`/quizzes/${quiz._id}`)}
                  >
                    {/* Quiz Status Badge */}
                    {isAttempted && (
                      <div style={{
                        ...styles.statusBadge,
                        background: attemptInfo.isPassed ? "#d1fae5" : "#fef3c7",
                        color: attemptInfo.isPassed ? "#065f46" : "#92400e"
                      }}>
                        {attemptInfo.isPassed ? "Passed" : "Attempted"}
                      </div>
                    )}

                    {/* Quiz Icon */}
                    <div style={{
                      ...styles.quizIcon,
                      background: colors.bg
                    }}>
                      <FaClipboardList style={{ color: colors.icon }} />
                    </div>

                    {/* Quiz Title */}
                    <h3 style={styles.quizTitle}>{quiz.title}</h3>

                    {/* Quiz Description */}
                    <p style={styles.quizDesc}>
                      {quiz.description || "Test your English skills"}
                    </p>

                    {/* Quiz Details */}
                    <div style={styles.tagsContainer}>
                      <span style={{
                        ...styles.tag,
                        background: "#f3f4f6",
                        color: "#374151"
                      }}>
                        {quiz.category}
                      </span>
                      <span style={{
                        ...styles.tag,
                        background: "#f3f4f6",
                        color: "#374151"
                      }}>
                        {quiz.languageLevel}
                      </span>
                      {quiz.tags?.slice(0, 2).map((tag, index) => (
                        <span key={index} style={{
                          ...styles.tag,
                          background: "#ede9fe",
                          color: "#6b21a8"
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quiz Stats */}
                    <div style={styles.quizStats}>
                      <div style={styles.statItem}>
                        <FaClock style={{ color: "#6b7280" }} />
                        <span>{quiz.timeLimit} min</span>
                      </div>
                      <div style={styles.statItem}>
                        <FaClipboardList style={{ color: "#6b7280" }} />
                        <span>{quiz.questions?.length || 0} Qs</span>
                      </div>
                      <div style={styles.statItem}>
                        <FaStar style={{ color: "#6b7280" }} />
                        <span>{quiz.totalPoints || 0} pts</span>
                      </div>
                    </div>

                    {/* Attempt Info */}
                    {attemptInfo && (
                      <div style={styles.attemptInfo}>
                        <div style={styles.scoreRow}>
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                            Your Score:
                          </span>
                          <span style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: attemptInfo.isPassed ? "#10b981" : "#f59e0b"
                          }}>
                            {attemptInfo.bestScore}%
                          </span>
                        </div>
                        <div style={styles.attemptsInfo}>
                          Attempts: {attemptInfo.attempts}/{quiz.attemptsAllowed}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/quizzes/${quiz._id}`);
                      }}
                      style={{
                        ...styles.startBtn,
                        background: isAttempted
                          ? attemptInfo.isPassed
                            ? "#d1fae5"
                            : "#fef3c7"
                          : "#8b5cf6",
                        color: isAttempted
                          ? attemptInfo.isPassed
                            ? "#065f46"
                            : "#92400e"
                          : "white"
                      }}
                      onMouseEnter={(e) => {
                        if (isAttempted) {
                          e.target.style.background = attemptInfo.isPassed 
                            ? "#bbf7d0" 
                            : "#fde68a";
                        } else {
                          e.target.style.background = "#7c3aed";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isAttempted) {
                          e.target.style.background = attemptInfo.isPassed 
                            ? "#d1fae5" 
                            : "#fef3c7";
                        } else {
                          e.target.style.background = "#8b5cf6";
                        }
                      }}
                    >
                      {isAttempted ? "Retake Quiz" : "Start Quiz"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quizzes;