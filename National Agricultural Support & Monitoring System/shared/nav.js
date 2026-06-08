const NAV_LINKS = [
  { id: 'home',      label: '🏠 Home',             href: '../home/index.html' },
  { id: 'register',  label: '📝 Register',          href: '../register/index.html' },
  { id: 'login',     label: '🔐 Login',             href: '../login/index.html' },
  { id: 'dashboard', label: '👨‍🌾 Farmers',          href: '../dashboard/index.html' },
  { id: 'loans',     label: '💰 Loans',             href: '../loans/index.html' },
  { id: 'products',  label: '🌱 Farm Inputs',       href: '../products/index.html' },
  { id: 'market',    label: '🏪 Buyers & Sellers',  href: '../market/index.html' },
  { id: 'weather',   label: '🌤 Weather',           href: '../weather/index.html' },
  { id: 'analytics', label: '📊 Analytics',         href: '../analytics/index.html' },
];

/**
 * Inject the navigation bar into #nav-container.
 * @param {string} activePage - page id to mark as active (e.g. 'home')
 */
function renderNav(activePage) {
  const desktopLinks = NAV_LINKS.map(link => `
    <li>
      <a href="${link.href}" class="${link.id === activePage ? 'active' : ''}">
        ${link.label}
      </a>
    </li>
  `).join('');

  const mobileLinks = NAV_LINKS.map(link => `
    <a href="${link.href}">${link.label}</a>
  `).join('');

  const html = `
    <nav>
      <div class="nav-inner">
        <a href="../home/index.html" class="nav-logo">
          <div class="nav-logo-icon">🌾</div>
          <div class="nav-logo-text">
            <strong>NASMS</strong>
            <span>Agricultural System</span>
          </div>
        </a>
        <ul class="nav-links">${desktopLinks}
          <li><a href="../chat/chat.html" class="nav-cta"><i class="fa fa-comment"></i> Support</a></li>
        </ul>
        <button class="hamburger" onclick="toggleMobileNav()" aria-label="Open Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-nav" id="mobileNav">
      ${mobileLinks}
      <a href="../chat/chat.html">💬 Chat Support</a>
    </div>
  `;

  const container = document.getElementById('nav-container');
  if (container) container.innerHTML = html;
}

function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}
