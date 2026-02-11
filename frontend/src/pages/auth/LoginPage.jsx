// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      // YE 2 LINES SABSE ZAROORI HAIN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role ke hisaab se redirect
      const role = res.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/dashboard");

      alert("Login successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image-section">
          <img src="/images/loginSide.jpg" alt="Learn English" className="side-img" />
          <div className="image-text">
            <h1>Empower Your English Journey</h1>
            <p>Learn, speak, and shine with confidence!</p>
          </div>
        </div>

        <div className="login-form-section">
          <h2>Welcome Back</h2>
          <p className="subtitle">Continue your learning adventure</p>

          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="register-link">
            New here? <a href="/register">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}