const BOT_RESPONSES = [
  {
    keywords: ['register','registration','sign up','new farmer'],
    reply: `To register as a farmer, click <strong>Register</strong> in the top navigation. You'll need your National ID, phone number, title deed number, and farm details. Registration is free and takes under 5 minutes. <a href="../register/index.html">Register now →</a>`
  },
  {
    keywords: ['loan','loans','credit','finance','money','borrow'],
    reply: `We offer four government loan programs: Crop Production Loan (4% p.a.), Livestock Development Fund (6% p.a.), Agri-Tech Irrigation Loan (5% p.a.), and the Youth Agripreneur Fund (2% p.a. for ages 18–35). Visit the <a href="../loans/index.html">Loans page</a> to apply.`
  },
  {
    keywords: ['input','inputs','seed','fertilizer','pesticide','equipment','product'],
    reply: `Government-subsidised farm inputs including seeds, fertilizers, pesticides, and equipment are available through the <a href="../products/index.html">Farm Inputs page</a>. You can filter by category and submit a request for delivery to your sub-location.`
  },
  {
    keywords: ['weather','forecast','rain','temperature','climate','sun'],
    reply: `Our <a href="../weather/index.html">Weather Predictions page</a> provides current conditions and 7-day forecasts for all 47 counties, along with farming advisories tailored to your region. Select your county to get started.`
  },
  {
    keywords: ['buyer','seller','market','sell','produce','price'],
    reply: `The <a href="../market/index.html">Buyers & Sellers Marketplace</a> connects you with verified buyers and fellow farmers. You can view current buying prices, send inquiries, and negotiate directly with buyers in your county.`
  },
  {
    keywords: ['analytics','production','history','chart','data','yield'],
    reply: `View your farm's production history, revenue trends, and yield comparisons on the <a href="../analytics/index.html">Production Analytics page</a>. You can filter by crop type and year range.`
  },
  {
    keywords: ['repay','repayment','due','balance','owe'],
    reply: `Your loan repayment schedule is available on the <a href="../loans/index.html">Loans page</a> under "My Applications". For payment arrangements, call our toll-free line: <strong>0800 720 093</strong>.`
  },
  {
    keywords: ['hello','hi','hey','good morning','good afternoon','greetings'],
    reply: `Hello! 👋 Welcome to NASMS Support. I'm here to help you with farmer registration, loans, farm inputs, weather, market access, and more. What can I assist you with today?`
  },
  {
    keywords: ['thank','thanks','asante','appreciate'],
    reply: `You're welcome! 🌿 Is there anything else I can help you with? For urgent matters, please call our toll-free line: <strong>0800 720 093</strong>.`
  },
  {
    keywords: ['contact','phone','call','email','office','location'],
    reply: `You can reach us at:<br>📞 Toll-Free: <strong>0800 720 093</strong><br>✉️ info@nasms.go.ke<br>📍 Kilimo House, Cathedral Rd, Nairobi<br>🕗 Monday–Friday: 8:00 AM – 5:00 PM`
  },
  {
    keywords: ['dashboard','account','profile','my account'],
    reply: `Your <a href="../dashboard/index.html">Farmer Dashboard</a> gives you an overview of your loan status, farm inputs, weather, and notifications all in one place. Make sure you're logged in to access it.`
  },
];

const DEFAULT_REPLY = `Thank you for your message. I'd be happy to help! Could you please be more specific about what you need? You can also call our toll-free helpdesk at <strong>0800 720 093</strong> (Mon–Fri, 8AM–5PM) for direct assistance.`;

document.addEventListener('DOMContentLoaded', () => {
  renderNav('');
  renderFooter();

  const input = document.getElementById('chatInput');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
});

function quickMsg(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;

  appendMessage('user', text);
  input.value = '';
  showTyping();

  setTimeout(() => {
    hideTyping();
    const reply = getBotReply(text);
    appendMessage('bot', reply);
  }, 900 + Math.random() * 600);
}

function appendMessage(role, html) {
  const area   = document.getElementById('messagesArea');
  const isBot  = role === 'bot';
  const row    = document.createElement('div');
  row.className = `msg-row ${role}`;
  row.innerHTML = `
    <div class="msg-avatar">${isBot ? '🤖' : '👨‍🌾'}</div>
    <div class="msg-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}">${html}</div>
  `;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  document.getElementById('typingIndicator').style.display = 'flex';
  document.getElementById('messagesArea').scrollTop = 99999;
}
function hideTyping() {
  document.getElementById('typingIndicator').style.display = 'none';
}

function getBotReply(text) {
  const lower = text.toLowerCase();
  for (const item of BOT_RESPONSES) {
    if (item.keywords.some(kw => lower.includes(kw))) return item.reply;
  }
  return DEFAULT_REPLY;
}
