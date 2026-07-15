import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFarmers, getAllLoans, approveLoan, rejectLoan, deleteLoan,
  getAllLoanPackages, createLoanPackage, updateLoanPackage, deleteLoanPackage,
  getAllSeasons, createSeason, updateSeason, deleteSeason,
  getUser, clearSession,
  type LoanAdmin, type Farmer, type LoanPackage, type Season,
} from "@/services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "NASMS – Admin Panel" }] }),
  component: AdminPage,
});

type Tab = "overview" | "farmers" | "loans" | "packages" | "seasons";

// ─── Small reusable components ────────────────────────────────────────────────

function Badge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const map: Record<string, string> = {
    PENDING:   "bg-yellow-100 text-yellow-800",
    APPROVED:  "bg-green-100  text-green-800",
    REJECTED:  "bg-red-100    text-red-800",
    COMPLETED: "bg-blue-100   text-blue-800",
  };
  const dotMap: Record<string, string> = {
    PENDING:   "bg-yellow-400",
    APPROVED:  "bg-green-500",
    REJECTED:  "bg-red-500",
    COMPLETED: "bg-blue-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${map[s] ?? "bg-gray-100 text-gray-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[s] ?? "bg-gray-400"}`} />
      {s}
    </span>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <span className="text-4xl mb-3 leading-none">{icon}</span>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function Modal({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none p-1">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "h-10 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white outline-none w-full focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-[inherit]";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminPage() {
  const navigate = useNavigate();
  const qc       = useQueryClient();
  const [tab, setTab]           = useState<Tab>("overview");
  const [sideOpen, setSideOpen] = useState(false);

  const farmersQ  = useQuery({ queryKey: ["adm","farmers"],  queryFn: getAllFarmers,      staleTime: 60000 });
  const loansQ    = useQuery({ queryKey: ["adm","loans"],    queryFn: getAllLoans,        staleTime: 30000, refetchInterval: 60000 });
  const packagesQ = useQuery({ queryKey: ["adm","packages"], queryFn: getAllLoanPackages, staleTime: 60000 });
  const seasonsQ  = useQuery({ queryKey: ["adm","seasons"],  queryFn: getAllSeasons,      staleTime: 60000 });

  const farmers  = farmersQ.data  ?? [];
  const loans    = loansQ.data    ?? [];
  const packages = packagesQ.data ?? [];
  const seasons  = seasonsQ.data  ?? [];

  const pending  = loans.filter(l => l.status?.toUpperCase() === "PENDING").length;
  const approved = loans.filter(l => l.status?.toUpperCase() === "APPROVED").length;
  const rejected = loans.filter(l => l.status?.toUpperCase() === "REJECTED").length;
  const totalKES = loans.filter(l => l.status?.toUpperCase() === "APPROVED").reduce((s, l) => s + (l.amount ?? 0), 0);

  const invalidateLoans    = () => qc.invalidateQueries({ queryKey: ["adm","loans"] });
  const invalidatePackages = () => qc.invalidateQueries({ queryKey: ["adm","packages"] });
  const invalidateSeasons  = () => qc.invalidateQueries({ queryKey: ["adm","seasons"] });

  const approveMut = useMutation({ mutationFn: approveLoan, onSuccess: invalidateLoans });
  const rejectMut  = useMutation({ mutationFn: rejectLoan,  onSuccess: invalidateLoans });
  const delLoanMut = useMutation({ mutationFn: deleteLoan,  onSuccess: invalidateLoans });
  const delPkgMut  = useMutation({ mutationFn: (code: string) => deleteLoanPackage(code), onSuccess: invalidatePackages });
  const delSeaMut  = useMutation({ mutationFn: (id: number) => deleteSeason(id),          onSuccess: invalidateSeasons });

  const TABS: { id: Tab; icon: string; label: string; badge?: number }[] = [
    { id: "overview",  icon: "fa-chart-pie",        label: "Overview" },
    { id: "farmers",   icon: "fa-users",             label: "Farmers",       badge: farmers.length },
    { id: "loans",     icon: "fa-hand-holding-usd",  label: "Loans",         badge: pending || undefined },
    { id: "packages",  icon: "fa-box-open",          label: "Loan Packages", badge: packages.length },
    { id: "seasons",   icon: "fa-calendar-alt",      label: "Seasons",       badge: seasons.length },
  ];

  const username = getUser() ?? "Admin";
  const [collapsed, setCollapsed] = useState(false);
  function signOut() { clearSession(); void navigate({ to: "/login" }); }

  // Shared nav item — supports collapsed (icon-only) mode
  function NavItem({ id, icon, label, badge, onClick, danger }: {
    id?: Tab; icon: string; label: string; badge?: number; onClick: () => void; danger?: boolean;
  }) {
    const isActive = id && tab === id;
    const isUrgent = id === "loans" && pending > 0;
    return (
      <button
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={[
          "relative flex items-center w-full rounded-lg text-sm font-medium transition-all text-left",
          collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2",
          isActive
            ? "bg-green-400/15 text-green-400 font-bold shadow-[inset_2px_0_0_#4ade80]"
            : danger
            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
            : "text-white/50 hover:bg-white/[0.06] hover:text-white/90",
        ].join(" ")}
      >
        <i className={`fa ${icon} w-4 text-center shrink-0 text-[0.8rem] ${isActive ? "opacity-100" : "opacity-70"}`} />
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
        {!collapsed && badge != null && badge > 0 && (
          <span className={`ml-auto text-[0.6rem] font-extrabold rounded-full px-1.5 py-px min-w-[18px] text-center leading-relaxed ${
            isUrgent ? "bg-red-500 text-white" : "bg-white/10 text-white/60"
          }`}>
            {badge}
          </span>
        )}
        {collapsed && badge != null && badge > 0 && (
          <span className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full ${isUrgent ? "bg-red-500" : "bg-white/30"}`} />
        )}
      </button>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased">

      {/* Mobile scrim */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className={[
        "shrink-0 bg-[#0d1f0f] flex flex-col h-screen z-50 overflow-y-auto overflow-x-hidden",
        "transition-all duration-200 ease-in-out",
        // Desktop: toggle between full and icon-only width
        collapsed ? "lg:w-[60px]" : "lg:w-56",
        // Mobile: slide in/out from left
        "fixed top-0 left-0 lg:relative",
        sideOpen ? "w-56 translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}>

        {/* Brand + collapse toggle */}
        <div className={[
          "flex items-center border-b border-white/[0.07] shrink-0 py-4",
          collapsed ? "justify-center px-0" : "gap-3 px-4",
        ].join(" ")}>
          <div className="w-9 h-9 rounded-xl bg-green-400/15 border border-green-400/25 flex items-center justify-center text-xl shrink-0">
            🌾
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-white font-extrabold text-[0.88rem] tracking-tight truncate">NASMS</div>
              <div className="text-white/30 text-[0.58rem] uppercase tracking-widest mt-0.5 truncate">Admin Control Panel</div>
            </div>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-white/30 hover:text-white/70 hover:bg-white/10 transition-all shrink-0",
              collapsed ? "mt-0" : "ml-auto",
            ].join(" ")}
          >
            <i className={`fa ${collapsed ? "fa-angle-right" : "fa-angle-left"} text-xs`} />
          </button>
        </div>

        {/* User */}
        <div className={[
          "flex items-center border-b border-white/[0.07] shrink-0 py-3",
          collapsed ? "justify-center px-0" : "gap-2.5 px-4",
        ].join(" ")}>
          <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-base shrink-0" title={collapsed ? username : undefined}>
            🛡️
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-white text-[0.8rem] font-bold truncate">{username}</div>
              <div className="text-white/30 text-[0.58rem] uppercase tracking-wider mt-0.5">Administrator</div>
            </div>
          )}
        </div>

        {/* Main navigation */}
        <div className={`pt-4 pb-1 ${collapsed ? "px-1.5" : "px-3"}`}>
          {!collapsed && <p className="text-white/25 text-[0.58rem] font-bold uppercase tracking-[0.1em] px-1 mb-2">Navigation</p>}
          {collapsed && <div className="border-t border-white/[0.07] mb-2" />}
          <div className="flex flex-col gap-0.5">
            {TABS.map(t => (
              <NavItem key={t.id} id={t.id} icon={t.icon} label={t.label} badge={t.badge}
                onClick={() => { setTab(t.id); setSideOpen(false); }} />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* System navigation */}
        <div className={`pb-4 ${collapsed ? "px-1.5" : "px-3"}`}>
          {!collapsed && <p className="text-white/25 text-[0.58rem] font-bold uppercase tracking-[0.1em] px-1 mb-2">System</p>}
          {collapsed && <div className="border-t border-white/[0.07] mb-2" />}
          <div className="flex flex-col gap-0.5">
            {collapsed ? (
              <>
                <Link to="/" title="Public Site" className="flex items-center justify-center w-full py-2.5 rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white/90 transition-all">
                  <i className="fa fa-globe text-[0.8rem] opacity-70" />
                </Link>
                <button onClick={signOut} title="Sign Out" className="flex items-center justify-center w-full py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                  <i className="fa fa-sign-out-alt text-[0.8rem] opacity-70" />
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:bg-white/[0.06] hover:text-white/90 transition-all">
                  <i className="fa fa-globe w-4 text-center shrink-0 text-[0.8rem] opacity-70" />
                  <span>Public Site</span>
                </Link>
                <NavItem icon="fa-sign-out-alt" label="Sign Out" danger onClick={signOut} />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main body ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shrink-0 gap-4">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile: open drawer */}
            <button
              onClick={() => setSideOpen(o => !o)}
              title="Open menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all shrink-0"
            >
              <i className="fa fa-bars text-sm" />
            </button>
            {/* Desktop: toggle sidebar collapse */}
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all shrink-0"
            >
              <i className={`fa ${collapsed ? "fa-indent" : "fa-outdent"} text-sm`} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[1rem] font-extrabold text-gray-900 truncate">
                {TABS.find(t => t.id === tab)?.label}
              </h1>
              <p className="text-[0.7rem] text-gray-400 mt-px">
                {new Date().toLocaleDateString("en-KE", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pending > 0 && (
              <button
                onClick={() => setTab("loans")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 animate-pulse hover:bg-amber-100 transition-colors whitespace-nowrap"
              >
                <i className="fa fa-bell" /> {pending} pending
              </button>
            )}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <span className="text-base leading-none">🛡️</span>
              <span className="text-[0.8rem] font-semibold text-gray-700 whitespace-nowrap">{username}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {tab === "overview" && (
            <OverviewTab
              loans={loans} farmers={farmers} packages={packages} seasons={seasons}
              pending={pending} approved={approved} rejected={rejected} totalKES={totalKES}
              setTab={setTab} approveMut={approveMut} rejectMut={rejectMut}
            />
          )}
          {tab === "farmers"  && <FarmersTab  farmers={farmers}   isLoading={farmersQ.isLoading}  isError={farmersQ.isError} refetch={farmersQ.refetch} />}
          {tab === "loans"    && <LoansTab    loans={loans}       isLoading={loansQ.isLoading}    approveMut={approveMut} rejectMut={rejectMut} delLoanMut={delLoanMut} />}
          {tab === "packages" && <PackagesTab packages={packages} seasons={seasons} isLoading={packagesQ.isLoading} delPkgMut={delPkgMut} invalidate={invalidatePackages} />}
          {tab === "seasons"  && <SeasonsTab  seasons={seasons}   loans={loans}     isLoading={seasonsQ.isLoading}  delSeaMut={delSeaMut} invalidate={invalidateSeasons} />}
        </main>
      </div>
    </div>
  );
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ loans, farmers, packages, seasons, pending, approved, rejected, totalKES, setTab, approveMut, rejectMut }: any) {
  const pieData = [
    { name: "Pending",   value: pending,  color: "#eab308" },
    { name: "Approved",  value: approved, color: "#22c55e" },
    { name: "Rejected",  value: rejected, color: "#ef4444" },
    { name: "Completed", value: loans.filter((l: any) => l.status?.toUpperCase() === "COMPLETED").length, color: "#3b82f6" },
  ].filter(d => d.value > 0);

  const monthlyData = (() => {
    const map: Record<string, number> = {};
    loans.forEach((l: any) => {
      if (!l.issuedDate) return;
      const mo = new Date(l.issuedDate).toLocaleDateString("en-KE", { month:"short", year:"2-digit" });
      map[mo] = (map[mo] ?? 0) + 1;
    });
    return Object.entries(map).slice(-6).map(([m, count]) => ({ m, count }));
  })();

  const STATS = [
    { icon:"👨‍🌾", label:"Registered Farmers",   value: farmers.length,                              color:"text-green-700",  bg:"bg-green-50" },
    { icon:"📋", label:"Total Applications",     value: loans.length,                               color:"text-blue-700",   bg:"bg-blue-50" },
    { icon:"⏳", label:"Pending Approval",       value: pending,                                    color:"text-amber-700",  bg:"bg-amber-50" },
    { icon:"✅", label:"Approved Loans",         value: approved,                                   color:"text-green-700",  bg:"bg-green-50" },
    { icon:"💵", label:"Total Disbursed",        value:`KES ${(totalKES/1_000_000).toFixed(2)}M`,   color:"text-purple-700", bg:"bg-purple-50" },
    { icon:"📦", label:"Loan Packages",          value: packages.length,                            color:"text-sky-700",    bg:"bg-sky-50" },
    { icon:"🗓️", label:"Active Seasons",        value: seasons.filter((s: any) => s.active).length, color:"text-emerald-700",bg:"bg-emerald-50" },
    { icon:"❌", label:"Rejected Loans",         value: rejected,                                   color:"text-red-700",    bg:"bg-red-50" },
  ];

  const pendingLoans = loans.filter((l: any) => l.status?.toUpperCase() === "PENDING");

  return (
    <div className="animate-[fadeIn_.25s_ease] space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Panel key={s.label} className="!p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${s.bg}`}>{s.icon}</div>
            </div>
            <div className={`text-2xl font-extrabold tracking-tight leading-none ${s.color}`}>{s.value}</div>
          </Panel>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Loan Status Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={82} innerRadius={40}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: any, n: any) => [v + " loans", n]} />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : <Empty icon="📊" text="No loan data yet" />}
        </Panel>

        <Panel>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Monthly Loan Applications</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={monthlyData} margin={{ top:5, right:16, left:0, bottom:0 }}>
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2.5} dot={{ r:4, fill:"#16a34a" }} name="Applications" />
              </LineChart>
            </ResponsiveContainer>
          ) : <Empty icon="📈" text="Not enough data" />}
        </Panel>

        <Panel>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Farmers by County (Top 6)</h3>
          {farmers.length > 0 ? (() => {
            const map: Record<string,number> = {};
            farmers.forEach((f: any) => { if (f.county) map[f.county] = (map[f.county] ?? 0) + 1; });
            const data = Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,6).map(([county,count]) => ({ county: county.substring(0,12), count }));
            return (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data} layout="vertical" margin={{ top:0, right:16, left:0, bottom:0 }}>
                  <CartesianGrid stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="county" tick={{ fontSize:11 }} axisLine={false} tickLine={false} width={78} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#16a34a" radius={[0,4,4,0]} name="Farmers" />
                </BarChart>
              </ResponsiveContainer>
            );
          })() : <Empty icon="👨‍🌾" text="No farmer data yet" />}
        </Panel>

        <Panel>
          <h3 className="text-sm font-bold text-gray-900 mb-4">Season Budget Allocation</h3>
          {seasons.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={seasons.slice(0,6).map((s: any) => ({ name:(s.seasonName??"").substring(0,12), budget: s.budget/1_000_000 }))} margin={{ top:0, right:16, left:0, bottom:0 }}>
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} unit="M" width={38} />
                <Tooltip formatter={(v: any) => [`KES ${v}M`, "Budget"]} />
                <Bar dataKey="budget" fill="#059669" radius={[4,4,0,0]} name="Budget (KES M)" />
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty icon="🗓️" text="No season data yet" />}
        </Panel>
      </div>

      {/* Pending table */}
      <Panel>
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-gray-900">⏳ Pending Loan Approvals ({pendingLoans.length})</h3>
          <button onClick={() => setTab("loans")} className="text-xs font-semibold text-green-700 hover:text-green-900 transition-colors">
            View All Loans →
          </button>
        </div>
        {pendingLoans.length === 0
          ? <Empty icon="🎉" text="No pending loans — all caught up!" />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {["#","Farmer","National ID","County","Amount","Package","Applied","Actions"].map(h => (
                      <th key={h} className="text-left px-3.5 py-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 border-b-2 border-gray-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingLoans.slice(0,8).map((l: any) => (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-3.5 py-3 text-gray-400 text-xs">#{l.id}</td>
                      <td className="px-3.5 py-3 font-semibold text-gray-900">{l.farmer?.fullName ?? l.farmer?.name ?? "—"}</td>
                      <td className="px-3.5 py-3 text-gray-600">{l.farmer?.nationalId ?? "—"}</td>
                      <td className="px-3.5 py-3 text-gray-600">{l.farmer?.county ?? "—"}</td>
                      <td className="px-3.5 py-3 font-bold text-gray-900">KES {l.amount?.toLocaleString()}</td>
                      <td className="px-3.5 py-3"><code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">{l.loanPackage?.loanCode ?? "—"}</code></td>
                      <td className="px-3.5 py-3 text-gray-500">{l.issuedDate ? new Date(l.issuedDate).toLocaleDateString("en-KE") : "—"}</td>
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => approveMut.mutate(l.id)} disabled={approveMut.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-xs font-bold hover:bg-green-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                            {approveMut.isPending ? <Spinner /> : "✓ Approve"}
                          </button>
                          <button onClick={() => rejectMut.mutate(l.id)} disabled={rejectMut.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                            {rejectMut.isPending ? <Spinner /> : "✗ Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Panel>
    </div>
  );
}

// ─── Farmers Tab ──────────────────────────────────────────────────────────────
function FarmersTab({ farmers, isLoading, isError, refetch }: any) {
  const [search,         setSearch]         = useState("");
  const [countyFilter,   setCountyFilter]   = useState("");
  const [farmTypeFilter, setFarmTypeFilter] = useState("");

  const counties  = [...new Set(farmers.map((f: any) => f.county).filter(Boolean))].sort() as string[];
  const farmTypes = [...new Set(farmers.map((f: any) => f.farmType).filter(Boolean))].sort() as string[];

  const filtered = farmers.filter((f: any) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || (f.fullName ?? f.name ?? "").toLowerCase().includes(q)
      || String(f.nationalId ?? "").includes(q)
      || (f.email ?? "").toLowerCase().includes(q)
      || (f.phoneNumber ?? "").includes(q);
    return matchSearch && (!countyFilter || f.county === countyFilter) && (!farmTypeFilter || f.farmType === farmTypeFilter);
  });

  return (
    <div className="space-y-4 animate-[fadeIn_.25s_ease]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Registered Farmers</h2>
          <p className="text-sm text-gray-500 mt-0.5">{farmers.length} farmers on NASMS</p>
        </div>
        <button onClick={refetch}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors">
          <i className="fa fa-sync-alt" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          <input className={`${inputCls} pl-9`} placeholder="Search by name, ID, email, phone…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={`${selectCls} w-auto`} value={countyFilter} onChange={e => setCountyFilter(e.target.value)}>
          <option value="">All Counties</option>
          {counties.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className={`${selectCls} w-auto`} value={farmTypeFilter} onChange={e => setFarmTypeFilter(e.target.value)}>
          <option value="">All Farm Types</option>
          {farmTypes.map(t => <option key={t}>{t}</option>)}
        </select>
        {(search || countyFilter || farmTypeFilter) && (
          <button onClick={() => { setSearch(""); setCountyFilter(""); setFarmTypeFilter(""); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors">
            Clear
          </button>
        )}
      </div>

      <Panel className="!p-0 overflow-hidden">
        {isLoading ? <Empty icon="⏳" text="Loading farmers…" /> :
         isError   ? <Empty icon="⚠️" text="Failed to load farmers. Click Refresh to try again." /> :
         filtered.length === 0 ? <Empty icon="👨‍🌾" text="No farmers match your search." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["#","Full Name","National ID","Phone","Email","County","Sub-County","Farm Type","Farm Size","Title No.","Registered"].map(h => (
                    <th key={h} className="text-left px-3.5 py-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 border-b-2 border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f: Farmer, i: number) => (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3.5 py-3 text-gray-400 text-xs">{i+1}</td>
                    <td className="px-3.5 py-3 font-semibold text-gray-900">{f.fullName ?? f.name}</td>
                    <td className="px-3.5 py-3"><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-700">{f.nationalId}</code></td>
                    <td className="px-3.5 py-3 text-gray-600">{f.phoneNumber ?? "—"}</td>
                    <td className="px-3.5 py-3 text-gray-600">{f.email ?? "—"}</td>
                    <td className="px-3.5 py-3 text-gray-600">{f.county ?? "—"}</td>
                    <td className="px-3.5 py-3 text-gray-600">{f.subCounty ?? "—"}</td>
                    <td className="px-3.5 py-3">
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{f.farmType ?? "—"}</span>
                    </td>
                    <td className="px-3.5 py-3 text-gray-600">{f.farmSize ? `${f.farmSize} ac` : "—"}</td>
                    <td className="px-3.5 py-3 text-gray-600">{f.titleNumber ?? "—"}</td>
                    <td className="px-3.5 py-3 text-gray-500">{f.registeredDate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="text-xs text-gray-400 text-right px-5 py-3 border-t border-gray-100">
            Showing {filtered.length} of {farmers.length} farmers
          </div>
        )}
      </Panel>
    </div>
  );
}

// ─── Loans Tab ────────────────────────────────────────────────────────────────
function LoansTab({ loans, isLoading, approveMut, rejectMut, delLoanMut }: any) {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = loans.filter((l: any) => {
    const matchStatus = status === "ALL" || l.status?.toUpperCase() === status;
    const q = search.toLowerCase();
    const matchSearch = !q
      || (l.farmer?.fullName ?? "").toLowerCase().includes(q)
      || (l.farmer?.name ?? "").toLowerCase().includes(q)
      || String(l.id).includes(q)
      || (l.loanPackage?.loanCode ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts: Record<string,number> = {
    ALL:       loans.length,
    PENDING:   loans.filter((l: any) => l.status?.toUpperCase() === "PENDING").length,
    APPROVED:  loans.filter((l: any) => l.status?.toUpperCase() === "APPROVED").length,
    REJECTED:  loans.filter((l: any) => l.status?.toUpperCase() === "REJECTED").length,
    COMPLETED: loans.filter((l: any) => l.status?.toUpperCase() === "COMPLETED").length,
  };
  const pending = counts.PENDING;

  const pillBase = "relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all";

  return (
    <div className="space-y-4 animate-[fadeIn_.25s_ease]">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">Loan Applications</h2>
        <p className="text-sm text-gray-500 mt-0.5">Review, approve or reject farmer loan applications</p>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {(["ALL","PENDING","APPROVED","REJECTED","COMPLETED"] as const).map(s => {
          const isActive  = status === s;
          const isUrgent  = s === "PENDING" && pending > 0;
          return (
            <button key={s} onClick={() => setStatus(s)}
              className={[
                pillBase,
                isActive && isUrgent  ? "bg-amber-600 text-white border-amber-600" :
                isActive              ? "bg-green-700 text-white border-green-700" :
                isUrgent              ? "text-amber-700 border-amber-300 bg-amber-50 hover:border-amber-500" :
                                        "text-gray-500 border-gray-200 bg-white hover:border-green-600 hover:text-green-700",
              ].join(" ")}
            >
              {isUrgent && !isActive && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />}
              {s}
              <span className={`text-[0.62rem] font-extrabold rounded-full px-1.5 py-px leading-relaxed ${
                isActive ? "bg-white/20 text-white" : "bg-black/6 text-current"
              }`}>{counts[s]}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        <input className={`${inputCls} pl-9`} placeholder="Search by farmer name, loan ID or package code…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Panel className="!p-0 overflow-hidden">
        {isLoading ? <Empty icon="⏳" text="Loading loans…" /> :
         filtered.length === 0 ? <Empty icon="📋" text="No loans match your filter." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["ID","Farmer","National ID","County","Amount","Interest","Duration","Package","Issued","Due","Status","Actions"].map(h => (
                    <th key={h} className="text-left px-3.5 py-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400 border-b-2 border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l: LoanAdmin) => (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3.5 py-3 text-gray-400 text-xs">#{l.id}</td>
                    <td className="px-3.5 py-3 font-semibold text-gray-900">{l.farmer?.fullName ?? l.farmer?.name ?? "—"}</td>
                    <td className="px-3.5 py-3 text-gray-600">{l.farmer?.nationalId ?? "—"}</td>
                    <td className="px-3.5 py-3 text-gray-600">{l.farmer?.county ?? "—"}</td>
                    <td className="px-3.5 py-3 font-bold text-gray-900">KES {l.amount?.toLocaleString()}</td>
                    <td className="px-3.5 py-3 text-gray-600">{l.interestRate}%</td>
                    <td className="px-3.5 py-3 text-gray-600">{l.durationMonths} mo</td>
                    <td className="px-3.5 py-3"><code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">{l.loanPackage?.loanCode ?? "—"}</code></td>
                    <td className="px-3.5 py-3 text-gray-500">{l.issuedDate ? new Date(l.issuedDate).toLocaleDateString("en-KE") : "—"}</td>
                    <td className="px-3.5 py-3 text-gray-500">{l.dueDate    ? new Date(l.dueDate).toLocaleDateString("en-KE")    : "—"}</td>
                    <td className="px-3.5 py-3"><Badge status={l.status} /></td>
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5">
                        {l.status?.toUpperCase() === "PENDING" && (
                          <>
                            <button onClick={() => approveMut.mutate(l.id)} disabled={approveMut.isPending}
                              className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-bold hover:bg-green-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">✓</button>
                            <button onClick={() => rejectMut.mutate(l.id)} disabled={rejectMut.isPending}
                              className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">✗</button>
                          </>
                        )}
                        <button
                          onClick={() => { if (confirm(`Delete loan #${l.id}? This cannot be undone.`)) delLoanMut.mutate(l.id); }}
                          className="px-2 py-1 rounded-md border border-gray-200 text-gray-400 text-xs hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="text-xs text-gray-400 text-right px-5 py-3 border-t border-gray-100">
            Showing {filtered.length} of {loans.length} loans
          </div>
        )}
      </Panel>
    </div>
  );
}

// ─── Packages Tab ─────────────────────────────────────────────────────────────
function PackagesTab({ packages, seasons, isLoading, delPkgMut, invalidate }: any) {
  const [modal,   setModal]   = useState<"create"|"edit"|null>(null);
  const [editing, setEditing] = useState<LoanPackage|null>(null);
  const [form, setForm] = useState({ loanCode:"", amount:"", interestRate:"", durationMonths:"", monthlyPenalty:"", description:"", seasonId:"" });
  const [err,  setErr]  = useState("");

  const createMut = useMutation({
    mutationFn: (d: any) => createLoanPackage(d),
    onSuccess: () => { invalidate(); closeModal(); },
    onError:   (e: any) => setErr(e.message ?? "Failed to create package."),
  });
  const updateMut = useMutation({
    mutationFn: ({ code, data }: any) => updateLoanPackage(code, data),
    onSuccess: () => { invalidate(); closeModal(); },
    onError:   (e: any) => setErr(e.message ?? "Failed to update package."),
  });

  function openCreate() {
    setForm({ loanCode:"", amount:"", interestRate:"", durationMonths:"", monthlyPenalty:"", description:"", seasonId:"" });
    setErr(""); setEditing(null); setModal("create");
  }
  function openEdit(p: LoanPackage) {
    setForm({ loanCode: p.loanCode, amount: String(p.amount), interestRate: String(p.interestRate), durationMonths: String(p.durationMonths), monthlyPenalty: String(p.monthlyPenalty), description: p.description ?? "", seasonId: String(p.farmingSeason?.id ?? "") });
    setErr(""); setEditing(p); setModal("edit");
  }
  function closeModal() { setModal(null); setEditing(null); setErr(""); }

  function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const payload = { amount: +form.amount, interestRate: +form.interestRate, durationMonths: +form.durationMonths, monthlyPenalty: +form.monthlyPenalty, description: form.description, farmingSeason: form.seasonId ? { id: +form.seasonId } : undefined };
    if (modal === "edit" && editing) updateMut.mutate({ code: editing.loanCode, data: payload });
    else createMut.mutate({ ...payload, loanCode: form.loanCode });
  }

  const busy = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-4 animate-[fadeIn_.25s_ease]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Loan Packages</h2>
          <p className="text-sm text-gray-500 mt-0.5">Define loan products available to farmers each season</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors">
          <i className="fa fa-plus" /> New Package
        </button>
      </div>

      {isLoading ? <Empty icon="⏳" text="Loading packages…" /> :
       packages.length === 0 ? (
        <Panel className="text-center py-12">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No Loan Packages Yet</h3>
          <p className="text-sm text-gray-500 mb-5">Create your first loan package so farmers can apply for loans.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors">
            <i className="fa fa-plus" /> Create First Package
          </button>
        </Panel>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.map((p: LoanPackage) => (
            <Panel key={p.loanCode} className="flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <code className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">{p.loanCode}</code>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-green-600 hover:text-green-700 transition-colors text-xs">
                    <i className="fa fa-edit" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete ${p.loanCode}?`)) delPkgMut.mutate(p.loanCode); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors text-xs">
                    🗑
                  </button>
                </div>
              </div>
              <div className="text-2xl font-extrabold text-green-900 tracking-tight">KES {p.amount?.toLocaleString()}</div>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{p.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Interest",   `${p.interestRate}%`],
                  ["Duration",   `${p.durationMonths} mo`],
                  ["Penalty/mo", `KES ${p.monthlyPenalty?.toLocaleString()}`],
                  ["Season",     p.farmingSeason?.seasonName ?? "Open"],
                ].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                    <span className="block text-[0.6rem] text-gray-400 uppercase tracking-wider mb-0.5">{label}</span>
                    <strong className="text-xs text-gray-700 font-semibold">{val}</strong>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
       )
      }

      <Modal open={modal !== null} title={modal === "edit" ? `Edit: ${editing?.loanCode}` : "Create Loan Package"} onClose={closeModal}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {modal === "create" && (
              <div className="col-span-2">
                <Field label="Loan Code *">
                  <input className={inputCls} placeholder="e.g. AGR-2026-01" value={form.loanCode} onChange={e => setForm(f => ({ ...f, loanCode: e.target.value }))} required />
                </Field>
              </div>
            )}
            <Field label="Amount (KES) *">
              <input className={inputCls} type="number" placeholder="100000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </Field>
            <Field label="Interest Rate (%) *">
              <input className={inputCls} type="number" step="0.1" placeholder="5" value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} required />
            </Field>
            <Field label="Duration (months) *">
              <input className={inputCls} type="number" placeholder="12" value={form.durationMonths} onChange={e => setForm(f => ({ ...f, durationMonths: e.target.value }))} required />
            </Field>
            <Field label="Monthly Penalty (KES) *">
              <input className={inputCls} type="number" placeholder="500" value={form.monthlyPenalty} onChange={e => setForm(f => ({ ...f, monthlyPenalty: e.target.value }))} required />
            </Field>
            <div className="col-span-2">
              <Field label="Linked Season">
                <select className={selectCls} value={form.seasonId} onChange={e => setForm(f => ({ ...f, seasonId: e.target.value }))}>
                  <option value="">No season (open)</option>
                  {seasons.map((s: Season) => <option key={s.id} value={s.id}>{s.seasonName}</option>)}
                </select>
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Description *">
                <input className={inputCls} placeholder="Brief description of this loan package" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </Field>
            </div>
          </div>
          {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 text-sm">{err}</div>}
          <button type="submit" disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
            {busy ? <><Spinner /> Saving…</> : modal === "edit" ? "Save Changes" : "Create Package"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

// ─── Seasons Tab ──────────────────────────────────────────────────────────────
function SeasonsTab({ seasons, loans, isLoading, delSeaMut, invalidate }: any) {
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState<Season|null>(null);
  const [form, setForm] = useState({ seasonName:"", startDate:"", endDate:"", budget:"" });
  const [err,  setErr]  = useState("");

  const createMut = useMutation({
    mutationFn: (d: any) => createSeason(d),
    onSuccess: () => { invalidate(); closeModal(); },
    onError:   (e: any) => setErr(e.message ?? "Failed to create season."),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => updateSeason(id, data),
    onSuccess: () => { invalidate(); closeModal(); },
    onError:   (e: any) => setErr(e.message ?? "Failed to update season."),
  });

  function openCreate() {
    setForm({ seasonName:"", startDate:"", endDate:"", budget:"" });
    setErr(""); setEditing(null); setModal(true);
  }
  function openEdit(s: Season) {
    setForm({ seasonName: s.seasonName, startDate: String(s.startDate ?? ""), endDate: String(s.endDate ?? ""), budget: String(s.budget) });
    setErr(""); setEditing(s); setModal(true);
  }
  function closeModal() { setModal(false); setEditing(null); setErr(""); }

  function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const payload = { seasonName: form.seasonName, startDate: form.startDate, endDate: form.endDate, budget: +form.budget };
    if (editing) updateMut.mutate({ id: editing.id, data: payload });
    else         createMut.mutate(payload);
  }

  const busy = createMut.isPending || updateMut.isPending;

  function getStatus(s: Season) {
    if (s.closed) return { label:"Closed",   cls:"bg-red-100   text-red-700" };
    if (s.active) return { label:"Active",   cls:"bg-green-100 text-green-700" };
    return              { label:"Upcoming", cls:"bg-amber-100 text-amber-700" };
  }

  return (
    <div className="space-y-4 animate-[fadeIn_.25s_ease]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Farming Seasons</h2>
          <p className="text-sm text-gray-500 mt-0.5">Seasons define when loans are available and their budget allocation</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors">
          <i className="fa fa-plus" /> New Season
        </button>
      </div>

      {isLoading ? <Empty icon="⏳" text="Loading seasons…" /> :
       seasons.length === 0 ? (
        <Panel className="text-center py-12">
          <div className="text-5xl mb-4">🗓️</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No Seasons Yet</h3>
          <p className="text-sm text-gray-500 mb-5">Create a farming season first — loan packages are linked to seasons.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors">
            <i className="fa fa-plus" /> Create First Season
          </button>
        </Panel>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {seasons.map((s: Season) => {
            const st = getStatus(s);
            const seasonLoans = loans.filter((l: any) => l.farmingSeason?.id === s.id);
            const disbursed   = seasonLoans.filter((l: any) => l.status === "APPROVED").reduce((sum: number, l: any) => sum + (l.amount ?? 0), 0);
            const pct = s.budget > 0 ? Math.min(100, Math.round((disbursed / s.budget) * 100)) : 0;
            const barColor = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-400" : "bg-green-500";
            return (
              <Panel key={s.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(s)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-green-600 hover:text-green-700 transition-colors text-xs">
                      <i className="fa fa-edit" />
                    </button>
                    <button onClick={() => { if (confirm(`Delete "${s.seasonName}"?`)) delSeaMut.mutate(s.id); }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors text-xs">
                      🗑
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{s.seasonName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">📅 {s.startDate} → {s.endDate}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Budget",       `KES ${(s.budget/1_000_000).toFixed(1)}M`],
                    ["Applications", seasonLoans.length],
                    ["Disbursed",    `KES ${(disbursed/1000).toFixed(0)}K`],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-gray-50 rounded-lg px-2.5 py-2 text-center">
                      <span className="block text-[0.58rem] text-gray-400 uppercase tracking-wider mb-0.5">{label}</span>
                      <strong className="text-xs text-gray-700 font-semibold">{val}</strong>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[0.68rem] text-gray-500 mb-1">
                    <span>Budget utilisation</span><span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width:`${pct}%` }} />
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
       )
      }

      <Modal open={modal} title={editing ? `Edit: ${editing.seasonName}` : "Create Farming Season"} onClose={closeModal}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Season Name *">
            <input className={inputCls} placeholder="e.g. Long Rains 2026" value={form.seasonName} onChange={e => setForm(f => ({ ...f, seasonName: e.target.value }))} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date *">
              <input className={inputCls} type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
            </Field>
            <Field label="End Date *">
              <input className={inputCls} type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
            </Field>
          </div>
          <Field label="Budget (KES) *">
            <input className={inputCls} type="number" placeholder="e.g. 50000000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} required />
          </Field>
          {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 text-sm">{err}</div>}
          <button type="submit" disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
            {busy ? <><Spinner /> Saving…</> : editing ? "Save Changes" : "Create Season"}
          </button>
        </form>
      </Modal>
    </div>
  );
}