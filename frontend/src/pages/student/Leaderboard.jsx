// src/pages/student/Leaderboard.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaTrophy, FaMedal, FaCrown } from "react-icons/fa";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/leaderboard")
      .then(res => {
        setLeaderboard(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Demo data
        setLeaderboard([
          { name: "Bushra Qayyum", points: 3250 },
          { name: "Ali Khan", points: 2980 },
          { name: "Sara Ahmed", points: 2750 },
          { name: "Zainab Fatima", points: 2400 },
          { name: "Hamza Malik", points: 2200 },
          { name: "Ayesha Siddiqua", points: 1950 },
          { name: "Omar Farooq", points: 1800 },
        ]);
        setLoading(false);
      });
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <FaCrown style={{ color: "#fbbf24", fontSize: "40px" }} />;
    if (index === 1) return <FaMedal style={{ color: "#94a3b8", fontSize: "36px" }} />;
    if (index === 2) return <FaMedal style={{ color: "#fca5a5", fontSize: "36px" }} />;
    return <span style={{ fontSize: "28px", fontWeight: "bold", color: "#e9d5ff" }}>{index + 1}</span>;
  };

  const getRankColor = (index) => {
    if (index === 0) return "linear-gradient(135deg, #fbbf24, #f59e0b)";
    if (index === 1) return "linear-gradient(135deg, #94a3b8, #64748b)";
    if (index === 2) return "linear-gradient(135deg, #fca5a5, #ef4444)";
    return "rgba(255,255,255,0.15)";
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
          <div style={{ marginBottom: "40px" }}>
            <FaTrophy style={{ fontSize: "80px", color: "#7c3aed" }} />
            <h1 style={{ fontSize: "52px", color: "#6b21a8", margin: "20px 0 10px" }}>
              Leaderboard
            </h1>
            <p style={{ fontSize: "24px", color: "#9333ea" }}>
              Top performers of the month!
            </p>
          </div>

          {loading ? (
            <p style={{ fontSize: "24px", color: "#9333ea" }}>Loading rankings...</p>
          ) : (
            <div>
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  style={{
                    background: getRankColor(index),
                    color: index < 3 ? "#1e293b" : "white",
                    padding: "25px",
                    margin: "15px 0",
                    borderRadius: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "24px",
                    fontWeight: "600",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    transition: "all 0.3s",
                    border: index < 3 ? "3px solid #ddd6fe" : "none"
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-8px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
                    <div style={{
                      width: "70px",
                      height: "70px",
                      background: index < 3 ? "#ffffff" : "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
                    }}>
                      {getRankIcon(index)}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                        {player.name}
                      </div>
                      {index < 3 && (
                        <div style={{ fontSize: "16px", opacity: 0.8, marginTop: "5px" }}>
                          {index === 0 ? "Champion" : index === 1 ? "Runner Up" : "Third Place"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    {player.points.toLocaleString()} pts
                  </div>
                </div>
              ))}
            </div>
          )}

          <p style={{ marginTop: "50px", fontSize: "20px", color: "#9333ea" }}>
            Keep learning and climb the ranks! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;