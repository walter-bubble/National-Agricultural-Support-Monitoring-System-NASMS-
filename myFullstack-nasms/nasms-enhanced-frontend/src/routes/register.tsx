import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Layout } from "@/components/Layout";
import { register, registerUser } from "@/services/api";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "NASMS – Register" }] }),
  component: RegisterPage,
});

// ─── Constants ────────────────────────────────────────────────────────────────
const COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay",
  "Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii",
  "Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera",
  "Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi",
  "Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta",
  "Tana River","Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga",
  "Wajir","West Pokot",
];

const FARM_TYPES = [
  "Crop Farming","Livestock Farming","Mixed Farming","Poultry",
  "Horticulture","Aquaculture","Agroforestry",
];

const ROLES = [
  {
    value: "FARMER",
    icon: "🌾",
    label: "Farmer",
    desc: "Register your farm and access government loans, inputs & market services.",
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#bbf7d0",
  },
  {
    value: "BUYER",
    icon: "🛒",
    label: "Buyer",
    desc: "Browse and purchase fresh produce directly from verified Kenyan farmers.",
    color: "#2563eb",
    bg: "#dbeafe",
    border: "#bfdbfe",
  },
  {
    value: "SELLER",
    icon: "🏪",
    label: "Seller",
    desc: "List your agricultural products and connect with buyers across Kenya.",
    color: "#d97706",
    bg: "#fef3c7",
    border: "#fde68a",
  },
  {
    value: "ADMIN",
    icon: "🛡️",
    label: "Administrator",
    desc: "Manage the NASMS platform — farmers, loans, seasons and analytics.",
    color: "#7c3aed",
    bg: "#ede9fe",
    border: "#c4b5fd",
  },
] as const;

type RoleValue = "FARMER" | "BUYER" | "SELLER" | "ADMIN";

