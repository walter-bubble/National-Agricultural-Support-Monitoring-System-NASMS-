const DATA = {
  all: {
    labels: ['2019','2020','2021','2022','2023','2024','2025'],
    maize:    [200,230,280,310,355,356,420],
    beans:    [90,100,120,145,155,171,185],
    potatoes: [150,180,200,250,280,326,310],
  },
  recent: {
    labels: ['2022','2023','2024','2025'],
    maize:    [310,355,356,420],
    beans:    [145,155,171,185],
    potatoes: [250,280,326,310],
  }
};

let barInst, doughnutInst, lineInst;

const chartFont = { font: { family: 'DM Sans' }, padding: 14 };

document.addEventListener('DOMContentLoaded', () => {
  renderNav('analytics');
  renderFooter();
  initCharts('all', 'all');
});

function applyFilters() {
  const crop = document.getElementById('cropFilter').value;
  const year = document.getElementById('yearFilter').value;
  initCharts(crop, year);
}

function initCharts(crop, year) {
  const d = DATA[year === 'recent' ? 'recent' : 'all'];

  const datasets = [];
  if (crop === 'all' || crop === 'maize')    datasets.push({ label:'Maize',    data:d.maize,    backgroundColor:'#2d7a4f', borderRadius:6 });
  if (crop === 'all' || crop === 'beans')    datasets.push({ label:'Beans',    data:d.beans,    backgroundColor:'#d4a96a', borderRadius:6 });
  if (crop === 'all' || crop === 'potatoes') datasets.push({ label:'Potatoes', data:d.potatoes, backgroundColor:'#8b5e3c', borderRadius:6 });

  // ── Bar Chart ──
  const barCtx = document.getElementById('barChart');
  if (barInst) barInst.destroy();
  barInst = new Chart(barCtx, {
    type: 'bar',
    data: { labels: d.labels, datasets },
    options: {
      responsive: true,
      plugins: { legend: { labels: chartFont } },
      scales: { x: { grid: { display:false } }, y: { grid: { color:'#e8f5ed' } } }
    }
  });

  // ── Doughnut Chart ──
  const piCtx = document.getElementById('doughnutChart');
  if (doughnutInst) doughnutInst.destroy();
  const last = (arr) => arr[arr.length - 1];
  const prices = { maize:3800, beans:2600, potatoes:1800 };
  const pieData = [];
  const pieLabels = [];
  const pieColors = [];
  if (crop === 'all' || crop === 'maize')    { pieData.push(last(d.maize)*prices.maize);    pieLabels.push('Maize');    pieColors.push('#2d7a4f'); }
  if (crop === 'all' || crop === 'beans')    { pieData.push(last(d.beans)*prices.beans);    pieLabels.push('Beans');    pieColors.push('#d4a96a'); }
  if (crop === 'all' || crop === 'potatoes') { pieData.push(last(d.potatoes)*prices.potatoes); pieLabels.push('Potatoes'); pieColors.push('#8b5e3c'); }
  doughnutInst = new Chart(piCtx, {
    type: 'doughnut',
    data: { labels: pieLabels, datasets: [{ data: pieData, backgroundColor: pieColors, borderWidth: 0, hoverOffset: 12 }] },
    options: { responsive: true, plugins: { legend: { position:'bottom', labels: chartFont } } }
  });

  // ── Line Chart ──
  const lineCtx = document.getElementById('lineChart');
  if (lineInst) lineInst.destroy();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const lineSets = [];
  if (crop === 'all' || crop === 'maize')    lineSets.push({ label:'Maize',    data:[0,0,20,60,120,180,240,300,360,420,420,420], borderColor:'#2d7a4f', backgroundColor:'rgba(45,122,79,.07)', tension:.4, fill:true, pointRadius:4 });
  if (crop === 'all' || crop === 'beans')    lineSets.push({ label:'Beans',    data:[0,0,30,70,110,140,160,175,185,185,185,185], borderColor:'#d4a96a', backgroundColor:'rgba(212,169,106,.07)', tension:.4, fill:true, pointRadius:4 });
  if (crop === 'all' || crop === 'potatoes') lineSets.push({ label:'Potatoes', data:[0,20,50,100,170,220,270,300,310,310,310,310], borderColor:'#8b5e3c', backgroundColor:'rgba(139,94,60,.07)', tension:.4, fill:true, pointRadius:4 });
  lineInst = new Chart(lineCtx, {
    type: 'line',
    data: { labels: months, datasets: lineSets },
    options: {
      responsive: true,
      plugins: { legend: { labels: chartFont } },
      scales: { x: { grid: { display:false } }, y: { grid: { color:'#e8f5ed' } } }
    }
  });
}
