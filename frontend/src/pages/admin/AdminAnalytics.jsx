// src/pages/admin/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const AdminAnalytics = () => {
  const [data, setData] = useState({
    userGrowth: [],
    roleCounts: [],
    lessonActivity: [],
    assignmentActivity: []
  });

  useEffect(() => {
    // Dummy data for beautiful charts
    setData({
      userGrowth: [
        { _id: 1, count: 45 },
        { _id: 2, count: 52 },
        { _id: 3, count: 48 },
        { _id: 4, count: 65 },
        { _id: 5, count: 78 },
        { _id: 6, count: 92 },
        { _id: 7, count: 88 },
        { _id: 8, count: 105 },
        { _id: 9, count: 98 },
        { _id: 10, count: 115 },
        { _id: 11, count: 132 },
        { _id: 12, count: 156 }
      ],
      roleCounts: [
        { _id: "student", count: 148 },
        { _id: "teacher", count: 8 },
        { _id: "admin", count: 1 }
      ],
      lessonActivity: Array.from({ length: 12 }, (_, i) => ({ _id: i + 1, count: Math.floor(Math.random() * 10) + 2 })),
      assignmentActivity: Array.from({ length: 12 }, (_, i) => ({ _id: i + 1, count: Math.floor(Math.random() * 15) + 3 }))
    });
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const mapMonthly = (arr) => months.map((_, i) => {
    const found = arr.find(d => d._id === i + 1);
    return found ? found.count : 0;
  });

  const chartOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    stroke: { curve: "smooth", width: 3 },
    grid: { borderColor: "#e5e7eb", strokeDashArray: 5 },
    xaxis: { categories: months, labels: { style: { colors: "#6b7280" } } },
    yaxis: { labels: { style: { colors: "#6b7280" } } },
    fill: { opacity: 0.8 },
    tooltip: { theme: "dark" }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{ fontSize: "48px", color: "#6b21a8", fontWeight: "bold" }}>
            Platform Analytics
          </h1>
          <p style={{ fontSize: "22px", color: "#9333ea" }}>
            Real-time insights and growth metrics
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px"
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "32px",
            boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
            border: "2px solid #ddd6fe"
          }}>
            <h3 style={{ fontSize: "28px", color: "#6b21a8", marginBottom: "20px" }}>
              User Growth (2025)
            </h3>
            <Chart
              options={{ ...chartOptions, colors: ["#7c3aed"] }}
              series={[{ name: "New Users", data: mapMonthly(data.userGrowth) }]}
              type="area"
              height={350}
            />
          </div>

          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "32px",
            boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
            border: "2px solid #ddd6fe"
          }}>
            <h3 style={{ fontSize: "28px", color: "#6b21a8", marginBottom: "20px" }}>
              Role Distribution
            </h3>
            <Chart
              options={{
                labels: data.roleCounts.map(r => r._id.charAt(0).toUpperCase() + r._id.slice(1)),
                colors: ["#10b981", "#f59e0b", "#7c3aed"],
                legend: { position: "bottom" }
              }}
              series={data.roleCounts.map(r => r.count)}
              type="donut"
              height={350}
            />
          </div>

          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "32px",
            boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
            border: "2px solid #ddd6fe"
          }}>
            <h3 style={{ fontSize: "28px", color: "#6b21a8", marginBottom: "20px" }}>
              Lessons Created
            </h3>
            <Chart
              options={{ ...chartOptions, colors: ["#3b82f6"] }}
              series={[{ name: "Lessons", data: mapMonthly(data.lessonActivity) }]}
              type="bar"
              height={350}
            />
          </div>

          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "32px",
            boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
            border: "2px solid #ddd6fe"
          }}>
            <h3 style={{ fontSize: "28px", color: "#6b21a8", marginBottom: "20px" }}>
              Assignments Created
            </h3>
            <Chart
              options={{ ...chartOptions, colors: ["#ef4444"] }}
              series={[{ name: "Assignments", data: mapMonthly(data.assignmentActivity) }]}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;