// ─── Password strength ────────────────────────────────────────────────────────
function pwStrength(p: string): "weak" | "fair" | "strong" {
  let s = 0;
  if (p.length >= 8)           s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s <= 1 ? "weak" : s === 2 ? "fair" : "strong";
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ role }: { role: RoleValue }) {
  const r = ROLES.find(r => r.value === role)!;
  return (
    <Layout padded={false} hideFooter>
      <div className="reg-page">
        <div className="reg-success-card">
          <div className="reg-success-icon">{r.icon}</div>
          <h2>Account Created!</h2>
          <p>
            Your <strong>{r.label}</strong> account has been registered successfully.
            {role === "ADMIN" && " You now have full access to the NASMS admin panel."}
            {role === "FARMER" && " You can now apply for loans and access all farmer services."}
            {role === "BUYER" && " You can now browse and purchase produce from Kenyan farmers."}
            {role === "SELLER" && " You can now list your products on the NASMS marketplace."}
          </p>
          <p className="reg-success-redirect">Redirecting to login…</p>
          <div className="reg-spinner" />
        </div>
      </div>
      <style>{styles}</style>
    </Layout>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function RegisterPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleValue | null>(null);
  const [success, setSuccess]           = useState(false);

  function handleSuccess() {
    setSuccess(true);
    setTimeout(() => navigate({ to: "/login" }), 2500);
  }

  if (success && selectedRole) return <SuccessScreen role={selectedRole} />;

  return (
    <Layout padded={false} hideFooter>
      <div className="reg-page">
        <div className="reg-card">
          {/* Header */}
          <div className="reg-hdr">
            <span style={{ fontSize: "2rem" }}>🌾</span>
            <div>
              <h2 className="reg-title">Create Account</h2>
              <p className="reg-sub">National Agricultural Support &amp; Monitoring System</p>
            </div>
          </div>

          {/* Role selector — always shown at top */}
          <div className="reg-role-section">
            <div className="reg-section-title">
              {selectedRole ? "Account Type" : "Choose your account type *"}
            </div>
            <div className="reg-roles-grid">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`reg-role-card${selectedRole === r.value ? " selected" : ""}`}
                  style={selectedRole === r.value ? {
                    borderColor: r.color,
                    background: r.bg,
                  } : {}}
                  onClick={() => setSelectedRole(r.value)}
                >
                  <span className="reg-role-icon">{r.icon}</span>
                  <span className="reg-role-label" style={selectedRole === r.value ? { color: r.color } : {}}>
                    {r.label}
                  </span>
                  {selectedRole === r.value && (
                    <span className="reg-role-check" style={{ background: r.color }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            {selectedRole && (
              <p className="reg-role-desc">
                {ROLES.find(r => r.value === selectedRole)?.desc}
              </p>
            )}
          </div>

          {/* Divider */}
          {selectedRole && <div className="reg-divider" />}

          {/* Form — changes based on role */}
          {selectedRole === "FARMER" && (
            <FarmerForm onSuccess={handleSuccess} />
          )}

          {(selectedRole === "BUYER" || selectedRole === "SELLER" || selectedRole === "ADMIN") && (
            <SimpleForm role={selectedRole} onSuccess={handleSuccess} />
          )}

          {!selectedRole && (
            <p className="reg-choose-hint">← Select an account type above to continue</p>
          )}

          <p className="reg-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
      <style>{styles}</style>
    </Layout>
  );
}

// ─── Simple form (ADMIN, BUYER, SELLER) ───────────────────────────────────────
function SimpleForm({ role, onSuccess }: { role: RoleValue; onSuccess: () => void }) {
  const [form, setForm] = useState({
    userName: "", emailAddress: "", password: "", confirmPassword: "", terms: false,
  });
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [showPwd,    setShowPwd]    = useState(false);
  const [showCfm,    setShowCfm]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const r = ROLES.find(r => r.value === role)!;

  function validate() {
    const e: Record<string, string> = {};
    if (form.userName.trim().length < 2)      e.userName       = "Enter your full name (min 2 chars).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress))
                                              e.emailAddress   = "Enter a valid email address.";
    if (form.password.length < 8)             e.password       = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (!form.terms)                          e.terms          = "You must accept the Terms of Use.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerUser({
        userName: form.userName.trim(),
        emailAddress: form.emailAddress.trim(),
        password: form.password,
        role,
      });
      onSuccess();
    } catch (err: any) {
      const msg = err.message ?? "Registration failed.";
      setErrors({ terms: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const strength = pwStrength(form.password);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="reg-section-title" style={{ color: r.color }}>
        {r.icon} {r.label} Details
      </div>

      <div className="reg-grid single">
        {/* Full name */}
        <div className="reg-field full">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder={role === "ADMIN" ? "e.g. John Kamau" : "e.g. Jane Wanjiku"}
            value={form.userName}
            onChange={e => setForm(f => ({ ...f, userName: e.target.value }))}
            className={errors.userName ? "error" : ""}
          />
          {errors.userName && <span className="reg-err">{errors.userName}</span>}
        </div>

        {/* Email */}
        <div className="reg-field full">
          <label>Email Address *</label>
          <div className="reg-input-icon-wrap">
            <i className="fa fa-envelope reg-input-icon" />
            <input
              type="email"
              placeholder={
                role === "ADMIN"  ? "admin@nasms.go.ke" :
                role === "BUYER"  ? "buyer@example.com" :
                "seller@example.com"
              }
              value={form.emailAddress}
              onChange={e => setForm(f => ({ ...f, emailAddress: e.target.value }))}
              className={errors.emailAddress ? "error" : ""}
            />
          </div>
          {errors.emailAddress && <span className="reg-err">{errors.emailAddress}</span>}
        </div>

        {/* Password */}
        <div className="reg-field full">
          <label>Password *</label>
          <div className="reg-pwd-wrap">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className={errors.password ? "error" : ""}
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="reg-eye">
              <i className={showPwd ? "fa fa-eye-slash" : "fa fa-eye"} />
            </button>
          </div>
          {form.password && (
            <div style={{ marginTop: 4 }}>
              <div className={`reg-strength ${strength}`} />
              <span style={{
                fontSize: "0.7rem",
                color: strength === "strong" ? "#16a34a" : strength === "fair" ? "#d97706" : "#dc2626",
              }}>
                Password strength: {strength}
              </span>
            </div>
          )}
          {errors.password && <span className="reg-err">{errors.password}</span>}
        </div>

        {/* Confirm password */}
        <div className="reg-field full">
          <label>Confirm Password *</label>
          <div className="reg-pwd-wrap">
            <input
              type={showCfm ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              className={errors.confirmPassword ? "error" : ""}
            />
            <button type="button" onClick={() => setShowCfm(s => !s)} className="reg-eye">
              <i className={showCfm ? "fa fa-eye-slash" : "fa fa-eye"} />
            </button>
          </div>
          {errors.confirmPassword && <span className="reg-err">{errors.confirmPassword}</span>}
        </div>

        {/* Terms */}
        <div className="reg-field full">
          <label className="reg-check-label">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
            />
            I agree to the <a href="#" target="_blank">Terms of Use</a> and{" "}
            <a href="#" target="_blank">Privacy Policy</a>
          </label>
          {errors.terms && <span className="reg-err">{errors.terms}</span>}
        </div>
      </div>

      <button
        type="submit"
        className="reg-btn-primary"
        disabled={submitting}
        style={{ width: "100%", justifyContent: "center", background: r.color }}
      >
        {submitting
          ? <><i className="fa fa-spinner fa-spin" /> Creating account…</>
          : <><i className="fa fa-check-circle" /> Create {r.label} Account</>
        }
      </button>
    </form>
  );
}

// ─── Farmer form (3-step) ─────────────────────────────────────────────────────
function FarmerForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    fullName: "", nationalId: "", phone: "", email: "",
    farmSize: "", titleDeed: "", county: "", subCounty: "", ward: "", farmType: "",
    password: "", confirmPassword: "", terms: false,
  });
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [showPwd,    setShowPwd]    = useState(false);
  const [showCfm,    setShowCfm]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  function validate(s: 1 | 2 | 3) {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (form.fullName.trim().length < 3)
        e.fullName = "Enter full name (min 3 chars).";
      if (!/^\d{6,9}$/.test(form.nationalId))
        e.nationalId = "Enter a valid 6–9 digit National ID.";
      if (!/^\+?\d{9,15}$/.test(form.phone.replace(/\s/g, "")))
        e.phone = "Enter a valid phone number.";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email address.";
      if (!form.email.trim())
        e.email = "Email address is required.";
    }
    if (s === 2) {
      if (!form.farmSize || isNaN(+form.farmSize) || +form.farmSize <= 0)
        e.farmSize = "Enter a valid farm size.";
      if (form.titleDeed.trim().length < 3)
        e.titleDeed = "Enter a valid title deed number.";
      if (!form.county)   e.county   = "Please select a county.";
      if (!form.farmType) e.farmType = "Please select a farming type.";
    }
    if (s === 3) {
      if (form.password.length < 8)
        e.password = "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Passwords do not match.";
      if (!form.terms)
        e.terms = "You must accept the Terms of Use.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate(3)) return;
    setSubmitting(true);
    try {
      await register({
        fullName:   form.fullName,
        nationalId: form.nationalId,
        phone:      form.phone,
        email:      form.email,
        farmSize:   parseFloat(form.farmSize),
        titleDeed:  form.titleDeed,
        county:     form.county,
        subCounty:  form.subCounty,
        ward:       form.ward,
        farmType:   form.farmType,
        password:   form.password,
      });
      onSuccess();
    } catch (err: any) {
      setErrors({ terms: err.message ?? "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const strength = pwStrength(form.password);

  const STEPS = ["Personal Info", "Farm Details", "Security"];

  return (
    <>
      {/* Step indicator */}
      <div className="reg-steps">
        {STEPS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          return (
            <div key={n} style={{ display: "contents" }}>
              <div className={`reg-step${step === n ? " active" : ""}${step > n ? " done" : ""}`}>
                <div className="reg-step-num">{step > n ? "✓" : n}</div>
                <span>{label}</span>
              </div>
              {i < 2 && <div className={`reg-step-line${step > n ? " done" : ""}`} />}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Step 1: Personal ── */}
        {step === 1 && (
          <div>
            <div className="reg-section-title">Personal Information</div>
            <div className="reg-grid">
              {[
                { key: "fullName",   label: "Full Name *",       type: "text",  ph: "e.g. Jane Wanjiku Kamau", full: true },
                { key: "nationalId", label: "National ID *",      type: "text",  ph: "Enter your National ID" },
                { key: "phone",      label: "Phone Number *",     type: "tel",   ph: "+254 7XX XXX XXX" },
                { key: "email",      label: "Email Address *",    type: "email", ph: "jane@example.com" },
              ].map(f => (
                <div key={f.key} className={`reg-field${f.full ? " full" : ""}`}>
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    value={(form as any)[f.key]}
                    onChange={e => upd(f.key as any, e.target.value)}
                    className={errors[f.key] ? "error" : ""}
                  />
                  {errors[f.key] && <span className="reg-err">{errors[f.key]}</span>}
                </div>
              ))}
            </div>
            <div className="reg-actions">
              <button
                type="button"
                className="reg-btn-primary"
                onClick={() => { if (validate(1)) setStep(2); }}
              >
                Next: Farm Details <i className="fa fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Farm ── */}
        {step === 2 && (
          <div>
            <div className="reg-section-title">Farm Information</div>
            <div className="reg-grid">
              {[
                { key: "farmSize",  label: "Farm Size (Acres) *",    type: "number", ph: "e.g. 5.5" },
                { key: "titleDeed", label: "Title Deed Number *",     type: "text",   ph: "e.g. MSA/1234/56" },
                { key: "subCounty", label: "Sub-County",              type: "text",   ph: "e.g. Kikuyu" },
                { key: "ward",      label: "Ward",                    type: "text",   ph: "e.g. Township" },
              ].map(f => (
                <div key={f.key} className="reg-field">
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    value={(form as any)[f.key]}
                    onChange={e => upd(f.key as any, e.target.value)}
                    className={errors[f.key] ? "error" : ""}
                    min={f.type === "number" ? "0.1" : undefined}
                    step={f.type === "number" ? "0.1" : undefined}
                  />
                  {errors[f.key] && <span className="reg-err">{errors[f.key]}</span>}
                </div>
              ))}

              <div className="reg-field">
                <label>County *</label>
                <select
                  value={form.county}
                  onChange={e => upd("county", e.target.value)}
                  className={errors.county ? "error" : ""}
                >
                  <option value="">Select County</option>
                  {COUNTIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.county && <span className="reg-err">{errors.county}</span>}
              </div>

              <div className="reg-field">
                <label>Type of Farming *</label>
                <select
                  value={form.farmType}
                  onChange={e => upd("farmType", e.target.value)}
                  className={errors.farmType ? "error" : ""}
                >
                  <option value="">Select Type</option>
                  {FARM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.farmType && <span className="reg-err">{errors.farmType}</span>}
              </div>
            </div>
            <div className="reg-actions two">
              <button type="button" className="reg-btn-back" onClick={() => setStep(1)}>
                <i className="fa fa-arrow-left" /> Back
              </button>
              <button type="button" className="reg-btn-primary" onClick={() => { if (validate(2)) setStep(3); }}>
                Next: Security <i className="fa fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Security ── */}
        {step === 3 && (
          <div>
            <div className="reg-section-title">Account Security</div>
            <div className="reg-grid single">
              <div className="reg-field full">
                <label>Password *</label>
                <div className="reg-pwd-wrap">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={e => upd("password", e.target.value)}
                    className={errors.password ? "error" : ""}
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="reg-eye">
                    <i className={showPwd ? "fa fa-eye-slash" : "fa fa-eye"} />
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: 4 }}>
                    <div className={`reg-strength ${strength}`} />
                    <span style={{
                      fontSize: "0.7rem",
                      color: strength === "strong" ? "#16a34a" : strength === "fair" ? "#d97706" : "#dc2626",
                    }}>
                      Password strength: {strength}
                    </span>
                  </div>
                )}
                {errors.password && <span className="reg-err">{errors.password}</span>}
              </div>

              <div className="reg-field full">
                <label>Confirm Password *</label>
                <div className="reg-pwd-wrap">
                  <input
                    type={showCfm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={e => upd("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button type="button" onClick={() => setShowCfm(s => !s)} className="reg-eye">
                    <i className={showCfm ? "fa fa-eye-slash" : "fa fa-eye"} />
                  </button>
                </div>
                {errors.confirmPassword && <span className="reg-err">{errors.confirmPassword}</span>}
              </div>

              <div className="reg-field full">
                <label className="reg-check-label">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={e => upd("terms", e.target.checked)}
                  />
                  I agree to the <a href="#" target="_blank">Terms of Use</a> and{" "}
                  <a href="#" target="_blank">Privacy Policy</a>
                </label>
                {errors.terms && <span className="reg-err">{errors.terms}</span>}
              </div>
            </div>

            <div className="reg-actions two">
              <button type="button" className="reg-btn-back" onClick={() => setStep(2)}>
                <i className="fa fa-arrow-left" /> Back
              </button>
              <button type="submit" className="reg-btn-primary" disabled={submitting}>
                {submitting
                  ? <><i className="fa fa-spinner fa-spin" /> Registering…</>
                  : <><i className="fa fa-check-circle" /> Complete Registration</>
                }
              </button>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  .reg-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);font-family:'DM Sans',sans-serif;}
  .reg-card{background:#fff;border-radius:20px;box-shadow:0 4px 32px rgba(0,0,0,0.08);width:100%;max-width:700px;padding:2.5rem;}
  @media(max-width:600px){.reg-card{padding:1.5rem;border-radius:14px;}}

  /* Header */
  .reg-hdr{display:flex;align-items:center;gap:1rem;margin-bottom:2rem;}
  .reg-title{font-size:1.4rem;font-weight:800;color:#1b5e20;margin:0 0 2px;}
  .reg-sub{font-size:0.75rem;color:#6b7280;margin:0;}

  /* Role selector */
  .reg-role-section{margin-bottom:1.5rem;}
  .reg-roles-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:0.75rem;}
  @media(max-width:600px){.reg-roles-grid{grid-template-columns:repeat(2,1fr);}}
  .reg-role-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:0.35rem;padding:1rem 0.5rem;border-radius:12px;border:2px solid #e5e7eb;background:#fff;cursor:pointer;transition:all 0.15s;font-family:inherit;}
  .reg-role-card:hover{border-color:#d1d5db;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.06);}
  .reg-role-card.selected{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.1);}
  .reg-role-icon{font-size:1.75rem;line-height:1;}
  .reg-role-label{font-size:0.78rem;font-weight:700;color:#374151;}
  .reg-role-check{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;color:#fff;font-size:0.65rem;display:flex;align-items:center;justify-content:center;font-weight:900;}
  .reg-role-desc{font-size:0.8rem;color:#6b7280;background:#f9fafb;border-radius:8px;padding:0.6rem 0.875rem;line-height:1.5;margin:0;}

  /* Divider */
  .reg-divider{height:1px;background:#f3f4f6;margin:1.5rem 0;}

  /* Step indicator */
  .reg-steps{display:flex;align-items:center;margin-bottom:2rem;}
  .reg-step{display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;font-weight:500;color:#9ca3af;white-space:nowrap;}
  .reg-step.active{color:#2e7d32;}
  .reg-step.done{color:#16a34a;}
  .reg-step-num{width:28px;height:28px;border-radius:50%;border:2px solid #d1d5db;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;transition:all 0.2s;}
  .reg-step.active .reg-step-num{border-color:#2e7d32;background:#2e7d32;color:#fff;}
  .reg-step.done .reg-step-num{border-color:#16a34a;background:#16a34a;color:#fff;}
  .reg-step-line{flex:1;height:2px;background:#e5e7eb;margin:0 0.75rem;transition:background 0.2s;min-width:20px;}
  .reg-step-line.done{background:#16a34a;}

  /* Section title */
  .reg-section-title{font-size:0.875rem;font-weight:700;color:#111827;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6;}

  /* Grid / Fields */
  .reg-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem 1.25rem;margin-bottom:1.5rem;}
  .reg-grid.single{grid-template-columns:1fr;}
  @media(max-width:500px){.reg-grid{grid-template-columns:1fr;}}
  .reg-field{display:flex;flex-direction:column;gap:0.3rem;}
  .reg-field.full{grid-column:1/-1;}
  .reg-field label{font-size:0.8rem;font-weight:600;color:#374151;}
  .reg-field input,.reg-field select{height:42px;padding:0 0.875rem;border:1.5px solid #d1d5db;border-radius:9px;font-size:0.875rem;color:#111827;background:#fafafa;outline:none;transition:border-color 0.15s,box-shadow 0.15s;box-sizing:border-box;width:100%;font-family:inherit;appearance:none;}
  .reg-field input:focus,.reg-field select:focus{border-color:#2e7d32;box-shadow:0 0 0 3px rgba(46,125,50,0.12);background:#fff;}
  .reg-field input.error,.reg-field select.error{border-color:#ef4444;}
  .reg-err{font-size:0.72rem;color:#ef4444;line-height:1.2;}

  /* Icon input */
  .reg-input-icon-wrap{position:relative;display:flex;align-items:center;}
  .reg-input-icon{position:absolute;left:0.875rem;color:#9ca3af;font-size:0.85rem;pointer-events:none;z-index:1;}
  .reg-input-icon-wrap input{padding-left:2.5rem;}

  /* Password */
  .reg-pwd-wrap{position:relative;display:flex;align-items:center;}
  .reg-pwd-wrap input{padding-right:2.5rem;}
  .reg-eye{position:absolute;right:0.75rem;background:none;border:none;cursor:pointer;color:#6b7280;padding:0;display:flex;align-items:center;font-size:0.9rem;}
  .reg-eye:hover{color:#374151;}
  .reg-strength{height:4px;border-radius:2px;margin-bottom:4px;transition:all 0.3s;}
  .reg-strength.weak{background:linear-gradient(to right,#ef4444 33%,#e5e7eb 33%);}
  .reg-strength.fair{background:linear-gradient(to right,#f59e0b 66%,#e5e7eb 66%);}
  .reg-strength.strong{background:#22c55e;}

  /* Terms */
  .reg-check-label{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.82rem;color:#374151;cursor:pointer;line-height:1.5;}
  .reg-check-label input{width:16px;height:16px;min-width:16px;margin-top:2px;accent-color:#2e7d32;cursor:pointer;}
  .reg-check-label a{color:#2e7d32;font-weight:600;}

  /* Actions */
  .reg-actions{display:flex;justify-content:flex-end;}
  .reg-actions.two{justify-content:space-between;align-items:center;}
  .reg-btn-primary{display:inline-flex;align-items:center;gap:0.45rem;padding:0 1.5rem;height:46px;background:#2e7d32;color:#fff;border:none;border-radius:9px;font-size:0.875rem;font-weight:700;cursor:pointer;transition:background 0.15s;font-family:inherit;}
  .reg-btn-primary:hover:not(:disabled){filter:brightness(0.9);}
  .reg-btn-primary:disabled{opacity:0.65;cursor:not-allowed;}
  .reg-btn-back{display:inline-flex;align-items:center;gap:0.45rem;padding:0 1.25rem;height:46px;background:#fff;color:#6b7280;border:1.5px solid #d1d5db;border-radius:9px;font-size:0.875rem;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:inherit;}
  .reg-btn-back:hover{border-color:#2e7d32;color:#2e7d32;}

  /* Footer */
  .reg-footer{text-align:center;font-size:0.82rem;color:#6b7280;margin-top:1.5rem;}
  .reg-footer a{color:#2e7d32;font-weight:700;}
  .reg-footer a:hover{text-decoration:underline;}
  .reg-choose-hint{text-align:center;color:#9ca3af;font-size:0.875rem;padding:1.5rem 0;font-style:italic;}

  /* Success */
  .reg-success-card{background:#fff;border-radius:20px;padding:3rem 2.5rem;text-align:center;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.08);}
  .reg-success-icon{font-size:3.5rem;margin-bottom:1rem;}
  .reg-success-card h2{font-size:1.5rem;font-weight:800;color:#1b5e20;margin:0 0 0.75rem;}
  .reg-success-card p{color:#6b7280;font-size:0.875rem;line-height:1.6;margin:0 0 0.5rem;}
  .reg-success-redirect{font-size:0.78rem!important;color:#9ca3af!important;}
  .reg-spinner{width:36px;height:36px;border:3px solid #e5e7eb;border-top-color:#2e7d32;border-radius:50%;animation:spin 0.7s linear infinite;margin:1.25rem auto 0;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;