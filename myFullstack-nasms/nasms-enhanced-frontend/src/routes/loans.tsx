import React, { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import {
  getLoans, getMyApplications, applyForLoan, joinLoanWaitlist, getRole,
  type LoanPackage, type Application, type ApplyPayload,
} from "@/services/api";

export const Route = createFileRoute("/loans")({
  head: () => ({ meta: [{ title: "NASMS – Government Loans" }] }),
  component: LoansPage,
});

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const styles: Record<string,{bg:string;color:string}> = {
    APPROVED: {bg:"#dcfce7",color:"#16a34a"},
    PENDING:  {bg:"#fef3c7",color:"#d97706"},
    REJECTED: {bg:"#fee2e2",color:"#dc2626"},
    COMPLETED:{bg:"#dbeafe",color:"#2563eb"},
    OPEN:     {bg:"#dcfce7",color:"#16a34a"},
  };
  const st = styles[s] ?? {bg:"#f3f4f6",color:"#6b7280"};
  return <span style={{...st,padding:"3px 10px",borderRadius:20,fontSize:"0.72rem",fontWeight:700}}>{status}</span>;
}

function LoanCardSkeleton() {
  return (
    <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e7eb",padding:"1.5rem"}}>
      {[80,120,60,40,40].map((w,i) => (
        <div key={i} style={{height:i===0?20:i===1?32:i===2?14:36,width:`${w}%`,borderRadius:6,marginBottom:12,background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite"}} />
      ))}
    </div>
  );
}

function LoansPage() {
  const qc = useQueryClient();
  const role = getRole();
  const isFarmer = !role || role === "FARMER";

  const packagesQ = useQuery({
    queryKey: ["loans","packages"],
    queryFn:  getLoans,
    staleTime: 5*60*1000,
  });
  const appsQ = useQuery({
    queryKey: ["loans","applications"],
    queryFn:  getMyApplications,
    enabled: isFarmer,
  });

  const applyMut = useMutation({
    mutationFn: (p: ApplyPayload) => applyForLoan(p),
    onSuccess: () => { qc.invalidateQueries({queryKey:["loans","applications"]}); setModal(null); },
    onError: (e: any) => setFormErr(e.message ?? "Submission failed."),
  });
  const waitlistMut = useMutation({
    mutationFn: (p: {loanProductId:number;loanName:string}) => joinLoanWaitlist(p),
    onSuccess: (_,vars) => setWaitlisted(s=>new Set(s).add(vars.loanProductId)),
  });

  const [modal, setModal]     = useState<LoanPackage|null>(null);
  const [amount, setAmount]   = useState("");
  const [purpose, setPurpose] = useState("");
  const [formErr, setFormErr] = useState("");
  const [waitlisted, setWaitlisted] = useState<Set<number>>(new Set());

  const openModal = useCallback((pkg: LoanPackage) => {
    setModal(pkg); setAmount(""); setPurpose(""); setFormErr("");
  }, []);

  function submitLoan(e: React.FormEvent) {
    e.preventDefault(); setFormErr("");
    const amt = Number(amount.replace(/,/g,""));
    if (!amt || amt < 1000) { setFormErr("Enter a valid amount (min KES 1,000)."); return; }
    if (!purpose.trim())    { setFormErr("Please describe how you will use the funds."); return; }
    if (!modal) return;
    applyMut.mutate({
      loanProductId: modal.loanCode,
      loanName: modal.description ?? modal.loanCode,
      amount: amt,
      purpose: purpose.trim(),
    });
  }

  const packages = packagesQ.data ?? [];
  const apps     = appsQ.data     ?? [];

  return (
    <Layout>
      <main className="section">
        <div className="section-inner">
          <div className="section-label">Financial Services</div>
          <h2 className="section-title animate">Government Loan Programs</h2>
          <p className="section-sub animate">Access affordable, government-backed credit designed to support Kenya's agricultural sector.</p>

          {/* Stats bar */}
          {apps.length > 0 && (
            <div className="ln-stats-bar animate">
              {[
                { label:"Total Applied",  value: apps.length },
                { label:"Approved",       value: apps.filter(a=>a.status?.toUpperCase()==="APPROVED").length,  color:"#16a34a" },
                { label:"Pending",        value: apps.filter(a=>a.status?.toUpperCase()==="PENDING").length,   color:"#d97706" },
                { label:"Total Amount",   value:`KES ${apps.reduce((s,a)=>s+a.amount,0).toLocaleString()}` },
              ].map(s => (
                <div key={s.label} className="ln-stat-item">
                  <div className="ln-stat-val" style={s.color?{color:s.color}:{}}>{s.value}</div>
                  <div className="ln-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Loan packages */}
          {packagesQ.isError && (
            <div className="ln-error animate"><i className="fa fa-exclamation-circle" /> Could not load loan programs. <button onClick={()=>packagesQ.refetch()}>Retry</button></div>
          )}
          <div className="ln-grid">
            {packagesQ.isPending
              ? [1,2,3,4].map(i => <LoanCardSkeleton key={i} />)
              : packages.length === 0
              ? <div className="ln-empty"><span>📭</span><p>No loan packages available at the moment.</p></div>
              : packages.map((pkg,i) => {
                  const wl = waitlisted.has(i);
                  return (
                    <div key={pkg.loanCode} className="ln-card animate">
                      <div className="ln-card-hdr">
                        <div>
                          <div className="ln-card-code">{pkg.loanCode}</div>
                          <div className="ln-card-amount">KES {pkg.amount?.toLocaleString()}</div>
                        </div>
                        <StatusBadge status="Open" />
                      </div>
                      <p className="ln-card-desc">{pkg.description}</p>
                      <div className="ln-card-details">
                        {[
                          ["Interest",  `${pkg.interestRate}%`],
                          ["Duration",  `${pkg.durationMonths} months`],
                          ["Penalty",   `KES ${pkg.monthlyPenalty?.toLocaleString()}/mo`],
                          ["Season",    pkg.farmingSeason?.seasonName ?? "Open"],
                        ].map(([k,v]) => (
                          <div key={k} className="ln-detail">
                            <span>{k}</span><strong>{v}</strong>
                          </div>
                        ))}
                      </div>
                      {isFarmer ? (
                        wl
                          ? <button className="ln-btn-muted" disabled>✓ On Waitlist</button>
                          : <button className="ln-btn-primary" onClick={() => openModal(pkg)}>Apply Now →</button>
                      ) : (
                        <div className="ln-note">Log in as a farmer to apply.</div>
                      )}
                    </div>
                  );
                })
            }
          </div>

          {/* My Applications */}
          {isFarmer && (
            <div className="ln-applications animate">
              <div className="ln-app-hdr">
                <h3>My Loan Applications</h3>
                {appsQ.isRefetching && <span className="ln-refreshing">Refreshing…</span>}
              </div>
              {appsQ.isError && <div className="ln-error"><i className="fa fa-exclamation-circle" /> Could not load your applications. <button onClick={()=>appsQ.refetch()}>Retry</button></div>}
              <div className="ln-table-wrap">
                <table className="ln-table">
                  <thead><tr><th>Loan Package</th><th>Amount</th><th>Applied</th><th>Status</th><th>Due Date</th></tr></thead>
                  <tbody>
                    {appsQ.isPending
                      ? [1,2].map(i => <tr key={i}>{[1,2,3,4,5].map(j => <td key={j}><div style={{height:16,borderRadius:4,background:"#f3f4f6"}} /></td>)}</tr>)
                      : apps.length === 0
                      ? <tr><td colSpan={5} style={{textAlign:"center",color:"#9ca3af",padding:"2rem"}}>No applications yet. Apply above to get started.</td></tr>
                      : apps.map(a => (
                          <tr key={a.id}>
                            <td>{a.loanName}</td>
                            <td><strong>KES {a.amount?.toLocaleString()}</strong></td>
                            <td>{a.applied}</td>
                            <td><StatusBadge status={a.status} /></td>
                            <td>{a.due}</td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal open={modal!==null} onClose={() => { if(!applyMut.isPending) setModal(null); }} title={`Apply: ${modal?.loanCode ?? ""}`}>
        <form onSubmit={submitLoan}>
          <div className="ln-modal-info">
            <span>💰 Up to KES {modal?.amount?.toLocaleString()}</span>
            <span>📅 {modal?.durationMonths} months</span>
            <span>📈 {modal?.interestRate}% interest</span>
          </div>
          <div className="ln-form-group">
            <label>Requested Amount (KES)</label>
            <input type="text" inputMode="numeric" placeholder="e.g. 150,000"
              value={amount} onChange={e => { if(/^[\d,]*$/.test(e.target.value)) setAmount(e.target.value); }}
              onBlur={e => { const c=e.target.value.replace(/[^\d]/g,""); setAmount(c?Number(c).toLocaleString():""); }}
              disabled={applyMut.isPending}
            />
          </div>
          <div className="ln-form-group" style={{marginTop:14}}>
            <label>Purpose of Loan</label>
            <textarea rows={3} placeholder="How will you use these funds? Be specific…"
              value={purpose} onChange={e=>setPurpose(e.target.value)} disabled={applyMut.isPending} />
          </div>
          {formErr && <div className="ln-form-error"><i className="fa fa-exclamation-circle" /> {formErr}</div>}
          <button type="submit" className="ln-btn-primary" style={{marginTop:16,width:"100%"}} disabled={applyMut.isPending}>
            {applyMut.isPending ? <><i className="fa fa-spinner fa-spin" /> Submitting…</> : <><i className="fa fa-paper-plane" /> Submit Application</>}
          </button>
        </form>
      </Modal>

      <style>{`
        @keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}
        .ln-stats-bar{display:flex;gap:1px;background:#e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:2rem;}
        .ln-stat-item{flex:1;background:#fff;padding:1rem;text-align:center;}
        .ln-stat-val{font-size:1.4rem;font-weight:800;color:#111827;}
        .ln-stat-label{font-size:0.7rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;}
        .ln-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;margin-bottom:2rem;}
        .ln-card{background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:1.5rem;display:flex;flex-direction:column;gap:0.875rem;transition:box-shadow 0.15s,transform 0.15s;}
        .ln-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);transform:translateY(-2px);}
        .ln-card-hdr{display:flex;align-items:flex-start;justify-content:space-between;}
        .ln-card-code{font-size:0.75rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;}
        .ln-card-amount{font-size:1.6rem;font-weight:800;color:#1b5e20;}
        .ln-card-desc{font-size:0.85rem;color:#6b7280;line-height:1.5;flex:1;}
        .ln-card-details{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;}
        .ln-detail{background:#f9fafb;border-radius:8px;padding:0.5rem 0.75rem;display:flex;flex-direction:column;gap:2px;}
        .ln-detail span{font-size:0.65rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;}
        .ln-detail strong{font-size:0.82rem;color:#374151;font-weight:700;}
        .ln-btn-primary{width:100%;padding:0.75rem;border-radius:10px;border:none;background:#2e7d32;color:#fff;font-size:0.875rem;font-weight:700;cursor:pointer;transition:background 0.15s;display:flex;align-items:center;justify-content:center;gap:0.4rem;font-family:inherit;}
        .ln-btn-primary:hover:not(:disabled){background:#1b5e20;}
        .ln-btn-primary:disabled{opacity:0.65;cursor:not-allowed;}
        .ln-btn-muted{width:100%;padding:0.75rem;border-radius:10px;border:1.5px solid #e5e7eb;background:#f9fafb;color:#9ca3af;font-size:0.875rem;font-weight:600;cursor:not-allowed;font-family:inherit;}
        .ln-note{font-size:0.78rem;color:#9ca3af;text-align:center;padding:0.5rem;}
        .ln-applications{background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:1.5rem;margin-bottom:1rem;}
        .ln-app-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .ln-app-hdr h3{font-size:0.95rem;font-weight:700;color:#111827;}
        .ln-refreshing{font-size:0.75rem;color:#9ca3af;}
        .ln-table-wrap{overflow-x:auto;}
        .ln-table{width:100%;border-collapse:collapse;font-size:0.82rem;}
        .ln-table th{text-align:left;padding:0.6rem 0.75rem;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;border-bottom:1px solid #f3f4f6;}
        .ln-table td{padding:0.75rem;border-bottom:1px solid #f9fafb;color:#374151;}
        .ln-table tr:last-child td{border-bottom:none;}
        .ln-table tr:hover td{background:#f9fafb;}
        .ln-error{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:0.75rem 1rem;font-size:0.82rem;color:#dc2626;display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;}
        .ln-error button{background:none;border:none;color:#dc2626;font-weight:600;cursor:pointer;margin-left:auto;}
        .ln-empty{grid-column:1/-1;text-align:center;padding:3rem;display:flex;flex-direction:column;align-items:center;gap:0.75rem;color:#9ca3af;}
        .ln-empty span{font-size:2.5rem;}
        .ln-modal-info{display:flex;gap:0.75rem;flex-wrap:wrap;background:#f0fdf4;border-radius:8px;padding:0.75rem;margin-bottom:1rem;}
        .ln-modal-info span{font-size:0.82rem;color:#16a34a;font-weight:600;}
        .ln-form-group{display:flex;flex-direction:column;gap:0.3rem;}
        .ln-form-group label{font-size:0.8rem;font-weight:600;color:#374151;}
        .ln-form-group input,.ln-form-group textarea{width:100%;padding:0.65rem 0.875rem;border:1.5px solid #d1d5db;border-radius:8px;font-size:0.875rem;color:#111827;background:#fafafa;outline:none;transition:border-color 0.15s;box-sizing:border-box;font-family:inherit;}
        .ln-form-group input:focus,.ln-form-group textarea:focus{border-color:#2e7d32;box-shadow:0 0 0 3px rgba(46,125,50,0.12);}
        .ln-form-error{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:8px;padding:0.6rem 0.875rem;font-size:0.82rem;margin-top:0.5rem;display:flex;align-items:center;gap:0.4rem;}
      `}</style>
    </Layout>
  );
}
