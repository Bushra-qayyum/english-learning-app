import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaPlus,
  FaFilter
} from "react-icons/fa";

function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quizzes/teacher");
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      Swal.fire("Error", "Failed to load quizzes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId, quizTitle) => {
    Swal.fire({
      title: "Delete Quiz?",
      text: `Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/quizzes/${quizId}`);
          Swal.fire("Deleted!", "Quiz has been deleted.", "success");
          fetchQuizzes();
        } catch (error) {
          console.error("Error deleting quiz:", error);
          Swal.fire("Error", "Failed to delete quiz", "error");
        }
      }
    });
  };

  const handlePublishToggle = async (quizId, currentStatus, quizTitle) => {
    try {
      await api.put(`/quizzes/${quizId}`, {
        isPublished: !currentStatus
      });
      
      Swal.fire(
        "Success!",
        `Quiz "${quizTitle}" has been ${!currentStatus ? "published" : "unpublished"}`,
        "success"
      );
      
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz:", error);
      Swal.fire("Error", "Failed to update quiz status", "error");
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === "all") return true;
    if (filter === "published") return quiz.isPublished;
    if (filter === "draft") return !quiz.isPublished;
    if (filter === "active") {
      const now = new Date();
      return quiz.isPublished && 
             (!quiz.startDate || new Date(quiz.startDate) <= now) &&
             (!quiz.endDate || new Date(quiz.endDate) >= now);
    }
    return true;
  });

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
    headerCard: {
      background: "white",
      borderRadius: "24px",
      padding: "30px",
      boxShadow: "0 20px 60px rgba(139, 92, 246, 0.1)",
      marginBottom: "30px"
    },
    headerContent: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
      marginBottom: "30px"
    },
    headerTitle: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#6b21a8",
      marginBottom: "10px"
    },
    headerSubtitle: {
      fontSize: "16px",
      color: "#6b7280"
    },
    createButton: {
      padding: "12px 24px",
      background: "linear-gradient(45deg, #8b5cf6, #6366f1)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px"
    },
    statCard: {
      padding: "20px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      gap: "15px"
    },
    statIconContainer: {
      padding: "12px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    statIcon: {
      fontSize: "20px"
    },
    statContent: {
      flex: "1"
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "4px"
    },
    statLabel: {
      fontSize: "14px"
    },
    filterCard: {
      background: "white",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      marginBottom: "20px"
    },
    filterContent: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    filterLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "16px",
      fontWeight: "500",
      color: "#374151"
    },
    filterButtons: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px"
    },
    filterButton: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    tableContainer: {
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(139, 92, 246, 0.1)",
      overflow: "hidden",
      marginBottom: "30px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    tableHeader: {
      background: "#f9fafb"
    },
    th: {
      padding: "16px 24px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "500",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #e5e7eb"
    },
    tableRow: {
      transition: "background 0.2s"
    },
    td: {
      padding: "20px 24px",
      borderBottom: "1px solid #e5e7eb",
      verticalAlign: "top"
    },
    quizTitle: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#1f2937",
      marginBottom: "5px"
    },
    quizDesc: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "10px",
      maxWidth: "300px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    tagsContainer: {
      display: "flex",
      gap: "8px"
    },
    tag: {
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500"
    },
    statusContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    statusDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%"
    },
    statusText: {
      fontSize: "14px",
      fontWeight: "500"
    },
    questionCount: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "5px"
    },
    pointsText: {
      fontSize: "14px",
      color: "#6b7280"
    },
    scoreText: {
      fontSize: "18px",
      fontWeight: "600"
    },
    passText: {
      fontSize: "14px",
      color: "#6b7280",
      marginTop: "5px"
    },
    dateContainer: {
      fontSize: "14px",
      color: "#1f2937",
      marginBottom: "5px"
    },
    timeText: {
      fontSize: "12px",
      color: "#9ca3af"
    },
    actionsContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    actionButton: {
      padding: "8px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s"
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
      color: "#6b7280",
      marginBottom: "30px"
    },
    createFirstButton: {
      padding: "12px 24px",
      background: "#8b5cf6",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s"
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
    loadingText: {
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
          <p style={styles.loadingText}>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.headerTitle}>My Quizzes</h1>
              <p style={styles.headerSubtitle}>Create and manage quizzes for your students</p>
            </div>
            <button
              onClick={() => navigate("/teacher/create-quiz")}
              style={styles.createButton}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(45deg, #7c3aed, #4f46e5)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(45deg, #8b5cf6, #6366f1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <FaPlus /> Create New Quiz
            </button>
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, background: "#ede9fe" }}>
              <div style={{ ...styles.statIconContainer, background: "#ddd6fe" }}>
                <FaClipboardList style={{ ...styles.statIcon, color: "#7c3aed" }} />
              </div>
              <div style={styles.statContent}>
                <div style={{ ...styles.statValue, color: "#6b21a8" }}>{quizzes.length}</div>
                <div style={{ ...styles.statLabel, color: "#7c3aed" }}>Total Quizzes</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, background: "#dcfce7" }}>
              <div style={{ ...styles.statIconContainer, background: "#bbf7d0" }}>
                <FaEye style={{ ...styles.statIcon, color: "#16a34a" }} />
              </div>
              <div style={styles.statContent}>
                <div style={{ ...styles.statValue, color: "#166534" }}>
                  {quizzes.filter(q => q.isPublished).length}
                </div>
                <div style={{ ...styles.statLabel, color: "#16a34a" }}>Published</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, background: "#dbeafe" }}>
              <div style={{ ...styles.statIconContainer, background: "#bfdbfe" }}>
                <FaUsers style={{ ...styles.statIcon, color: "#2563eb" }} />
              </div>
              <div style={styles.statContent}>
                <div style={{ ...styles.statValue, color: "#1e40af" }}>
                  {quizzes.reduce((sum, q) => sum + (q.attemptsCount || 0), 0)}
                </div>
                <div style={{ ...styles.statLabel, color: "#2563eb" }}>Total Attempts</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, background: "#fef3c7" }}>
              <div style={{ ...styles.statIconContainer, background: "#fde68a" }}>
                <FaChartBar style={{ ...styles.statIcon, color: "#d97706" }} />
              </div>
              <div style={styles.statContent}>
                <div style={{ ...styles.statValue, color: "#92400e" }}>
                  {quizzes.length > 0 
                    ? Math.round(quizzes.reduce((sum, q) => sum + (q.averageScore || 0), 0) / quizzes.length)
                    : 0
                  }%
                </div>
                <div style={{ ...styles.statLabel, color: "#d97706" }}>Avg. Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterCard}>
          <div style={styles.filterContent}>
            <div style={styles.filterLabel}>
              <FaFilter style={{ color: "#6b7280" }} />
              <span>Filter:</span>
            </div>
            <div style={styles.filterButtons}>
              {["all", "published", "draft", "active"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  style={{
                    ...styles.filterButton,
                    background: filter === filterType ? "#8b5cf6" : "#f3f4f6",
                    color: filter === filterType ? "white" : "#374151"
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== filterType) {
                      e.target.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== filterType) {
                      e.target.style.background = "#f3f4f6";
                    }
                  }}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quizzes Table */}
        <div style={styles.tableContainer}>
          {filteredQuizzes.length === 0 ? (
            <div style={styles.emptyState}>
              <FaClipboardList style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>No Quizzes Found</h3>
              <p style={styles.emptyText}>
                {filter === "all" 
                  ? "Create your first quiz to get started!"
                  : `No ${filter} quizzes found`
                }
              </p>
              {filter === "all" && (
                <button
                  onClick={() => navigate("/teacher/create-quiz")}
                  style={styles.createFirstButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#7c3aed";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#8b5cf6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Create Your First Quiz
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.th}>Quiz Title</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Questions</th>
                    <th style={styles.th}>Attempts</th>
                    <th style={styles.th}>Avg. Score</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((quiz) => (
                    <tr 
                      key={quiz._id} 
                      style={styles.tableRow}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <td style={styles.td}>
                        <div>
                          <div style={styles.quizTitle}>{quiz.title}</div>
                          <div style={styles.quizDesc}>{quiz.description}</div>
                          <div style={styles.tagsContainer}>
                            <span style={{ ...styles.tag, background: "#dbeafe", color: "#1e40af" }}>
                              {quiz.category}
                            </span>
                            <span style={{ ...styles.tag, background: "#d1fae5", color: "#065f46" }}>
                              {quiz.languageLevel}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.statusContainer}>
                          <div style={{
                            ...styles.statusDot,
                            background: quiz.isPublished ? "#10b981" : "#f59e0b"
                          }}></div>
                          <span style={{
                            ...styles.statusText,
                            color: quiz.isPublished ? "#10b981" : "#f59e0b"
                          }}>
                            {quiz.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.questionCount}>{quiz.questions?.length || 0}</div>
                        <div style={styles.pointsText}>{quiz.totalPoints || 0} pts</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.questionCount}>{quiz.attemptsCount || 0}</div>
                        <div style={styles.pointsText}>{quiz.attemptsAllowed} allowed</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{
                          ...styles.scoreText,
                          color: (quiz.averageScore || 0) >= 70 
                            ? "#10b981" 
                            : (quiz.averageScore || 0) >= 50 
                              ? "#f59e0b" 
                              : "#ef4444"
                        }}>
                          {quiz.averageScore || 0}%
                        </div>
                        <div style={styles.passText}>Pass: {quiz.passingScore}%</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateContainer}>
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </div>
                        <div style={styles.timeText}>
                          {new Date(quiz.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionsContainer}>
                          <button
                            onClick={() => navigate(`/teacher/quizzes/${quiz._id}/attempts`)}
                            style={{
                              ...styles.actionButton,
                              color: "#2563eb",
                              background: "transparent"
                            }}
                            title="View Attempts"
                            onMouseEnter={(e) => {
                              e.target.style.background = "#dbeafe";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "transparent";
                            }}
                          >
                            <FaUsers />
                          </button>
                          <button
                            onClick={() => navigate(`/teacher/quizzes/${quiz._id}/edit`)}
                            style={{
                              ...styles.actionButton,
                              color: "#16a34a",
                              background: "transparent"
                            }}
                            title="Edit Quiz"
                            onMouseEnter={(e) => {
                              e.target.style.background = "#dcfce7";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "transparent";
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handlePublishToggle(quiz._id, quiz.isPublished, quiz.title)}
                            style={{
                              ...styles.actionButton,
                              color: quiz.isPublished ? "#f59e0b" : "#16a34a",
                              background: "transparent"
                            }}
                            title={quiz.isPublished ? "Unpublish" : "Publish"}
                            onMouseEnter={(e) => {
                              e.target.style.background = quiz.isPublished ? "#fef3c7" : "#dcfce7";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "transparent";
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                            style={{
                              ...styles.actionButton,
                              color: "#dc2626",
                              background: "transparent"
                            }}
                            title="Delete Quiz"
                            onMouseEnter={(e) => {
                              e.target.style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "transparent";
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherQuizzes;