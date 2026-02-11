// src/pages/student/Profile.jsx
import { useState } from "react";

function Profile() {
  const savedUser = JSON.parse(localStorage.getItem("user")) || { name: "Student", email: "student@example.com" };
  const [user, setUser] = useState(savedUser);
  const [editing, setEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleChange = (e) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    localStorage.setItem("user", JSON.stringify(tempUser));
    setUser(tempUser);
    setEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f5ff",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(139,92,246,0.1)",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "42px", color: "#7c3aed", marginBottom: "30px" }}>
            My Profile
          </h1>

          <div style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            margin: "0 auto 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "80px",
            fontWeight: "bold",
            boxShadow: "0 15px 40px rgba(139,92,246,0.3)"
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          {editing ? (
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <input
                type="text"
                name="name"
                value={tempUser.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "15px",
                  margin: "10px 0",
                  borderRadius: "16px",
                  border: "1px solid #ddd6fe",
                  fontSize: "18px"
                }}
                placeholder="Your Name"
              />
              <input
                type="email"
                name="email"
                value={tempUser.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "15px",
                  margin: "10px 0",
                  borderRadius: "16px",
                  border: "1px solid #ddd6fe",
                  fontSize: "18px"
                }}
                placeholder="Your Email"
              />
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                <button onClick={saveChanges} style={{
                  background: "#7c3aed",
                  color: "white",
                  padding: "15px 40px",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "18px",
                  cursor: "pointer"
                }}>
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)} style={{
                  background: "#e5e7eb",
                  color: "#4b5563",
                  padding: "15px 40px",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "18px",
                  cursor: "pointer"
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "28px", color: "#4c1d95", margin: "15px 0" }}>
                <strong>{user.name}</strong>
              </p>
              <p style={{ fontSize: "22px", color: "#9333ea", margin: "15px 0" }}>
                {user.email}
              </p>
              <p style={{ fontSize: "20px", color: "#6b21a8", margin: "15px 0" }}>
                Role: Student
              </p>
              <button onClick={() => setEditing(true)} style={{
                background: "#7c3aed",
                color: "white",
                padding: "15px 40px",
                border: "none",
                borderRadius: "20px",
                fontSize: "18px",
                cursor: "pointer",
                marginTop: "30px",
                boxShadow: "0 10px 25px rgba(124,58,237,0.3)"
              }}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;