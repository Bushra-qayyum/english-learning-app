// src/pages/teacher/TeacherLiveSessions.jsx
import "../../styles/TeacherLiveSessions.css";

function TeacherLiveSessions() {
  const sessions = [
    { id: 1, topic: "Speaking Practice", date: "10 Jan 2026", time: "6:00 PM", status: "Upcoming" },
    { id: 2, topic: "Grammar Q&A", date: "12 Jan 2026", time: "5:00 PM", status: "Upcoming" },
    { id: 3, topic: "Essay Writing Review", date: "08 Jan 2026", time: "7:00 PM", status: "Completed" },
    { id: 4, topic: "Vocabulary Building", date: "15 Jan 2026", time: "4:00 PM", status: "Upcoming" },
  ];

  return (
    <div className="teacher-livesessions">
      <div className="teacher-livesessions-header">
        <h1>📺 Live Sessions</h1>
        <p className="subtitle">Schedule and manage interactive sessions with your students</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p className="stat-number">{sessions.length}</p>
        </div>
        <div className="stat-card upcoming">
          <h3>Upcoming</h3>
          <p className="stat-number">{sessions.filter(s => s.status === "Upcoming").length}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p className="stat-number">{sessions.filter(s => s.status === "Completed").length}</p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="sessions-card">
        <div className="card-header">
          <h2>Your Scheduled Sessions</h2>
          <button className="schedule-btn">
            + Schedule New Session
          </button>
        </div>

        <div className="table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session.id}>
                  <td>{index + 1}</td>
                  <td className="topic-cell">{session.topic}</td>
                  <td>{session.date}</td>
                  <td>{session.time}</td>
                  <td>
                    <span className={`status-badge ${session.status.toLowerCase()}`}>
                      {session.status}
                    </span>
                  </td>
                  <td>
                    {session.status === "Upcoming" ? (
                      <button className="action-btn join-btn">Join Live</button>
                    ) : (
                      <button className="action-btn recording-btn">View Recording</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="footer-text">
        © 2026 English Learning App • Made with ❤️ by <strong>Bushra Qayyum</strong>
      </p>
    </div>
  );
}

export default TeacherLiveSessions;