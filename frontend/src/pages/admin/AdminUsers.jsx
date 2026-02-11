// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api";
import "../../styles/AdminUsers.css" // YE LINE ADD KAR DE (teri purani CSS)

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      // Demo users
      setUsers([
        { _id: "1", name: "Bushra Qayyum", email: "bushra@gmail.com", role: "student", isActive: true },
        { _id: "2", name: "Ali Khan", email: "ali@gmail.com", role: "student", isActive: true },
        { _id: "3", name: "Sara Ahmed", email: "sara@gmail.com", role: "student", isActive: false },
        { _id: "4", name: "Haleema Qayyum", email: "halee@gmail.com", role: "teacher", isActive: true },
        { _id: "5", name: "Default Admin", email: "admin@ela.com", role: "admin", isActive: true }
      ]);
    }
  };

  const toggleActive = (id) => {
    setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const deleteUser = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers(users.filter(u => u._id !== id));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users" style={{ padding: "40px", background: "#f8f9fa", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "#2c3e50", marginBottom: "8px" }}>
        Manage Users
      </h2>
      <p className="subtitle" style={{ fontSize: "18px", marginBottom: "30px" }}>
        Total Users: <strong>{users.length}</strong> | Active: <strong style={{ color: "#27ae60" }}>{users.filter(u => u.isActive).length} Active</strong>
      </p>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ fontSize: "16px" }}
        />
      </div>

      {/* Users Table - Super Clean & Professional */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        marginTop: "20px"
      }}>
        <table className="table" style={{ margin: 0 }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "white" }}>
              <th style={{ padding: "18px 20px", fontSize: "16px" }}>Name</th>
              <th style={{ padding: "18px 20px", fontSize: "16px" }}>Email</th>
              <th style={{ padding: "18px 20px", fontSize: "16px" }}>Role</th>
              <th style={{ padding: "18px 20px", fontSize: "16px" }}>Status</th>
              <th style={{ padding: "18px 20px", fontSize: "16px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} style={{
                background: "white",
                transition: "0.3s",
                borderBottom: "1px solid #eee"
              }}
              onMouseOver={e => e.currentTarget.style.background = "#f8f9fa"}
              onMouseOut={e => e.currentTarget.style.background = "white"}
              >
                <td style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: user.role === "admin" ? "#8e74c3c" : user.role === "teacher" ? "#f39c12" : "#27ae60",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "20px"
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <strong>{user.name}</strong>
                  </div>
                </td>
                <td style={{ padding: "20px", color: "#555" }}>{user.email}</td>
                <td style={{ padding: "20px" }}>
                  <span style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: user.role === "admin" ? "#e74c3c" : user.role === "teacher" ? "#f39c12" : "#27ae60",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "20px" }}>
                  <span className={`status ${user.isActive ? "active" : "inactive"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "20px", textAlign: "center" }}>
                  <button
                    onClick={() => toggleActive(user._id)}
                    className={`btn small ${user.isActive ? "danger" : ""}`}
                    style={{
                      background: user.isActive ? "#e74c3c" : "#27ae60",
                      marginRight: "10px"
                    }}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="btn small danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px", color: "#777" }}>
        <p>© 2025 English Learning App • Made with love by <strong>Bushra Qayyum</strong></p>
      </div>
    </div>
  );
}

export default AdminUsers;