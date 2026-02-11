// src/pages/teacher/TeacherProgress.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function TeacherProgress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/teacher/progress")
      .then(res => setData(res.data))
      .catch(() => {
        setData([
          { name: "Ali Khan", progress: 70 },
          { name: "Sara Ahmed", progress: 85 },
          { name: "Bilal Hussain", progress: 60 },
          { name: "Fatima Noor", progress: 90 }
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
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "48px", color: "#6b21a8", textAlign: "center", marginBottom: "15px" }}>
            Student Progress Tracking
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", textAlign: "center", marginBottom: "60px" }}>
            Monitor individual student performance
          </p>

          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe"
          }}>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", textAlign: "center", marginBottom: "40px" }}>
              Overall Class Progress
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd6fe" />
                <XAxis dataKey="name" tick={{ fill: "#6b21a8" }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6b21a8" }} />
                <Tooltip 
                  contentStyle={{ background: "#f3e8ff", border: "2px solid #ddd6fe", borderRadius: "16px" }}
                  labelStyle={{ color: "#6b21a8", fontWeight: "bold" }}
                />
                <Bar dataKey="progress" fill="#7c3aed" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProgress;