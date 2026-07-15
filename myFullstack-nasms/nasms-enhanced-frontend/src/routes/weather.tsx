import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { getWeather, type WeatherData } from "@/services/api";

export const Route = createFileRoute("/weather")({
  head: () => ({ meta: [{ title: "NASMS – Weather" }] }),
  component: WeatherPage,
});

const KENYA_COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika",
  "Machakos","Kitale","Malindi","Garissa","Kisii","Kakamega","Bungoma",
  "Kericho","Bomet","Narok","Kajiado","Murang'a","Kiambu","Nanyuki",
  "Embu","Isiolo","Marsabit","Wajir","Mandera","Lamu","Kilifi","Kwale",
  "Taita","Makueni","Nzoia","Siaya","Homa Bay","Migori","Nyamira",
  "Kisumu","Vihiga","Trans Nzoia","West Pokot","Samburu","Baringo","Laikipia",
  "Nyandarua","Tharaka","Kirinyaga","Uasin Gishu","Elgeyo","Turkana",
];

const WEATHER_ICONS: Record<string,string> = {
  "Clear":"☀️","Clouds":"⛅","Rain":"🌧️","Drizzle":"🌦️",
  "Thunderstorm":"⛈️","Snow":"❄️","Mist":"🌫️","Fog":"🌫️",
  "Haze":"🌫️","Dust":"💨","Smoke":"💨",
};

function weatherIcon(main: string) {
  return WEATHER_ICONS[main] ?? "🌤️";
}

