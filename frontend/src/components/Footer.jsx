// src/components/Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2025 English Learning App. All rights reserved.</p>
          <p>Made with ❤️ by Bushra Qayyum</p>
        </div>

        <div className="footer-center">
          <p><FaEnvelope /> support@englishlearn.com</p>
          <p><FaPhone /> +92 300 1234567</p>
        </div>

        <div className="footer-right">
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;