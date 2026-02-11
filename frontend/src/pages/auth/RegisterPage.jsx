// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { FaEnvelope, FaLock, FaUser, FaUsers } from "react-icons/fa";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.role === "admin") {
      setError("Admin registration not allowed.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);

      // Register ke baad bhi token + user save kar do (future login ke liye)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration successful! Welcome!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-image-section">
          <img src="/images/loginBG.jpg" alt="Learn English" className="side-img" />
          <div className="image-text">
            <h1>Start Your English Journey</h1>
            <p>Improve reading, speaking, and confidence!</p>
          </div>
        </div>

        <div className="register-form-section">
          <h2>Create Account</h2>
          <p className="subtitle">Join our learning community</p>

          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <FaEnvelope className="icon" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <FaLock className="icon" />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <FaUsers className="icon" />
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">I am a...</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="register-btn">
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}