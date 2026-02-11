// src/components/Layout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../styles/Layout.css";

function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="app-layout">
      <Navbar user={user} />
      <div className="layout-body">
        <Sidebar role={user.role} />
        <main className="layout-main">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default Layout;