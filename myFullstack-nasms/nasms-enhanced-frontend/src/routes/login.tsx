import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Layout } from "@/components/Layout";
import { login, setToken, setUser, setRole, setEmail, getRole } from "@/services/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "NASMS – Sign In" }] }),
  component: LoginPage,
});

const ROLES = [
  { value: "FARMER",  label: "🌾 Farmer",    desc: "Access loans, inputs & market" },
  { value: "ADMIN",   label: "🛡️ Admin",      desc: "Full system control" },
  { value: "BUYER",   label: "🛒 Buyer",      desc: "Browse & buy produce" },
  { value: "SELLER",  label: "🏪 Seller",     desc: "List & sell products" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [email,    setEmailState]    = useState("");
  const [password, setPasswordState] = useState("");
  const [showPwd,  setShowPwd]       = useState(false);
  const [loading,  setLoading]       = useState(false);
  const [error,    setError]         = useState<string | null>(null);
  const [remember, setRemember]      = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) { setError("Please fill in both fields."); return; }
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (!res?.token) throw new Error("No token received.");

      // Decode role from JWT payload
      let role = res.role ?? "";
      if (!role) {
        try {
          const payload = JSON.parse(atob(res.token.split(".")[1]));
          role = payload.role ?? payload.authorities?.[0]?.authority ?? "FARMER";
        } catch { role = "FARMER"; }
      }

      setToken(res.token);
      setUser(res.username ?? email.trim());
      setRole(role);
      setEmail(email.trim());
      if (remember) localStorage.setItem("nasms_remembered_email", email.trim());

      const dest = role === "ADMIN" ? "/admin" : "/dashboard";
      void navigate({ to: dest as any });
    } catch (err: any) {
      setError(err.message?.includes("not found") || err.message?.includes("Invalid")
        ? "Invalid email or password. Please try again."
        : err.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout padded={false} hideFooter>
      <div className="auth-page">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-brand">
              <span className="auth-brand-icon">🌾</span>
              <div>
                <div className="auth-brand-name">NASMS</div>
                <div className="auth-brand-sub">National Agricultural Support & Monitoring System</div>
              </div>
            </div>
            <h1 className="auth-hero-title">Empowering Kenya's Farmers Through Digital Agriculture</h1>
            <p className="auth-hero-sub">
              Access government loans, certified farm inputs, market connections and real-time analytics — all in one platform.
            </p>
            <div className="auth-features">
              {["Government-backed loan programs","Real-time county weather forecasts","Connect with verified buyers & sellers","Production analytics & farm tracking"].map(f => (
                <div key={f} className="auth-feature"><span className="auth-feature-icon">✓</span>{f}</div>
              ))}
            </div>
            <div className="auth-stats">
              <div><strong>2.1M+</strong><span>Registered Farmers</span></div>
              <div><strong>47</strong><span>Counties Served</span></div>
              <div><strong>KES 8B</strong><span>Loans Disbursed</span></div>
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your NASMS account</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <div className="auth-input-wrap">
                  <i className="fa fa-envelope auth-input-icon" />
                  <input
                    id="email" type="email" placeholder="your@email.com"
                    value={email} onChange={e => setEmailState(e.target.value)}
                    autoComplete="email" required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <i className="fa fa-lock auth-input-icon" />
                  <input
                    id="password" type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password} onChange={e => setPasswordState(e.target.value)}
                    autoComplete="current-password" required
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(s => !s)} aria-label="Toggle password visibility">
                    <i className={showPwd ? "fa fa-eye-slash" : "fa fa-eye"} />
                  </button>
                </div>
              </div>

              {error && <div className="auth-error"><i className="fa fa-exclamation-circle" /> {error}</div>}

              <div className="auth-row">
                <label className="auth-check-label">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <a href="#" className="auth-forgot">Forgot password?</a>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <><i className="fa fa-spinner fa-spin" /> Signing in…</> : <><i className="fa fa-sign-in-alt" /> Sign In</>}
              </button>
            </form>

            <div className="auth-roles-section">
              <div className="auth-divider"><span>Available roles</span></div>
              <div className="auth-roles-grid">
                {ROLES.map(r => (
                  <div key={r.value} className="auth-role-chip">
                    <span>{r.label}</span>
                    <small>{r.desc}</small>
                  </div>
                ))}
              </div>
            </div>

            <p className="auth-footer-link">
              New to NASMS? <Link to="/register">Register as a farmer</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height:100vh; display:flex;
          font-family:'DM Sans',sans-serif;
        }
        .auth-left {
          flex:1; background:linear-gradient(160deg,#1b5e20 0%,#2e7d32 40%,#388e3c 70%,#1a4d2e 100%);
          display:flex; align-items:center; justify-content:center;
          padding:3rem 2.5rem; position:relative; overflow:hidden;
        }
        .auth-left::before {
          content:''; position:absolute; inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .auth-left-content { position:relative; z-index:1; max-width:480px; }
        .auth-brand { display:flex; align-items:center; gap:1rem; margin-bottom:2.5rem; }
        .auth-brand-icon { font-size:2.5rem; }
        .auth-brand-name { font-size:1.5rem; font-weight:800; color:#fff; letter-spacing:-0.02em; }
        .auth-brand-sub { font-size:0.72rem; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:0.05em; margin-top:2px; }
        .auth-hero-title { font-family:'Playfair Display',serif; font-size:clamp(1.6rem,3vw,2.2rem); color:#fff; line-height:1.25; margin-bottom:1rem; }
        .auth-hero-sub { color:rgba(255,255,255,0.8); font-size:0.95rem; line-height:1.7; margin-bottom:2rem; }
        .auth-features { display:flex; flex-direction:column; gap:0.65rem; margin-bottom:2rem; }
        .auth-feature { display:flex; align-items:center; gap:0.75rem; color:rgba(255,255,255,0.9); font-size:0.875rem; }
        .auth-feature-icon { width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:0.65rem; flex-shrink:0; }
        .auth-stats { display:flex; gap:2rem; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.15); }
        .auth-stats > div { display:flex; flex-direction:column; gap:2px; }
        .auth-stats strong { font-size:1.4rem; font-weight:800; color:#fff; }
        .auth-stats span { font-size:0.7rem; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:0.05em; }

        .auth-right {
          width:480px; flex-shrink:0; display:flex; align-items:center;
          justify-content:center; padding:2rem; background:#f8faf8;
        }
        .auth-card { width:100%; max-width:420px; }
        .auth-card-header { margin-bottom:1.75rem; }
        .auth-card-header h2 { font-size:1.6rem; font-weight:800; color:#111827; margin-bottom:0.25rem; }
        .auth-card-header p { color:#6b7280; font-size:0.875rem; }

        .auth-field { display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1rem; }
        .auth-field label { font-size:0.8rem; font-weight:600; color:#374151; }
        .auth-input-wrap { position:relative; display:flex; align-items:center; }
        .auth-input-icon { position:absolute; left:0.875rem; color:#9ca3af; font-size:0.875rem; pointer-events:none; z-index:1; }
        .auth-input-wrap input {
          width:100%; height:46px; padding:0 3rem 0 2.5rem;
          border:1.5px solid #d1d5db; border-radius:10px;
          font-size:0.9rem; color:#111827; background:#fff; outline:none;
          transition:border-color 0.15s,box-shadow 0.15s; box-sizing:border-box;
        }
        .auth-input-wrap input:focus { border-color:#2e7d32; box-shadow:0 0 0 3px rgba(46,125,50,0.12); }
        .auth-eye-btn { position:absolute; right:0.875rem; background:none; border:none; cursor:pointer; color:#6b7280; padding:0; display:flex; align-items:center; font-size:0.9rem; }
        .auth-eye-btn:hover { color:#374151; }

        .auth-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; border-radius:8px; padding:0.65rem 0.875rem; font-size:0.82rem; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem; }

        .auth-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
        .auth-check-label { display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; color:#374151; cursor:pointer; }
        .auth-check-label input { accent-color:#2e7d32; }
        .auth-forgot { font-size:0.8rem; color:#2e7d32; font-weight:500; }
        .auth-forgot:hover { text-decoration:underline; }

        .auth-submit {
          width:100%; height:48px; background:#2e7d32; color:#fff;
          border:none; border-radius:10px; font-size:0.95rem; font-weight:600;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          gap:0.5rem; transition:background 0.15s,transform 0.1s;
          font-family:'DM Sans',sans-serif;
        }
        .auth-submit:hover:not(:disabled) { background:#1b5e20; transform:translateY(-1px); }
        .auth-submit:disabled { opacity:0.65; cursor:not-allowed; transform:none; }

        .auth-roles-section { margin-top:1.5rem; }
        .auth-divider { display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; color:#9ca3af; font-size:0.75rem; }
        .auth-divider::before,.auth-divider::after { content:""; flex:1; height:1px; background:#e5e7eb; }
        .auth-roles-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
        .auth-role-chip {
          border:1.5px solid #e5e7eb; border-radius:8px; padding:0.6rem 0.75rem;
          background:#fff; display:flex; flex-direction:column; gap:2px;
        }
        .auth-role-chip span { font-size:0.82rem; font-weight:600; color:#374151; }
        .auth-role-chip small { font-size:0.68rem; color:#9ca3af; }

        .auth-footer-link { text-align:center; margin-top:1.25rem; font-size:0.82rem; color:#6b7280; }
        .auth-footer-link a { color:#2e7d32; font-weight:600; }
        .auth-footer-link a:hover { text-decoration:underline; }

        @media(max-width:900px) {
          .auth-left { display:none; }
          .auth-right { width:100%; }
        }
        @media(max-width:480px) {
          .auth-right { padding:1.5rem 1rem; }
        }
      `}</style>
    </Layout>
  );
}