function WeatherPage() {
  const [selected, setSelected] = useState("Nairobi");
  const [input,    setInput]    = useState("Nairobi");
  const [city,     setCity]     = useState("Nairobi");
  const [multiList, setMultiList] = useState<string[]>([]);
  const [mode, setMode] = useState<"single"|"multi">("single");

  const singleQ = useQuery({
    queryKey: ["weather", city],
    queryFn:  () => getWeather(city),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    enabled: mode === "single",
  });

  // Multi-county queries (run all in parallel via individual useQuery would be best
  // but we batch them via a single derived array for simplicity)
  const multiCounties = multiList.length > 0 ? multiList : [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) { setCity(input.trim()); setMode("single"); }
  }

  function handleCountySelect(county: string) {
    setSelected(county); setCity(county); setInput(county); setMode("single");
  }

  function handleMulti() {
    const top10 = KENYA_COUNTIES.slice(0,10);
    setMultiList(top10); setMode("multi");
  }

  const w = singleQ.data;
  const sunrise = w?.sys?.sunrise ? new Date(w.sys.sunrise*1000).toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit"}) : "—";
  const sunset  = w?.sys?.sunset  ? new Date(w.sys.sunset*1000).toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit"}) : "—";

  return (
    <Layout>
      <main className="section">
        <div className="section-inner">
          <div className="section-label">Kenya Meteorological Department</div>
          <h2 className="section-title animate">County Weather Intelligence</h2>
          <p className="section-sub animate">Real-time weather data for all 47 Kenyan counties, powered by OpenWeatherMap.</p>

          {/* Controls */}
          <div className="wx-controls animate">
            <form onSubmit={handleSearch} className="wx-search-form">
              <input
                className="wx-search-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Search any Kenyan county or city…"
              />
              <button type="submit" className="wx-search-btn"><i className="fa fa-search" /> Search</button>
            </form>
            <button className="wx-multi-btn" onClick={handleMulti}>🗺️ Show 10 Major Counties</button>
          </div>

          {/* County chips */}
          <div className="wx-county-chips animate">
            {KENYA_COUNTIES.slice(0,24).map(c => (
              <button key={c} className={`wx-county-chip${c===selected?" active":""}`} onClick={() => handleCountySelect(c)}>{c}</button>
            ))}
          </div>

          {/* Single weather card */}
          {mode === "single" && (
            <div className="animate">
              {singleQ.isLoading && (
                <div className="wx-skeleton">
                  <div className="wx-skel-hero" /><div className="wx-skel-row"><div/><div/><div/><div/></div>
                </div>
              )}
              {singleQ.isError && (
                <div className="wx-error">
                  <span>⚠️</span>
                  <div>
                    <strong>Could not load weather for "{city}"</strong>
                    <p>The city may not be found. Try a different spelling or select a county above.</p>
                  </div>
                  <button onClick={() => singleQ.refetch()} className="wx-retry-btn">Retry</button>
                </div>
              )}
              {w && (
                <div className="wx-hero-card">
                  <div className="wx-hero-left">
                    <div className="wx-hero-location">📍 {w.name}, Kenya</div>
                    <div className="wx-hero-temp">{Math.round(w.main.temp)}°C</div>
                    <div className="wx-hero-desc">{weatherIcon(w.weather[0]?.main)} {w.weather[0]?.description?.charAt(0).toUpperCase() + w.weather[0]?.description?.slice(1)}</div>
                    <div className="wx-hero-feels">Feels like {Math.round(w.main.feels_like)}°C</div>
                  </div>
                  <div className="wx-hero-right">
                    <div className="wx-stat-grid">
                      {[
                        { icon:"💧", label:"Humidity",   value:`${w.main.humidity}%` },
                        { icon:"💨", label:"Wind Speed",  value:`${w.wind.speed} m/s` },
                        { icon:"🌡️", label:"Pressure",   value:`${w.main.pressure} hPa` },
                        { icon:"☁️", label:"Cloud Cover", value:`${w.clouds?.all ?? "—"}%` },
                        { icon:"👁️", label:"Visibility", value:`${w.visibility ? (w.visibility/1000).toFixed(1)+"km" : "—"}` },
                        { icon:"🌧️", label:"Rain (1h)",  value:`${w.rain?.["1h"] ?? "0"} mm` },
                        { icon:"🌅", label:"Sunrise",    value: sunrise },
                        { icon:"🌇", label:"Sunset",     value: sunset },
                      ].map(s => (
                        <div key={s.label} className="wx-stat-item">
                          <span className="wx-stat-icon">{s.icon}</span>
                          <div>
                            <div className="wx-stat-label">{s.label}</div>
                            <div className="wx-stat-val">{s.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Farming advisory */}
              {w && (
                <div className="wx-advisory">
                  <h3>🌾 Farming Advisory for {w.name}</h3>
                  <div className="wx-advisory-body">
                    {w.weather[0]?.main === "Rain" || w.weather[0]?.main === "Drizzle"
                      ? <p>🌧️ <strong>Rain expected.</strong> Hold off on harvesting today. Good conditions for planting — ensure drainage is clear to prevent waterlogging. Consider applying pre-emergent herbicides before heavy downpours.</p>
                      : w.weather[0]?.main === "Clear" && w.main.temp > 28
                      ? <p>☀️ <strong>Hot and sunny.</strong> Irrigate crops early morning or evening to minimise evaporation. Provide shade for young seedlings. Monitor livestock water intake carefully.</p>
                      : w.weather[0]?.main === "Thunderstorm"
                      ? <p>⛈️ <strong>Thunderstorm alert.</strong> Avoid field work. Secure equipment and greenhouses. Check for crop damage after the storm passes.</p>
                      : <p>🌤️ <strong>Favourable conditions.</strong> Good day for field activities, spraying, and harvesting. Temperature is optimal for most Kenyan crops. Monitor soil moisture levels.</p>
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multi-county grid */}
          {mode === "multi" && (
            <MultiCountyGrid counties={multiCounties} />
          )}
        </div>
      </main>

      <style>{`
        .wx-controls{display:flex;gap:1rem;margin-bottom:1.25rem;flex-wrap:wrap;}
        .wx-search-form{display:flex;gap:0;flex:1;min-width:280px;}
        .wx-search-input{flex:1;height:42px;padding:0 1rem;border:1.5px solid #d1d5db;border-radius:8px 0 0 8px;font-size:0.875rem;outline:none;transition:border-color 0.15s;}
        .wx-search-input:focus{border-color:#2e7d32;}
        .wx-search-btn{height:42px;padding:0 1.25rem;background:#2e7d32;color:#fff;border:none;border-radius:0 8px 8px 0;font-weight:600;font-size:0.875rem;cursor:pointer;transition:background 0.15s;}
        .wx-search-btn:hover{background:#1b5e20;}
        .wx-multi-btn{height:42px;padding:0 1.25rem;border:1.5px solid #d1d5db;border-radius:8px;background:#fff;font-size:0.875rem;font-weight:500;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
        .wx-multi-btn:hover{border-color:#2e7d32;color:#2e7d32;}
        .wx-county-chips{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.5rem;}
        .wx-county-chip{padding:5px 12px;border-radius:20px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:500;color:#374151;cursor:pointer;transition:all 0.15s;}
        .wx-county-chip:hover{border-color:#2e7d32;color:#2e7d32;}
        .wx-county-chip.active{background:#2e7d32;color:#fff;border-color:#2e7d32;}
        .wx-hero-card{background:linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#388e3c 100%);border-radius:20px;padding:2rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:1.5rem;color:#fff;}
        @media(max-width:700px){.wx-hero-card{grid-template-columns:1fr;}}
        .wx-hero-location{font-size:0.85rem;opacity:0.8;margin-bottom:0.5rem;}
        .wx-hero-temp{font-size:4rem;font-weight:800;line-height:1;margin-bottom:0.25rem;}
        .wx-hero-desc{font-size:1.1rem;font-weight:600;margin-bottom:0.25rem;}
        .wx-hero-feels{font-size:0.85rem;opacity:0.75;}
        .wx-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;}
        .wx-stat-item{display:flex;align-items:center;gap:0.6rem;background:rgba(255,255,255,0.1);border-radius:10px;padding:0.6rem;}
        .wx-stat-icon{font-size:1.1rem;flex-shrink:0;}
        .wx-stat-label{font-size:0.65rem;opacity:0.7;text-transform:uppercase;letter-spacing:0.05em;}
        .wx-stat-val{font-size:0.9rem;font-weight:700;}
        .wx-advisory{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.5rem;margin-bottom:1.5rem;}
        .wx-advisory h3{font-size:0.9rem;font-weight:700;color:#111827;margin-bottom:0.75rem;}
        .wx-advisory-body{background:#f0fdf4;border-radius:8px;padding:1rem;font-size:0.875rem;color:#374151;line-height:1.6;}
        .wx-error{background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:1.25rem;display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.5rem;}
        .wx-error span{font-size:1.5rem;flex-shrink:0;}
        .wx-error strong{display:block;color:#dc2626;font-size:0.9rem;margin-bottom:0.25rem;}
        .wx-error p{color:#6b7280;font-size:0.82rem;}
        .wx-retry-btn{margin-left:auto;padding:6px 14px;border-radius:8px;border:1.5px solid #fecaca;background:#fff;color:#dc2626;font-weight:600;font-size:0.78rem;cursor:pointer;flex-shrink:0;}
        .wx-skeleton{border-radius:20px;overflow:hidden;margin-bottom:1.5rem;}
        .wx-skel-hero{height:200px;background:linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
        .wx-skel-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-top:0.5rem;}
        .wx-skel-row div{height:60px;border-radius:8px;background:linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
        @keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}
        .wx-multi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin-bottom:1.5rem;}
        .wx-mini-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;transition:box-shadow 0.15s;}
        .wx-mini-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08);}
        .wx-mini-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;}
        .wx-mini-city{font-size:0.875rem;font-weight:700;color:#111827;}
        .wx-mini-icon{font-size:1.5rem;}
        .wx-mini-temp{font-size:2rem;font-weight:800;color:#1b5e20;margin-bottom:0.25rem;}
        .wx-mini-desc{font-size:0.78rem;color:#6b7280;margin-bottom:0.75rem;}
        .wx-mini-stats{display:flex;gap:0.75rem;font-size:0.75rem;color:#9ca3af;}
      `}</style>
    </Layout>
  );
}

function MultiCountyGrid({ counties }: { counties: string[] }) {
  return (
    <div className="wx-multi-grid animate">
      {counties.map(c => <CountyMiniCard key={c} city={c} />)}
    </div>
  );
}

function CountyMiniCard({ city }: { city: string }) {
  const q = useQuery({
    queryKey: ["weather", city],
    queryFn:  () => getWeather(city),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
  if (q.isLoading) return <div className="wx-mini-card"><div style={{height:100,background:"#f3f4f6",borderRadius:8,animation:"shimmer 1.4s infinite"}} /></div>;
  if (q.isError || !q.data)   return <div className="wx-mini-card"><div style={{color:"#9ca3af",fontSize:"0.8rem",padding:"1rem"}}>⚠️ {city} — unavailable</div></div>;
  const w = q.data;
  return (
    <div className="wx-mini-card">
      <div className="wx-mini-top">
        <div className="wx-mini-city">{w.name}</div>
        <div className="wx-mini-icon">{weatherIcon(w.weather[0]?.main)}</div>
      </div>
      <div className="wx-mini-temp">{Math.round(w.main.temp)}°C</div>
      <div className="wx-mini-desc">{w.weather[0]?.description}</div>
      <div className="wx-mini-stats">
        <span>💧{w.main.humidity}%</span>
        <span>💨{w.wind.speed}m/s</span>
        <span>☁️{w.clouds?.all ?? 0}%</span>
      </div>
    </div>
  );
}
