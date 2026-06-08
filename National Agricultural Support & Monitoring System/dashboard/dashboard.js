/* ═══════════════════════════════════════════════════════════
   NASMS – dashboard/dashboard.js
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderNav('dashboard');
  renderFooter();
  setDateLine();
  initDashChart();
});

function setDateLine() {
  const el = document.getElementById('dateLine');
  if (el) {
    el.textContent = new Date().toLocaleDateString('en-KE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}

function initDashChart() {
  const ctx = document.getElementById('dashChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [
        { label: 'Maize (bags)', data: [280, 310, 355, 356, 420], backgroundColor: '#2d7a4f', borderRadius: 6 },
        { label: 'Beans (bags)', data: [120, 145, 155, 171, 185], backgroundColor: '#d4a96a', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { font: { family: 'DM Sans' } } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#e8f5ed' } }
      }
    }
  });
}
