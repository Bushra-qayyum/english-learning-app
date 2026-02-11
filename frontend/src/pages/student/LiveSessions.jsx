// src/pages/student/LiveSessions.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";

function LiveSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/livesessions")
      .then(res => setSessions(res.data))
      .catch(() => {
        // Demo data
        setSessions([
          { _id: 1, topic: "English Conversation Practice", date: "2025-01-05", time: "7:00 PM", link: "https://meet.google.com/abc-defg-hij" },
          { _id: 2, topic: "Grammar Workshop", date: "2025-01-10", time: "6:00 PM", link: "https://meet.google.com/xyz-abcd-efg" }
        ]);
      });
  }, []);

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
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "44px", color: "#6b21a8", marginBottom: "15px" }}>
            Live Sessions
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", marginBottom: "50px" }}>
            Join upcoming live classes with your teacher
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px"
          }}>
            {sessions.length === 0 ? (
              <p style={{ fontSize: "24px", color: "#9ca3af", gridColumn: "1 / -1" }}>
                No upcoming sessions. Check back later!
              </p>
            ) : (
              sessions.map(s => (
                <div key={s._id} style={{
                  background: "#f3e8ff",
                  padding: "30px",
                  borderRadius: "24px",
                  boxShadow: "0 10px 30px rgba(139,92,246,0.1)",
                  textAlign: "center"
                }}>
                  <h3 style={{ fontSize: "28px", color: "#6b21a8", marginBottom: "15px" }}>
                    {s.topic}
                  </h3>
                  <p style={{ fontSize: "20px", color: "#9333ea", marginBottom: "20px" }}>
                    📅 {s.date} at {s.time}
                  </p>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" style={{
                    background: "#7c3aed",
                    color: "white",
                    padding: "15px 40px",
                    borderRadius: "24px",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "bold",
                    display: "inline-block",
                    boxShadow: "0 8px 20px rgba(124,58,237,0.3)"
                  }}>
                    Join Session
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveSessions;