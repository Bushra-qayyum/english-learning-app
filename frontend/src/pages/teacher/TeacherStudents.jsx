// src/pages/teacher/TeacherStudents.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { FaUserGraduate, FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";

function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    api.get("/teacher/students")
      .then(res => {
        setStudents(res.data.students);
        setStats(res.data.stats);
      })
      .catch(() => {
        // Fallback only if API fails
        setStudents([
          { _id: 1, name: "Ali Khan", email: "ali@example.com", progress: 70, isActive: true },
          { _id: 2, name: "Sara Ahmed", email: "sara@example.com", progress: 85, isActive: true },
          { _id: 3, name: "Bilal Hussain", email: "bilal@example.com", progress: 60, isActive: false },
          { _id: 4, name: "Fatima Noor", email: "fatima@example.com", progress: 90, isActive: true }
        ]);
        setStats({ total: 4, active: 3, inactive: 1 });
      });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)"
        }}>
          <h1 style={{ fontSize: "48px", color: "#6b21a8", textAlign: "center", marginBottom: "15px" }}>
            My Students
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea", textAlign: "center", marginBottom: "60px" }}>
            Monitor and manage your enrolled students
          </p>

          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            marginBottom: "60px"
          }}>
            <div style={{
              background: "#f3e8ff",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(139,92,246,0.1)",
              textAlign: "center",
              borderLeft: "6px solid #a78bfa"
            }}>
              <FaUsers style={{ fontSize: "50px", color: "#7c3aed", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#4c1d95" }}>Total Students</h3>
              <p style={{ fontSize: "42px", fontWeight: "bold", color: "#6b21a8" }}>
                {stats.total}
              </p>
            </div>

            <div style={{
              background: "#bbf7d0",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(34,197,94,0.2)",
              textAlign: "center",
              borderLeft: "6px solid #22c55e"
            }}>
              <FaUserCheck style={{ fontSize: "50px", color: "#16a34a", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#166534" }}>Active Students</h3>
              <p style={{ fontSize: "42px", fontWeight: "bold", color: "#15803d" }}>
                {stats.active}
              </p>
            </div>

            <div style={{
              background: "#fecaca",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(239,68,68,0.2)",
              textAlign: "center",
              borderLeft: "6px solid #ef4444"
            }}>
              <FaUserTimes style={{ fontSize: "50px", color: "#dc2626", marginBottom: "15px" }} />
              <h3 style={{ fontSize: "18px", color: "#991b1b" }}>Inactive Students</h3>
              <p style={{ fontSize: "42px", fontWeight: "bold", color: "#b91c1c" }}>
                {stats.inactive}
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div style={{
            background: "#f3e8ff",
            padding: "40px",
            borderRadius: "24px",
            border: "2px solid #ddd6fe"
          }}>
            <h2 style={{ fontSize: "32px", color: "#6b21a8", textAlign: "center", marginBottom: "30px" }}>
              Student List
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#e9d5ff" }}>
                    <th style={{ padding: "20px", textAlign: "left", fontSize: "18px", color: "#6b21a8" }}>#</th>
                    <th style={{ padding: "20px", textAlign: "left", fontSize: "18px", color: "#6b21a8" }}>Name</th>
                    <th style={{ padding: "20px", textAlign: "left", fontSize: "18px", color: "#6b21a8" }}>Email</th>
                    <th style={{ padding: "20px", textAlign: "left", fontSize: "18px", color: "#6b21a8" }}>Progress</th>
                    <th style={{ padding: "20px", textAlign: "left", fontSize: "18px", color: "#6b21a8" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id} style={{ borderBottom: "1px solid #ddd6fe" }}>
                      <td style={{ padding: "20px", fontSize: "16px", color: "#4c1d95" }}>{index + 1}</td>
                      <td style={{ padding: "20px", fontSize: "18px", fontWeight: "bold", color: "#6b21a8" }}>
                        {student.name}
                      </td>
                      <td style={{ padding: "20px", fontSize: "16px", color: "#9333ea" }}>{student.email}</td>
                      <td style={{ padding: "20px" }}>
                        <div style={{
                          background: "#e9d5ff",
                          padding: "10px 20px",
                          borderRadius: "30px",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#6b21a8"
                        }}>
                          {student.progress || "N/A"}%
                        </div>
                      </td>
                      <td style={{ padding: "20px" }}>
                        <span style={{
                          background: student.isActive ? "#bbf7d0" : "#fecaca",
                          color: student.isActive ? "#166534" : "#991b1b",
                          padding: "10px 20px",
                          borderRadius: "30px",
                          fontWeight: "bold"
                        }}>
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherStudents;