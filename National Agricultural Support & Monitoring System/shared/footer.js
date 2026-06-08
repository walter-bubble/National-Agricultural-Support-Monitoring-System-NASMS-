function renderFooter() {
  const html = `
    <footer>
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo-wrap">
              <div class="icon">🌾</div>
              <div>
                <strong>NASMS</strong><br>
                <small>National Agricultural Support &amp; Monitoring System</small>
              </div>
            </div>
            <p>A Government of Kenya initiative under the Ministry of Agriculture &amp;
               Livestock Development, providing digital services to support Kenya's farming communities.</p>
            <div class="footer-social">
              <a class="social-icon" href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a class="social-icon" href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a class="social-icon" href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
              <a class="social-icon" href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <a href="../home/index.html">Home</a>
            <a href="../register/index.html">Register</a>
            <a href="../login/index.html">Login</a>
            <a href="#">About NASMS</a>
            <a href="#">News &amp; Updates</a>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <a href="../loans/index.html">Government Loans</a>
            <a href="../products/index.html">Farm Inputs</a>
            <a href="../market/index.html">Market Prices</a>
            <a href="../weather/index.html">Weather Forecast</a>
            <a href="#">Farmer Training</a>
          </div>
          <div class="footer-col footer-contact">
            <h4>Contact Us</h4>
            <p>📞 Toll-Free: 0800 720 093</p>
            <p>✉️ info@nasms.go.ke</p>
            <p>📍 Kilimo House, Cathedral Rd, Nairobi</p>
            <p>🕗 Mon–Fri: 8:00 AM – 5:00 PM</p>
          </div>
        </div>
        <hr class="footer-divider">
        <div class="footer-bottom">
          <span>© 2026 Government of Kenya – Ministry of Agriculture &amp; Livestock Development. All rights reserved.</span>
          <div class="footer-links">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Help</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  const container = document.getElementById('footer-container');
  if (container) container.innerHTML = html;
}
