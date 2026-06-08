const BUYERS = [
  { name:'Naivas Supermarket Ltd.', location:'Nairobi, Kiambu', crops:['Tomatoes','Kales','Potatoes'], price:'KES 65/kg (tomatoes)', color:'linear-gradient(135deg,#2d7a4f,#4caf72)', icon:'🏪' },
  { name:'Unga Group PLC', location:'Nairobi (Countrywide)', crops:['Maize','Wheat','Sorghum'], price:'KES 3,800/bag (maize)', color:'linear-gradient(135deg,#8b5e3c,#d4a96a)', icon:'🌽' },
  { name:'New KCC Dairy', location:'Nakuru, Nyeri, Meru', crops:['Raw Milk','Butter'], price:'KES 45/litre (raw milk)', color:'linear-gradient(135deg,#1a3a5c,#4a90d9)', icon:'🥛' },
  { name:'Carrefour Kenya', location:'Nairobi, Mombasa', crops:['Kales','Spinach','Capsicum','Onions'], price:'KES 55/kg (capsicum)', color:'linear-gradient(135deg,#4a7a1e,#7aba3a)', icon:'🥬' },
  { name:'Bidco Africa', location:'Thika, Nairobi', crops:['Sunflower','Soybeans'], price:'KES 80/kg (sunflower)', color:'linear-gradient(135deg,#b58900,#e0b840)', icon:'🌻' },
];
const SELLERS = [
  { name:'Peter Njoroge Farm', location:'Nyeri County', crops:['Tea','Potatoes','Pyrethrum'], price:'KES 1,800/bag (potatoes)', color:'linear-gradient(135deg,#2d7a4f,#4caf72)', icon:'👨‍🌾' },
  { name:'Amina Odhiambo Holdings', location:'Kisumu County', crops:['Rice','Fish','Groundnuts'], price:'KES 120/kg bulk (rice)', color:'linear-gradient(135deg,#5c3d1e,#d4a96a)', icon:'👩‍🌾' },
  { name:'Green Acres Farm', location:"Murang'a County", crops:['Avocado','Passion Fruit','Macadamia'], price:'KES 18/piece export (avocado)', color:'linear-gradient(135deg,#1a4d2e,#4caf72)', icon:'🥑' },
  { name:'Rift Valley Growers', location:'Nakuru County', crops:['Wheat','Barley','Potatoes'], price:'KES 3,200/bag (wheat)', color:'linear-gradient(135deg,#8b5e3c,#c49a5a)', icon:'🌾' },
];

let contactTarget = '';

document.addEventListener('DOMContentLoaded', () => {
  renderNav('market');
  renderFooter();
  renderCards('buyers', BUYERS);
  renderCards('sellers', SELLERS);

  document.getElementById('contactModal').addEventListener('click', function(e) {
    if (e.target === this) closeContactModal();
  });
});

function renderCards(tab, data) {
  const container = document.getElementById('tab-' + tab);
  container.innerHTML = data.map(d => `
    <div class="market-card">
      <div class="market-avatar" style="background:${d.color};">${d.icon}</div>
      <h3>${d.name}</h3>
      <div class="location"><i class="fa fa-map-pin"></i> ${d.location}</div>
      <div class="crops">${d.crops.map(c => `<span class="crop-tag">${c}</span>`).join('')}</div>
      <p class="price">${tab === 'buyers' ? 'Buying' : 'Selling'} at <strong>${d.price}</strong></p>
      <button class="contact-btn" onclick="openContactModal('${d.name}')">
        ${tab === 'buyers' ? 'Send Inquiry' : 'Contact Farmer'}
      </button>
    </div>
  `).join('');
}

function switchTab(tab) {
  document.querySelectorAll('.market-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('tab-buyers').style.display  = tab === 'buyers'  ? 'grid' : 'none';
  document.getElementById('tab-sellers').style.display = tab === 'sellers' ? 'grid' : 'none';
}

function openContactModal(name) {
  contactTarget = name;
  document.getElementById('contactTitle').textContent = 'Contact: ' + name;
  document.getElementById('contactModal').classList.add('open');
}
function closeContactModal() {
  document.getElementById('contactModal').classList.remove('open');
}
function submitContact() {
  const msg   = document.getElementById('contactMsg').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  if (!msg || !phone) { alert('Please fill in all fields.'); return; }
  closeContactModal();
  alert(`✅ Inquiry sent to "${contactTarget}". They will contact you on ${phone} within 24 hours.`);
}
