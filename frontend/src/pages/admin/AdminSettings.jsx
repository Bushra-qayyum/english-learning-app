// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from "react";
import "../../styles/AdminSettings.css";
import { 
  FaPalette, FaBell, FaTools, FaShieldAlt, FaClock, FaLanguage, 
  FaEnvelope, FaLock, FaSave 
} from "react-icons/fa";

function AdminSettings() {
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    maintenance: false,
    allowRegistration: true,
    emailNotifications: true,
    twoFactorAuth: false,
    defaultLanguage: "en",
    sessionTimeout: "30"
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSave = () => {
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-settings">
      <div className="admin-settings-header">
        <h1>Admin Settings</h1>
        <p>Configure your platform exactly how you want</p>
      </div>

      <div className="settings-grid">

        {/* Appearance Card */}
        <div className="settings-card">
          <h3 className="card-title">
            Appearance
          </h3>
          <div className="setting-item">
            <div className="setting-label">
              Platform Theme
            </div>
            <select 
              name="theme" 
              value={settings.theme} 
              onChange={handleChange}
              className="select-custom"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Default Language
            </div>
            <select 
              name="defaultLanguage" 
              value={settings.defaultLanguage} 
              onChange={handleChange}
              className="select-custom"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="settings-card">
          <h3 className="card-title">
            Notifications
          </h3>
          <div className="setting-item">
            <div className="setting-label">
              Email Notifications
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                name="emailNotifications" 
                checked={settings.emailNotifications} 
                onChange={handleChange} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Push Notifications
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                name="notifications" 
                checked={settings.notifications} 
                onChange={handleChange} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Security Card */}
        <div className="settings-card">
          <h3 className="card-title">
            Security
          </h3>
          <div className="setting-item">
            <div className="setting-label">
              Two-Factor Authentication
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                name="twoFactorAuth" 
                checked={settings.twoFactorAuth} 
                onChange={handleChange} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Session Timeout (minutes)
            </div>
            <select 
              name="sessionTimeout" 
              value={settings.sessionTimeout} 
              onChange={handleChange}
              className="select-custom"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        {/* Platform Card */}
        <div className="settings-card">
          <h3 className="card-title">
            Platform Control
          </h3>
          <div className="setting-item">
            <div className="setting-label">
              Allow New Registrations
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                name="allowRegistration" 
                checked={settings.allowRegistration} 
                onChange={handleChange} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              Maintenance Mode
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                name="maintenance" 
                checked={settings.maintenance} 
                onChange={handleChange} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button className="save-btn" onClick={handleSave}>
          Save All Settings
        </button>
        {saved && <div className="success-message">Settings saved successfully!</div>}
      </div>

      <div style={{ textAlign: "center", marginTop: "60px", color: "#95a5a6" }}>
        <p>© 2025 English Learning App • Made with love by <strong>Bushra Qayyum</strong></p>
      </div>
    </div>
  );
}

export default AdminSettings;