const WEATHER = {
  muranga:  { loc:"Murang'a County", temp:'24°C', desc:'Partly Cloudy with Morning Showers',  humidity:'72%', wind:'12 km/h', rain:'60%', uv:'4', icon:'⛅', gradient:'135deg,#1a3a5c,#2d6a9a,#4a9a7a', advisory:'⚠️ <strong>High rainfall expected Fri–Sat.</strong> Avoid applying fertilizer before rains. Excellent planting window on Sunday–Monday as soil moisture will be optimal.' },
  nakuru:   { loc:'Nakuru County',   temp:'22°C', desc:'Clear with Light Breeze',              humidity:'58%', wind:'18 km/h', rain:'20%', uv:'6', icon:'🌤', gradient:'135deg,#2d5a1a,#4a9a3a,#7aba60', advisory:'✅ <strong>Good conditions for land preparation.</strong> Low rainfall forecast. Ideal week for herbicide application and open-field spraying.' },
  meru:     { loc:'Meru County',     temp:'26°C', desc:'Sunny and Warm',                      humidity:'64%', wind:'8 km/h',  rain:'15%', uv:'7', icon:'☀️', gradient:'135deg,#5c3a00,#b87a20,#e0b060', advisory:'☀️ <strong>Dry week ahead.</strong> Ensure irrigation is operational. Mulch to conserve moisture. Good for top-dressing nitrogen fertilizer.' },
  kisumu:   { loc:'Kisumu County',   temp:'29°C', desc:'Hot and Humid, Afternoon Showers',    humidity:'80%', wind:'10 km/h', rain:'75%', uv:'5', icon:'⛈',  gradient:'135deg,#0d3a5c,#1a5a8a,#2a7aaa', advisory:'⛈ <strong>Heavy afternoon showers daily.</strong> Harvest mature crops immediately. Avoid open field spraying. Monitor for fungal diseases.' },
  nairobi:  { loc:'Nairobi County',  temp:'20°C', desc:'Cool and Overcast',                   humidity:'70%', wind:'15 km/h', rain:'45%', uv:'3', icon:'🌥', gradient:'135deg,#2a3a4a,#4a6a8a,#6a9aaa', advisory:'🌥 <strong>Moderate conditions.</strong> Good for greenhouse vegetables. Monitor for fungal diseases due to elevated humidity.' },
  nyeri:    { loc:'Nyeri County',    temp:'21°C', desc:'Misty Morning, Clear Afternoon',      humidity:'68%', wind:'9 km/h',  rain:'35%', uv:'4', icon:'🌫', gradient:'135deg,#2a4a3a,#3a7a5a,#5a9a7a', advisory:'🌫 <strong>Misty mornings expected.</strong> Delay pesticide applications to midday. Good moisture conditions for transplanting seedlings.' },
  machakos: { loc:'Machakos County', temp:'27°C', desc:'Hot and Dry with Dust Haze',          humidity:'42%', wind:'22 km/h', rain:'8%',  uv:'8', icon:'🌵', gradient:'135deg,#6a3a0a,#aa6a2a,#ca9a5a', advisory:'🌵 <strong>Dry and hot conditions.</strong> Critical irrigation week. Cover bare soil to prevent moisture loss. Consider shade nets for vegetables.' },
};

