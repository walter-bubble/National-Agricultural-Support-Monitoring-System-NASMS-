import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { getToken, getRole, getUser, clearSession } from "@/services/api";

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string|null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    setLoggedIn(!!token);
    setRole(getRole());
  }, [pathname]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") setMobileOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function signOut() {
    clearSession();
    void navigate({ to: "/login" });
  }

  const activeId = pathname === "/" ? "home" : pathname.split("/")[1] ?? "";

  const NAV_LINKS = [
    { id:"",         icon:"🏠", label:"Home",           to:"/"         },
    { id:"dashboard",icon:"👨‍🌾",label:"Dashboard",      to:"/dashboard"},
    { id:"loans",    icon:"💰", label:"Loans",          to:"/loans"    },
    { id:"products", icon:"🌱", label:"Farm Inputs",    to:"/products" },
    { id:"market",   icon:"🏪", label:"Marketplace",    to:"/market"   },
    { id:"weather",  icon:"🌤️",label:"Weather",        to:"/weather"  },
    { id:"analytics",icon:"📊", label:"Analytics",      to:"/analytics"},
  ];

  return (
    <>
      <nav className="nav-root">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🌾</div>
            <div className="nav-logo-text">
              <strong>NASMS</strong>
              <span>Agricultural System</span>
            </div>
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map(({id,icon,label,to}) => (
              <li key={to}>
                <Link to={to as any} className={id===activeId||(!id&&pathname==="/")?"active":""}>
                  <span>{icon}</span>{label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link to="/chat" className="nav-support-btn"><i className="fa fa-comment" /> Support</Link>
            {loggedIn ? (
              <>
                {role === "ADMIN" && (
                  <Link to="/admin" className="nav-btn-ghost" style={{borderColor:"#f59e0b",color:"#d97706"}}>
                    🛡️ Admin
                  </Link>
                )}
                <button className="nav-btn-solid nav-signout-btn" onClick={signOut}>
                  <i className="fa fa-sign-out-alt" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="nav-btn-ghost">Register</Link>
                <Link to="/login"    className="nav-btn-solid">Login</Link>
              </>
            )}
          </div>

          <button type="button" className={`hamburger${mobileOpen?" open":""}`}
            aria-label={mobileOpen?"Close menu":"Open menu"} onClick={() => setMobileOpen(o=>!o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-overlay${mobileOpen?" open":""}`} onClick={() => setMobileOpen(false)} />

      <div className={`mobile-nav${mobileOpen?" open":""}`}>
        {NAV_LINKS.map(({id,icon,label,to}) => (
          <Link key={to} to={to as any} className={id===activeId?"active":""} onClick={() => setMobileOpen(false)}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <div className="mobile-nav-divider" />
        <Link to="/chat" onClick={() => setMobileOpen(false)}><span>💬</span> Support Chat</Link>
        {role === "ADMIN" && (
          <Link to="/admin" onClick={() => setMobileOpen(false)} style={{color:"#d97706"}}>
            <span>🛡️</span> Admin Panel
          </Link>
        )}
        <div className="mobile-nav-divider" />
        {loggedIn ? (
          <button className="mobile-signout" onClick={() => { setMobileOpen(false); signOut(); }}>
            <i className="fa fa-sign-out-alt" /> Sign Out
          </button>
        ) : (
          <div className="mobile-nav-auth">
            <Link to="/register" className="nav-btn-ghost" onClick={() => setMobileOpen(false)}>Register</Link>
            <Link to="/login"    className="nav-btn-solid" onClick={() => setMobileOpen(false)}>Login</Link>
          </div>
        )}
      </div>

      <style>{`
        .nav-root{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,0.06);}
        .nav-inner{max-width:1280px;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;gap:1.5rem;}
        .nav-logo{display:flex;align-items:center;gap:0.6rem;text-decoration:none;flex-shrink:0;}
        .nav-logo-icon{font-size:1.75rem;line-height:1;}
        .nav-logo-text strong{display:block;font-size:1rem;font-weight:800;color:#1b5e20;line-height:1.1;}
        .nav-logo-text span{display:block;font-size:0.62rem;color:#9ca3af;font-weight:400;text-transform:uppercase;letter-spacing:0.03em;}
        .nav-links{display:flex;align-items:center;gap:0.1rem;list-style:none;margin:0;padding:0;flex:1;}
        .nav-links a{display:flex;align-items:center;gap:0.3rem;padding:0.4rem 0.6rem;border-radius:7px;font-size:0.8rem;font-weight:500;color:#4b5563;text-decoration:none;white-space:nowrap;transition:color 0.15s,background 0.15s;}
        .nav-links a:hover{color:#1b5e20;background:#f0f7f0;}
        .nav-links a.active{color:#2e7d32;background:#e8f5e9;font-weight:700;}
        .nav-actions{display:flex;align-items:center;gap:0.5rem;margin-left:auto;flex-shrink:0;}
        .nav-btn-ghost{height:36px;padding:0 1rem;border:1.5px solid #d1d5db;border-radius:7px;background:transparent;font-size:0.82rem;font-weight:500;color:#374151;text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;transition:all 0.15s;cursor:pointer;font-family:inherit;}
        .nav-btn-ghost:hover{border-color:#2e7d32;color:#2e7d32;}
        .nav-btn-solid{height:36px;padding:0 1rem;border:none;border-radius:7px;background:#2e7d32;font-size:0.82rem;font-weight:600;color:#fff;text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;transition:background 0.15s;cursor:pointer;font-family:inherit;}
        .nav-btn-solid:hover{background:#1b5e20;}
        .nav-signout-btn{background:#fee2e2;color:#dc2626;}
        .nav-signout-btn:hover{background:#fecaca;}
        .nav-support-btn{height:36px;padding:0 0.875rem;border:1.5px solid #bbf7d0;border-radius:7px;background:#f0fdf4;font-size:0.82rem;font-weight:500;color:#2e7d32;text-decoration:none;display:inline-flex;align-items:center;gap:0.35rem;transition:background 0.15s;}
        .nav-support-btn:hover{background:#dcfce7;}
        .hamburger{display:none;flex-direction:column;justify-content:center;gap:5px;width:36px;height:36px;background:none;border:1.5px solid #d1d5db;border-radius:7px;cursor:pointer;padding:0 8px;margin-left:auto;flex-shrink:0;transition:border-color 0.15s;}
        .hamburger:hover{border-color:#2e7d32;}
        .hamburger span{display:block;height:2px;background:#374151;border-radius:2px;transition:transform 0.2s,opacity 0.2s;}
        .hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
        .hamburger.open span:nth-child(2){opacity:0;}
        .hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
        .mobile-overlay{display:none;position:fixed;inset:64px 0 0 0;background:rgba(0,0,0,0.35);z-index:99;opacity:0;transition:opacity 0.2s;}
        .mobile-overlay.open{opacity:1;}
        .mobile-nav{display:none;position:fixed;top:64px;left:0;right:0;bottom:0;background:#fff;z-index:100;overflow-y:auto;transform:translateX(-100%);transition:transform 0.25s ease;padding:1rem 1.25rem 2rem;flex-direction:column;gap:0.25rem;}
        .mobile-nav.open{transform:translateX(0);}
        .mobile-nav a{display:flex;align-items:center;gap:0.6rem;padding:0.65rem 0.75rem;border-radius:8px;font-size:0.9rem;font-weight:500;color:#374151;text-decoration:none;transition:background 0.15s,color 0.15s;}
        .mobile-nav a:hover,.mobile-nav a.active{background:#f0f7f0;color:#2e7d32;}
        .mobile-nav-divider{height:1px;background:#f3f4f6;margin:0.75rem 0;}
        .mobile-nav-auth{display:flex;gap:0.5rem;margin-top:0.5rem;}
        .mobile-nav-auth a{flex:1;justify-content:center;height:44px;font-size:0.875rem;border-radius:9px;}
        .mobile-signout{display:flex;align-items:center;gap:0.5rem;padding:0.65rem 0.75rem;border-radius:8px;font-size:0.9rem;font-weight:500;color:#dc2626;background:none;border:none;cursor:pointer;width:100%;text-align:left;}
        .mobile-signout:hover{background:#fef2f2;}
        @media(max-width:1000px){.nav-links a span{display:none;}}
        @media(max-width:900px){.nav-links,.nav-actions{display:none;}.hamburger{display:flex;}.mobile-nav,.mobile-overlay{display:flex;}.mobile-nav{display:flex;}}
      `}</style>
    </>
  );
}

export { Nav };
