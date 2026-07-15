import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <div className="icon">🌾</div>
              <div>
                <strong>NASMS</strong>
                <br />
                <small>National Agricultural Support &amp; Monitoring System</small>
              </div>
            </div>
            <p>
              A Government of Kenya initiative under the Ministry of Agriculture &amp; Livestock
              Development, providing digital services to support Kenya&apos;s farming communities.
            </p>
            <div className="footer-social">
              <a className="social-icon" href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a className="social-icon" href="#" aria-label="Twitter">
                <i className="fab fa-twitter" />
              </a>
              <a className="social-icon" href="#" aria-label="YouTube">
                <i className="fab fa-youtube" />
              </a>
              <a className="social-icon" href="#" aria-label="WhatsApp">
                <i className="fab fa-whatsapp" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <a href="#">About NASMS</a>
            <a href="#">News &amp; Updates</a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/loans">Government Loans</Link>
            <Link to="/products">Farm Inputs</Link>
            <Link to="/market">Market Prices</Link>
            <Link to="/weather">Weather Forecast</Link>
            <a href="#">Farmer Training</a>
          </div>
          <div className="footer-col footer-contact">
            <h4>Contact Us</h4>
            <p>📞 Toll-Free: 0800 720 093</p>
            <p>✉️ info@nasms.go.ke</p>
            <p>📍 Kilimo House, Cathedral Rd, Nairobi</p>
            <p>🕗 Mon–Fri: 8:00 AM – 5:00 PM</p>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <span>
            © 2026 Government of Kenya – Ministry of Agriculture &amp; Livestock Development. All
            rights reserved.
          </span>
          <div className="footer-links">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
