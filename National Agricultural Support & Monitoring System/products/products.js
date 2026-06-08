const PRODUCTS = [
  { id:1, icon:'🌽', name:'Certified Maize Seed (DH04)', category:'seed', cat:'Seeds', desc:'High-yield drought-tolerant variety. 10 kg bag, treated for storage pests.', avail:'in' },
  { id:2, icon:'🧴', name:'DAP Fertilizer 50 kg', category:'fertilizer', cat:'Fertilizer', desc:'Di-Ammonium Phosphate. Government-subsidised at 40% off market price.', avail:'in' },
  { id:3, icon:'🪲', name:'Actellic Super Insecticide 500ml', category:'pesticide', cat:'Pesticide', desc:'Broad-spectrum insecticide for stored grain and standing crops.', avail:'limited' },
  { id:4, icon:'🌿', name:'Certified Bean Seeds (KK8)', category:'seed', cat:'Seeds', desc:'Early maturing variety with resistance to bean stem maggot. 2 kg packet.', avail:'in' },
  { id:5, icon:'⚗️', name:'CAN Fertilizer 50 kg', category:'fertilizer', cat:'Fertilizer', desc:'Calcium Ammonium Nitrate for top-dressing. Suitable for all crop types.', avail:'in' },
  { id:6, icon:'🚜', name:'Hand-Operated Maize Sheller', category:'equipment', cat:'Equipment', desc:'Durable cast-iron sheller, processes up to 200 kg/hour.', avail:'out' },
  { id:7, icon:'🌾', name:'Wheat Seed BW1 (10 kg)', category:'seed', cat:'Seeds', desc:'Bread wheat variety adapted for medium-altitude areas.', avail:'in' },
  { id:8, icon:'🧪', name:'Mancozeb Fungicide 1 kg', category:'pesticide', cat:'Pesticide', desc:'Protective fungicide for late blight and downy mildew on vegetables.', avail:'in' },
  { id:9, icon:'🌱', name:'Hybrid Sorghum Seed 5 kg', category:'seed', cat:'Seeds', desc:'Drought-tolerant sorghum for ASAL regions. High yield potential.', avail:'in' },
  { id:10,icon:'💧', name:'Drip Irrigation Kit (0.5 ac)', category:'equipment', cat:'Equipment', desc:'Complete drip kit for half-acre greenhouse or open-field crops.', avail:'limited' },
];

let activeProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  renderNav('products');
  renderFooter();
  renderProducts(PRODUCTS);

  document.getElementById('reqModal').addEventListener('click', function(e) {
    if (e.target === this) closeReqModal();
  });
});

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  const none = document.getElementById('noResults');

  if (!list.length) {
    grid.innerHTML = '';
    none.style.display = 'block';
    return;
  }
  none.style.display = 'none';

  const availLabel = { in: ['avail-in','✔ In Stock'], limited: ['avail-limited','⚠ Limited Stock'], out: ['avail-out','✗ Out of Stock'] };
  const btnHtml = (p) => p.avail === 'out'
    ? `<button class="btn-sm" style="background:#ccc;cursor:not-allowed;" disabled>Notify Me</button>`
    : `<button class="btn-sm" onclick="openReqModal(${p.id})">Request</button>`;

  grid.innerHTML = list.map(p => {
    const [cls, lbl] = availLabel[p.avail];
    return `
      <div class="product-card">
        <div class="product-img">${p.icon}</div>
        <div class="product-body">
          <div class="category">${p.cat}</div>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="product-footer">
            <span class="${cls}">${lbl}</span>
            ${btnHtml(p)}
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterProducts() {
  const cat    = document.getElementById('catFilter').value;
  const avail  = document.getElementById('availFilter').value;
  const search = document.getElementById('searchFilter').value.toLowerCase();

  const filtered = PRODUCTS.filter(p => {
    const matchCat   = !cat   || p.category === cat;
    const matchAvail = !avail || p.avail === avail;
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    return matchCat && matchAvail && matchSearch;
  });
  renderProducts(filtered);
}

function openReqModal(id) {
  activeProduct = PRODUCTS.find(p => p.id === id);
  document.getElementById('reqModalTitle').textContent = 'Request: ' + activeProduct.name;
  document.getElementById('reqModal').classList.add('open');
}
function closeReqModal() {
  document.getElementById('reqModal').classList.remove('open');
}
function submitRequest() {
  const qty = document.getElementById('reqQty').value;
  const loc = document.getElementById('reqLocation').value.trim();
  if (!qty || Number(qty) < 1) { alert('Please enter a valid quantity.'); return; }
  if (!loc) { alert('Please enter your delivery location.'); return; }
  closeReqModal();
  alert(`✅ Request for ${qty} unit(s) of "${activeProduct.name}" submitted for delivery to: ${loc}`);
}
