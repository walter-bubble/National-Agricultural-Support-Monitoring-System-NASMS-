import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import {
  getFarmerProfile, getMyApplications, getNotifications,
  getUser, getRole, clearSession,
} from "@/services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "NASMS – Dashboard" }] }),
  component: DashboardPage,
});

const RAINFALL = [
  {m:"Jan",mm:42},{m:"Feb",mm:58},{m:"Mar",mm:95},{m:"Apr",mm:140},
  {m:"May",mm:112},{m:"Jun",mm:38},{m:"Jul",mm:22},{m:"Aug",mm:28},
  {m:"Sep",mm:45},{m:"Oct",mm:88},{m:"Nov",mm:105},{m:"Dec",mm:60},
];

function Sk({ w="100%", h="1rem" }: { w?: string; h?: string }) {
  return <div style={{ width:w, height:h, borderRadius:6, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }} />;
}

function DashboardPage() {
  const navigate  = useNavigate();
  const username  = getUser() ?? "User";
  const role      = getRole() ?? "FARMER";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profileQ = useQuery({
    queryKey: ["farmer","profile"],
    queryFn:  getFarmerProfile,
    retry:    1,
    enabled:  role === "FARMER",
  });
  const appsQ = useQuery({
    queryKey: ["loans","applications"],
    queryFn:  getMyApplications,
    enabled:  role === "FARMER",
  });
  const notifsQ = useQuery({
    queryKey: ["notifications"],
    queryFn:  getNotifications,
    refetchInterval: 30000,
  });

  const profile = profileQ.data;
  const apps    = appsQ.data    ?? [];
  const notifs  = notifsQ.data  ?? [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = profile?.fullName?.split(" ")[0] ?? username;

  const today = new Date().toLocaleDateString("en-KE",{
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });

  function signOut() {
    clearSession();
    void navigate({ to: "/login" });
  }

  const pendingApps = apps.filter(a => a.status?.toUpperCase() === "PENDING").length;
  const approvedApps = apps.filter(a => a.status?.toUpperCase() === "APPROVED").length;
  const totalBorrowed = apps.filter(a => a.status?.toUpperCase() === "APPROVED")
    .reduce((s,a) => s + (a.amount ?? 0), 0);

  const loanBarData = apps.slice(0,6).map(a => ({
    name: (a.loanName ?? "Loan").substring(0,12),
    amount: a.amount,
  }));

  const navLinks = [
    { icon:"fa-th-large",       label:"Dashboard",    to:"/dashboard",   active:true  },
    { icon:"fa-hand-holding-usd",label:"My Loans",    to:"/loans"        },
    { icon:"fa-seedling",       label:"Farm Inputs",   to:"/products"     },
    { icon:"fa-store",          label:"Marketplace",   to:"/market"       },
    { icon:"fa-cloud-sun",      label:"Weather",       to:"/weather"      },
    { icon:"fa-chart-bar",      label:"Analytics",     to:"/analytics"    },
    { icon:"fa-comment",        label:"Support Chat",  to:"/chat"         },
  ];

  return (
    <Layout hideFooter>
      <style>{`
        @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .db-wrap{display:flex;min-height:calc(100vh - 64px);background:#f6f8f6;font-family:'DM Sans',sans-serif;}
        /* Sidebar */
        .db-side{width:240px;flex-shrink:0;background:#fff;border-right:1px solid #e5e7eb;display:flex;flex-direction:column;padding:1.25rem 0 1rem;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto;}
        .db-side-user{display:flex;align-items:center;gap:0.75rem;padding:0 1.25rem 1.25rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.75rem;}
        .db-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#e8f5e9,#c8e6c9);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;}
        .db-side-name{font-size:0.875rem;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}
        .db-side-role{font-size:0.65rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;background:#dcfce7;color:#16a34a;padding:1px 8px;border-radius:20px;display:inline-block;}
        .db-nav-lbl{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;padding:0.75rem 1.25rem 0.3rem;}
        .db-nav-link{display:flex;align-items:center;gap:0.65rem;padding:0.55rem 1.25rem;font-size:0.845rem;font-weight:500;color:#4b5563;text-decoration:none;transition:background 0.12s,color 0.12s;border-right:3px solid transparent;}
        .db-nav-link:hover{background:#f0f7f0;color:#2e7d32;}
        .db-nav-link.active{background:#e8f5e9;color:#2e7d32;font-weight:700;border-right-color:#2e7d32;}
        .db-nav-link i{width:16px;text-align:center;font-size:0.85rem;flex-shrink:0;}
        .db-notif-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.65rem;font-weight:700;border-radius:10px;padding:1px 6px;min-width:18px;text-align:center;}
        .db-signout{margin-top:auto;padding-top:1rem;border-top:1px solid #f3f4f6;}
        .db-signout-btn{display:flex;align-items:center;gap:0.65rem;padding:0.55rem 1.25rem;font-size:0.845rem;font-weight:500;color:#ef4444;background:none;border:none;cursor:pointer;width:100%;transition:background 0.12s;}
        .db-signout-btn:hover{background:#fef2f2;}
        /* Main */
        .db-main{flex:1;min-width:0;padding:1.75rem 2rem;overflow-x:hidden;}
        @media(max-width:900px){.db-main{padding:1rem;}}
        .db-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap;}
        .db-date{font-size:0.72rem;color:#9ca3af;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;}
        .db-greeting{font-size:1.5rem;font-weight:800;color:#111827;margin:0 0 0.2rem;}
        .db-sub{font-size:0.82rem;color:#6b7280;margin:0;}
        .db-refresh-btn{height:36px;padding:0 1rem;border:1.5px solid #d1d5db;border-radius:8px;background:#fff;font-size:0.78rem;font-weight:500;color:#374151;cursor:pointer;display:flex;align-items:center;gap:0.4rem;transition:all 0.15s;}
        .db-refresh-btn:hover{border-color:#2e7d32;color:#2e7d32;}
        /* Stat cards */
        .db-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;animation:fadeUp 0.4s ease;}
        @media(max-width:1100px){.db-cards{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:540px){.db-cards{grid-template-columns:1fr;}}
        .db-card{background:#fff;border-radius:14px;border:1px solid #e5e7eb;padding:1.25rem;display:flex;flex-direction:column;gap:0.5rem;transition:box-shadow 0.15s,transform 0.15s;}
        .db-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.06);transform:translateY(-1px);}
        .db-card-top{display:flex;align-items:center;justify-content:space-between;}
        .db-card-label{font-size:0.72rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;}
        .db-card-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;}
        .db-card-val{font-size:1.7rem;font-weight:800;color:#111827;line-height:1;}
        .db-card-sub{font-size:0.72rem;color:#6b7280;}
        .db-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:700;}
        /* Row layout */
        .db-row{display:grid;grid-template-columns:1fr 360px;gap:1rem;margin-bottom:1rem;}
        @media(max-width:1100px){.db-row{grid-template-columns:1fr;}}
        .db-panel{background:#fff;border-radius:14px;border:1px solid #e5e7eb;padding:1.5rem;}
        .db-panel-title{font-size:0.9rem;font-weight:700;color:#111827;margin:0 0 1.25rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between;}
        .db-panel-title span{font-size:0.72rem;font-weight:500;color:#9ca3af;}
        .db-profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;}
        @media(max-width:540px){.db-profile-grid{grid-template-columns:1fr;}}
        .db-profile-item{}
        .db-pf-label{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin-bottom:3px;}
        .db-pf-val{font-size:0.875rem;font-weight:600;color:#111827;}
        /* Notifications */
        .db-notif-item{display:flex;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid #f9fafb;}
        .db-notif-item:last-child{border-bottom:none;}
        .db-notif-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
        .db-notif-text{font-size:0.82rem;color:#374151;line-height:1.45;margin:0 0 2px;}
        .db-notif-time{font-size:0.7rem;color:#9ca3af;}
        /* Charts */
        .db-charts{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;animation:fadeUp 0.5s ease;}
        @media(max-width:900px){.db-charts{grid-template-columns:1fr;}}
        /* Error */
        .db-err{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;color:#dc2626;display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;}
        /* Mobile */
        .db-mobile-bar{display:none;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:#fff;border-bottom:1px solid #e5e7eb;margin:-1rem -1rem 1rem;}
        @media(max-width:900px){
          .db-side{position:fixed;left:0;top:64px;z-index:200;transform:translateX(-100%);transition:transform 0.25s;box-shadow:4px 0 16px rgba(0,0,0,0.1);}
          .db-side.open{transform:translateX(0);}
          .db-mobile-bar{display:flex;}
        }
        .db-menu-btn{background:none;border:1.5px solid #e5e7eb;border-radius:8px;padding:0.4rem 0.75rem;font-size:0.82rem;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:0.4rem;}
        /* Quick actions */
        .db-quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.75rem;margin-bottom:1.5rem;animation:fadeUp 0.35s ease;}
        .db-quick-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;padding:1rem;display:flex;flex-direction:column;gap:0.4rem;text-decoration:none;transition:all 0.15s;}
        .db-quick-card:hover{border-color:#2e7d32;transform:translateY(-2px);box-shadow:0 4px 12px rgba(46,125,50,0.12);}
        .db-quick-icon{font-size:1.5rem;}
        .db-quick-label{font-size:0.82rem;font-weight:700;color:#111827;}
        .db-quick-desc{font-size:0.7rem;color:#9ca3af;}
      `}</style>

      <div className="db-wrap">
        {/* Sidebar */}
        <aside className={`db-side${sidebarOpen?" open":""}`}>
          <div className="db-side-user">
            <div className="db-avatar">
              {role === "ADMIN" ? "🛡️" : role === "BUYER" ? "🛒" : role === "SELLER" ? "🏪" : "👨‍🌾"}
            </div>
            <div style={{minWidth:0}}>
              <div className="db-side-name">{profileQ.isLoading ? "Loading…" : (profile?.fullName ?? username)}</div>
              <div className="db-side-role">{role}</div>
            </div>
          </div>

          <div className="db-nav-lbl">Main Menu</div>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to as any} className={`db-nav-link${l.active?" active":""}`} onClick={() => setSidebarOpen(false)}>
              <i className={`fa ${l.icon}`} /> {l.label}
              {l.label === "My Loans" && pendingApps > 0 && <span className="db-notif-badge">{pendingApps}</span>}
            </Link>
          ))}

          <div className="db-nav-lbl">Account</div>
          <a href="#" className="db-nav-link"><i className="fa fa-user" /> My Profile</a>
          <a href="#" className="db-nav-link">
            <i className="fa fa-bell" /> Notifications
            {notifs.length > 0 && <span className="db-notif-badge">{notifs.length}</span>}
          </a>

          {role === "ADMIN" && (
            <>
              <div className="db-nav-lbl">Admin</div>
              <Link to="/admin" className="db-nav-link" onClick={() => setSidebarOpen(false)}>
                <i className="fa fa-shield-alt" /> Admin Panel
              </Link>
            </>
          )}

          <div className="db-signout">
            <button className="db-signout-btn" onClick={signOut}>
              <i className="fa fa-sign-out-alt" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="db-main">
          {/* Mobile topbar */}
          <div className="db-mobile-bar">
            <button className="db-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
              <i className="fa fa-bars" /> Menu
            </button>
            <span style={{fontSize:"0.82rem",color:"#6b7280"}}>{role} Dashboard</span>
          </div>

          {/* Error banner */}
          {profileQ.isError && (
            <div className="db-err">
              <i className="fa fa-exclamation-circle" />
              Could not load profile.{" "}
              <button onClick={() => profileQ.refetch()} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontWeight:600,padding:0,marginLeft:4}}>
                Retry
              </button>
            </div>
          )}

          {/* Header */}
          <div className="db-header">
            <div>
              <div className="db-date">{today}</div>
              <h2 className="db-greeting">{greeting}, {profileQ.isLoading ? "…" : firstName}! 🌿</h2>
              <p className="db-sub">Here's your agricultural services overview</p>
            </div>
            <button className="db-refresh-btn" onClick={() => { profileQ.refetch(); appsQ.refetch(); notifsQ.refetch(); }}>
              <i className="fa fa-sync-alt" /> Refresh
            </button>
          </div>

          {/* Quick actions */}
          <div className="db-quick-grid">
            {[
              { icon:"💰", label:"Apply for Loan",    desc:"Government credit",   to:"/loans"     },
              { icon:"🌱", label:"Farm Inputs",        desc:"Seeds & fertilizer",  to:"/products"  },
              { icon:"🏪", label:"Sell Produce",       desc:"Find buyers",         to:"/market"    },
              { icon:"🌤️", label:"Check Weather",     desc:"County forecasts",    to:"/weather"   },
              { icon:"📊", label:"View Analytics",     desc:"Farm performance",    to:"/analytics" },
              { icon:"💬", label:"Get Support",        desc:"Chat with agents",    to:"/chat"      },
            ].map(q => (
              <Link key={q.to} to={q.to as any} className="db-quick-card">
                <div className="db-quick-icon">{q.icon}</div>
                <div className="db-quick-label">{q.label}</div>
                <div className="db-quick-desc">{q.desc}</div>
              </Link>
            ))}
          </div>

          {/* Stat cards */}
          <div className="db-cards">
            <div className="db-card">
              <div className="db-card-top">
                <div className="db-card-label">Farm Size</div>
                <div className="db-card-icon" style={{background:"#e8f5e9"}}>🌾</div>
              </div>
              <div className="db-card-val">{profileQ.isLoading ? <Sk h="32px" w="80px" /> : profile?.farmSize ? `${profile.farmSize} ac` : "—"}</div>
              <div className="db-card-sub"><span className="db-badge" style={{background:"#dcfce7",color:"#16a34a"}}>● Active Farm</span></div>
            </div>
            <div className="db-card">
              <div className="db-card-top">
                <div className="db-card-label">Loans</div>
                <div className="db-card-icon" style={{background:"#fef3c7"}}>💰</div>
              </div>
              <div className="db-card-val">{appsQ.isLoading ? <Sk h="32px" w="60px" /> : apps.length}</div>
              <div className="db-card-sub">
                {pendingApps > 0 && <span className="db-badge" style={{background:"#fef3c7",color:"#d97706"}}>⏳ {pendingApps} Pending</span>}
                {approvedApps > 0 && <span className="db-badge" style={{background:"#dcfce7",color:"#16a34a",marginLeft:4}}>✓ {approvedApps} Approved</span>}
              </div>
            </div>
            <div className="db-card">
              <div className="db-card-top">
                <div className="db-card-label">Total Borrowed</div>
                <div className="db-card-icon" style={{background:"#dbeafe"}}>💵</div>
              </div>
              <div className="db-card-val">{appsQ.isLoading ? <Sk h="32px" w="80px" /> : `KES ${(totalBorrowed/1000).toFixed(0)}K`}</div>
              <div className="db-card-sub"><span className="db-badge" style={{background:"#dbeafe",color:"#2563eb"}}>Approved loans</span></div>
            </div>
            <div className="db-card">
              <div className="db-card-top">
                <div className="db-card-label">County</div>
                <div className="db-card-icon" style={{background:"#fce7f3"}}>📍</div>
              </div>
              <div className="db-card-val" style={{fontSize:"1rem",marginTop:4}}>
                {profileQ.isLoading ? <Sk h="24px" w="100px" /> : profile?.county ?? "—"}
              </div>
              <div className="db-card-sub"><span className="db-badge" style={{background:"#fce7f3",color:"#db2777"}}>{profile?.farmType ?? "—"}</span></div>
            </div>
          </div>

          {/* Profile + Notifications */}
          <div className="db-row">
            <div className="db-panel">
              <div className="db-panel-title">
                Farmer Profile
                {profile && <span>ID: {profile.id}</span>}
              </div>
              {profileQ.isLoading ? (
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>{[1,2,3,4].map(i=><Sk key={i} h="40px"/>)}</div>
              ) : profile ? (
                <div className="db-profile-grid">
                  {[
                    ["Full Name",   profile.fullName    ],
                    ["Email",       profile.email       ],
                    ["Phone",       profile.phoneNumber  ],
                    ["National ID", profile.nationalId   ],
                    ["County",      profile.county       ],
                    ["Sub-County",  profile.subCounty ?? "—"],
                    ["Farm Type",   profile.farmType     ],
                    ["Title No.",   profile.titleNumber  ],
                    ["Farm Size",   `${profile.farmSize} acres`],
                    ["Registered",  profile.registeredDate],
                  ].map(([l,v]) => (
                    <div key={l} className="db-profile-item">
                      <div className="db-pf-label">{l}</div>
                      <div className="db-pf-val">{v ?? "—"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color:"#9ca3af",fontSize:"0.875rem",textAlign:"center",padding:"1rem"}}>Profile not loaded. Please ensure you are registered as a farmer.</p>
              )}
            </div>

            <div className="db-panel">
              <div className="db-panel-title">
                Notifications
                {notifs.length > 0 && <span className="db-badge" style={{background:"#fee2e2",color:"#dc2626"}}>{notifs.length} new</span>}
              </div>
              {notifsQ.isLoading ? (
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>{[1,2,3].map(i=><Sk key={i} h="50px"/>)}</div>
              ) : notifs.length === 0 ? (
                <p style={{color:"#9ca3af",fontSize:"0.82rem",textAlign:"center",padding:"1.5rem"}}>📭 No new notifications</p>
              ) : (
                notifs.slice(0,5).map((n: any, i: number) => (
                  <div key={n.id ?? i} className="db-notif-item">
                    <div className="db-notif-dot" style={{background: n.type==="success"?"#22c55e":n.type==="warning"?"#f59e0b":n.type==="danger"?"#ef4444":"#3b82f6"}} />
                    <div>
                      <p className="db-notif-text">{n.message ?? n.text}</p>
                      <span className="db-notif-time">{n.createdAt ?? n.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="db-charts">
            <div className="db-panel">
              <div className="db-panel-title">My Loan Applications <span>by amount</span></div>
              {loanBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={loanBarData}>
                    <CartesianGrid stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e5e7eb",fontSize:12}} />
                    <Bar dataKey="amount" fill="#2e7d32" radius={[4,4,0,0]} name="KES" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:"0.82rem"}}>
                  No loan applications yet. <Link to="/loans" style={{color:"#2e7d32",marginLeft:4,fontWeight:600}}>Apply now →</Link>
                </div>
              )}
            </div>

            <div className="db-panel">
              <div className="db-panel-title">Rainfall Pattern <span>mm/month (historical)</span></div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={RAINFALL}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="m" tick={{fontSize:11}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e5e7eb",fontSize:12}} />
                  <Line type="monotone" dataKey="mm" stroke="#2e7d32" strokeWidth={2.5} dot={{r:3,fill:"#2e7d32"}} activeDot={{r:5}} name="Rainfall (mm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>
    </Layout>
  );
}