const FORECASTS = {
  muranga:  [{d:'TODAY',i:'⛅',h:24,l:18},{d:'FRI',i:'🌧',h:21,l:16},{d:'SAT',i:'⛈',h:19,l:14},{d:'SUN',i:'🌤',h:23,l:17},{d:'MON',i:'☀️',h:26,l:18},{d:'TUE',i:'🌤',h:25,l:19},{d:'WED',i:'⛅',h:24,l:17}],
  nakuru:   [{d:'TODAY',i:'🌤',h:22,l:14},{d:'FRI',i:'☀️',h:24,l:15},{d:'SAT',i:'☀️',h:25,l:14},{d:'SUN',i:'🌤',h:23,l:13},{d:'MON',i:'⛅',h:21,l:14},{d:'TUE',i:'🌦',h:20,l:13},{d:'WED',i:'🌤',h:22,l:14}],
  meru:     [{d:'TODAY',i:'☀️',h:26,l:16},{d:'FRI',i:'☀️',h:27,l:17},{d:'SAT',i:'🌤',h:25,l:16},{d:'SUN',i:'⛅',h:24,l:15},{d:'MON',i:'☀️',h:26,l:16},{d:'TUE',i:'☀️',h:27,l:17},{d:'WED',i:'🌤',h:25,l:16}],
  kisumu:   [{d:'TODAY',i:'⛈',h:29,l:21},{d:'FRI',i:'⛈',h:28,l:22},{d:'SAT',i:'🌧',h:27,l:21},{d:'SUN',i:'⛅',h:29,l:20},{d:'MON',i:'⛈',h:30,l:22},{d:'TUE',i:'🌦',h:28,l:21},{d:'WED',i:'⛈',h:27,l:22}],
  nairobi:  [{d:'TODAY',i:'🌥',h:20,l:14},{d:'FRI',i:'🌦',h:19,l:13},{d:'SAT',i:'⛅',h:21,l:14},{d:'SUN',i:'🌤',h:22,l:14},{d:'MON',i:'⛅',h:20,l:13},{d:'TUE',i:'🌧',h:18,l:12},{d:'WED',i:'🌤',h:21,l:14}],
  nyeri:    [{d:'TODAY',i:'🌫',h:21,l:13},{d:'FRI',i:'🌤',h:22,l:14},{d:'SAT',i:'⛅',h:21,l:13},{d:'SUN',i:'🌤',h:23,l:14},{d:'MON',i:'⛅',h:20,l:13},{d:'TUE',i:'🌦',h:19,l:12},{d:'WED',i:'🌤',h:22,l:14}],
  machakos: [{d:'TODAY',i:'🌵',h:27,l:18},{d:'FRI',i:'☀️',h:28,l:19},{d:'SAT',i:'☀️',h:29,l:18},{d:'SUN',i:'🌤',h:27,l:18},{d:'MON',i:'☀️',h:28,l:19},{d:'TUE',i:'☀️',h:30,l:20},{d:'WED',i:'🌤',h:27,l:18}],
};

document.addEventListener('DOMContentLoaded', () => {
  renderNav('weather');
  renderFooter();
  updateWeather('muranga');
});

function updateWeather(region) {
  const d = WEATHER[region];
  if (!d) return;

  document.getElementById('wBgIcon').textContent    = d.icon;
  document.getElementById('wLocation').textContent  = '📍 ' + d.loc + ', Kenya';
  document.getElementById('wTemp').textContent      = d.temp;
  document.getElementById('wDesc').textContent      = d.desc;
  document.getElementById('wHumidity').textContent  = '💧 Humidity: ' + d.humidity;
  document.getElementById('wWind').textContent      = '💨 Wind: ' + d.wind;
  document.getElementById('wRain').textContent      = '🌧 Rain: ' + d.rain;
  document.getElementById('wUV').textContent        = '☀️ UV Index: ' + d.uv;
  document.getElementById('wAdvisory').innerHTML    = d.advisory;
  document.getElementById('weatherHero').style.background = `linear-gradient(${d.gradient})`;

  renderForecast(region);
}

function renderForecast(region) {
  const days = FORECASTS[region] || FORECASTS['muranga'];
  document.getElementById('forecastGrid').innerHTML = days.map(day => `
    <div class="forecast-card">
      <div class="forecast-day">${day.d}</div>
      <div class="forecast-icon">${day.i}</div>
      <div class="forecast-temp">${day.h}°C</div>
      <div class="forecast-low">${day.l}°C low</div>
    </div>
  `).join('');
}
