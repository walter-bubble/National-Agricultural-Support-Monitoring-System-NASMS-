import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  ANALYTICS_DATA, CROP_PRICES, CROP_COLORS, MONTHLY_2025,
  type Crop, type YearRange,
} from "@/data/analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "NASMS – Production Analytics" }] }),
  component: AnalyticsPage,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function AnalyticsPage() {
  const [crop, setCrop] = useState<Crop>("all");
  const [year, setYear] = useState<YearRange>("all");
  const d = ANALYTICS_DATA[year];

  const barData = useMemo(
    () =>
      d.labels.map((label, i) => ({
        year: label,
        ...(crop === "all" || crop === "maize" ? { Maize: d.maize[i] } : {}),
        ...(crop === "all" || crop === "beans" ? { Beans: d.beans[i] } : {}),
        ...(crop === "all" || crop === "potatoes" ? { Potatoes: d.potatoes[i] } : {}),
      })),
    [d, crop],
  );

  const pieData = useMemo(() => {
    const last = <T,>(arr: T[]) => arr[arr.length - 1];
    const rows: { name: string; value: number; color: string }[] = [];
    if (crop === "all" || crop === "maize") rows.push({ name: "Maize", value: last(d.maize) * CROP_PRICES.maize, color: CROP_COLORS.maize });
    if (crop === "all" || crop === "beans") rows.push({ name: "Beans", value: last(d.beans) * CROP_PRICES.beans, color: CROP_COLORS.beans });
    if (crop === "all" || crop === "potatoes") rows.push({ name: "Potatoes", value: last(d.potatoes) * CROP_PRICES.potatoes, color: CROP_COLORS.potatoes });
    return rows;
  }, [d, crop]);

  const lineData = useMemo(
    () =>
      MONTHS.map((m, i) => ({
        month: m,
        ...(crop === "all" || crop === "maize" ? { Maize: MONTHLY_2025.maize[i] } : {}),
        ...(crop === "all" || crop === "beans" ? { Beans: MONTHLY_2025.beans[i] } : {}),
        ...(crop === "all" || crop === "potatoes" ? { Potatoes: MONTHLY_2025.potatoes[i] } : {}),
      })),
    [crop],
  );

  return (
    <Layout>
      <main className="section">
        <div className="section-inner">
          <div className="section-label">Production Analytics</div>
          <h2 className="section-title animate">Farm Production History</h2>

          <div className="filter-row animate">
            <select
              className="filter-select" value={crop}
              onChange={(e) => setCrop(e.target.value as Crop)}
            >
              <option value="all">All Crops</option>
              <option value="maize">Maize</option>
              <option value="beans">Beans</option>
              <option value="potatoes">Potatoes</option>
            </select>
            <select
              className="filter-select" value={year}
              onChange={(e) => setYear(e.target.value as YearRange)}
            >
              <option value="all">2019–2025</option>
              <option value="recent">2022–2025</option>
            </select>
          </div>

          <div className="cards-grid animate animate-delay-1">
            <div className="dash-card">
              <div className="dash-card-icon green-bg">🌽</div>
              <h4>Maize 2025</h4>
              <div className="value">420 bags</div>
              <div className="sub" style={{ color: "#1a7a3c" }}>↑ 18% from 2024</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon" style={{ background: "#e8f5e8" }}>🥜</div>
              <h4>Beans 2025</h4>
              <div className="value">185 bags</div>
              <div className="sub" style={{ color: "#1a7a3c" }}>↑ 8% from 2024</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon earth-bg">🥔</div>
              <h4>Potatoes 2025</h4>
              <div className="value">310 bags</div>
              <div className="sub" style={{ color: "#9a2020" }}>↓ 5% from 2024</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon blue-bg">💵</div>
              <h4>Total Revenue</h4>
              <div className="value">KES 2.1M</div>
              <div className="sub" style={{ color: "#1a7a3c" }}>↑ 22% from 2024</div>
            </div>
          </div>

          <div className="analytics-grid animate animate-delay-2">
            <div className="chart-panel">
              <h3>Annual Production (bags)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <CartesianGrid stroke="#e8f5ed" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(crop === "all" || crop === "maize") && (
                    <Bar dataKey="Maize" fill={CROP_COLORS.maize} radius={[6, 6, 0, 0]} />
                  )}
                  {(crop === "all" || crop === "beans") && (
                    <Bar dataKey="Beans" fill={CROP_COLORS.beans} radius={[6, 6, 0, 0]} />
                  )}
                  {(crop === "all" || crop === "potatoes") && (
                    <Bar dataKey="Potatoes" fill={CROP_COLORS.potatoes} radius={[6, 6, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-panel">
              <h3>Revenue by Crop (KES)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-panel animate animate-delay-3" style={{ marginBottom: 24 }}>
            <h3>Monthly Production Trend (2025)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#e8f5ed" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(crop === "all" || crop === "maize") && (
                  <Line type="monotone" dataKey="Maize" stroke={CROP_COLORS.maize} strokeWidth={2} />
                )}
                {(crop === "all" || crop === "beans") && (
                  <Line type="monotone" dataKey="Beans" stroke={CROP_COLORS.beans} strokeWidth={2} />
                )}
                {(crop === "all" || crop === "potatoes") && (
                  <Line type="monotone" dataKey="Potatoes" stroke={CROP_COLORS.potatoes} strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </Layout>
  );
}
