import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { getMarketListings, createMarketListing, getRole, getUser, type MarketListing } from "@/services/api";

export const Route = createFileRoute("/market")({
  head: () => ({ meta: [{ title: "NASMS – Marketplace" }] }),
  component: MarketPage,
});

type Tab = "listings" | "sell";

function MarketPage() {
  const qc  = useQueryClient();
  const role = getRole();
  const user = getUser();
  const [tab, setTab] = useState<Tab>("listings");
  const [contact, setContact] = useState<MarketListing|null>(null);
  const [msg, setMsg] = useState("");
  const [phone, setPhone] = useState("");
  const [listForm, setListForm] = useState({ productName:"", productCode:"", quantity:"", price:"" });
  const [listErr, setListErr] = useState("");

  const listingsQ = useQuery({
    queryKey: ["market","listings"],
    queryFn:  getMarketListings,
    staleTime: 2*60*1000,
  });

  const createMut = useMutation({
    mutationFn: (d: Partial<MarketListing>) => createMarketListing(d),
    onSuccess: () => { qc.invalidateQueries({queryKey:["market","listings"]}); setListForm({productName:"",productCode:"",quantity:"",price:""}); setListErr("✅ Listing created successfully!"); },
    onError: (e: any) => setListErr(e.message ?? "Failed to create listing."),
  });

  function submitContact(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()||!phone.trim()) return;
    alert(`✅ Inquiry sent for "${contact?.productName}". The seller will contact you on ${phone} within 24 hours.`);
    setContact(null); setMsg(""); setPhone("");
  }

  function submitListing(e: React.FormEvent) {
    e.preventDefault();
    setListErr("");
    if (!listForm.productName||!listForm.productCode||!listForm.quantity||!listForm.price) {
      setListErr("Please fill in all fields."); return;
    }
    createMut.mutate({
      productName: listForm.productName,
      productCode: listForm.productCode,
      quantity: parseFloat(listForm.quantity),
      price: parseFloat(listForm.price),
      sellerName: user ?? "Farmer",
    });
  }

  const listings = listingsQ.data ?? [];

  return (
    <Layout>
      <main className="section">
        <div className="section-inner">
          <div className="section-label">Agricultural Marketplace</div>
          <h2 className="section-title animate">Buyers &amp; Sellers</h2>
          <p className="section-sub animate">Connect with verified buyers or list your produce directly from the farm.</p>

          <div className="mkt-tabs animate">
            <button className={`mkt-tab${tab==="listings"?" active":""}`} onClick={()=>setTab("listings")}>🛒 Browse Listings</button>
            {(role==="SELLER"||role==="FARMER") && (
              <button className={`mkt-tab${tab==="sell"?" active":""}`} onClick={()=>setTab("sell")}>📦 Sell Produce</button>
            )}
          </div>

          {/* Browse Listings */}
          {tab==="listings" && (
            <div>
              {listingsQ.isError && <div className="mkt-error">⚠️ Could not load listings. <button onClick={()=>listingsQ.refetch()}>Retry</button></div>}
              {listingsQ.isLoading ? (
                <div className="mkt-grid">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="mkt-card" style={{minHeight:200}}>
                      <div style={{height:16,background:"#f3f4f6",borderRadius:6,marginBottom:12,animation:"shimmer 1.4s infinite"}} />
                      <div style={{height:24,width:"60%",background:"#f3f4f6",borderRadius:6,marginBottom:8,animation:"shimmer 1.4s infinite"}} />
                      <div style={{height:14,background:"#f3f4f6",borderRadius:6,marginBottom:6,animation:"shimmer 1.4s infinite"}} />
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="mkt-empty"><span>📭</span><p>No market listings yet. Be the first to list your produce!</p></div>
              ) : (
                <div className="mkt-grid">
                  {listings.map((l,i) => (
                    <div key={l.id??i} className="mkt-card animate">
                      <div className="mkt-card-top">
                        <div className="mkt-product-badge">{l.productCode}</div>
                        <div className="mkt-seller">{l.sellerName ?? "Farmer"}</div>
                      </div>
                      <h3 className="mkt-product-name">{l.productName}</h3>
                      <div className="mkt-details">
                        <div className="mkt-detail"><span>Quantity</span><strong>{l.quantity} kg</strong></div>
                        <div className="mkt-detail"><span>Price</span><strong>KES {l.price?.toLocaleString()}/kg</strong></div>
                      </div>
                      <div className="mkt-total">Total value: KES {((l.quantity??0)*(l.price??0)).toLocaleString()}</div>
                      <button className="mkt-btn" onClick={()=>setContact(l)}>📞 Contact Seller</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sell Produce */}
          {tab==="sell" && (
            <div className="mkt-sell-panel animate">
              <h3>List Your Produce</h3>
              <p>Fill in the details below and buyers will be able to find and contact you.</p>
              <form onSubmit={submitListing} className="mkt-sell-form">
                <div className="mkt-form-grid">
                  {[
                    {key:"productName", label:"Product Name *",  type:"text",   ph:"e.g. Maize, Beans, Tomatoes"},
                    {key:"productCode", label:"Product Code *",  type:"text",   ph:"e.g. MAIZE-001"},
                    {key:"quantity",    label:"Quantity (kg) *", type:"number", ph:"e.g. 500"},
                    {key:"price",       label:"Price per kg (KES) *", type:"number", ph:"e.g. 45"},
                  ].map(f => (
                    <div key={f.key} className="mkt-form-field">
                      <label>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} value={(listForm as any)[f.key]}
                        onChange={e=>setListForm(p=>({...p,[f.key]:e.target.value}))} required />
                    </div>
                  ))}
                </div>
                {listErr && <div className={`mkt-form-msg${listErr.startsWith("✅")?" success":""}`}>{listErr}</div>}
                <button type="submit" className="mkt-submit-btn" disabled={createMut.isPending}>
                  {createMut.isPending ? "Creating Listing…" : "📦 Create Listing"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Modal open={contact!==null} onClose={()=>setContact(null)} title={`Inquire: ${contact?.productName??""}`}>
        <div className="mkt-modal-info">
          <span>📦 {contact?.quantity} kg</span>
          <span>💰 KES {contact?.price}/kg</span>
          <span>👤 {contact?.sellerName}</span>
        </div>
        <form onSubmit={submitContact}>
          <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",marginBottom:14}}>
            <label style={{fontSize:"0.8rem",fontWeight:600,color:"#374151"}}>Your Message</label>
            <textarea rows={4} placeholder="I am interested in buying your produce. What is the minimum order?" value={msg} onChange={e=>setMsg(e.target.value)} style={{padding:"0.65rem 0.875rem",border:"1.5px solid #d1d5db",borderRadius:8,fontSize:"0.875rem",resize:"vertical",fontFamily:"inherit"}} />
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
            <label style={{fontSize:"0.8rem",fontWeight:600,color:"#374151"}}>Your Phone Number</label>
            <input type="tel" placeholder="+254 7XX XXX XXX" value={phone} onChange={e=>setPhone(e.target.value)} style={{height:42,padding:"0 0.875rem",border:"1.5px solid #d1d5db",borderRadius:8,fontSize:"0.875rem"}} />
          </div>
          <button type="submit" style={{marginTop:16,width:"100%",height:44,background:"#2e7d32",color:"#fff",border:"none",borderRadius:9,fontSize:"0.9rem",fontWeight:700,cursor:"pointer"}}>
            <i className="fa fa-paper-plane" /> Send Inquiry
          </button>
        </form>
      </Modal>

      <style>{`
        @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
        .mkt-tabs{display:flex;gap:0.5rem;margin-bottom:2rem;}
        .mkt-tab{padding:0.6rem 1.5rem;border-radius:20px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.875rem;font-weight:600;color:#6b7280;cursor:pointer;transition:all 0.15s;font-family:inherit;}
        .mkt-tab:hover{border-color:#2e7d32;color:#2e7d32;}
        .mkt-tab.active{background:#2e7d32;color:#fff;border-color:#2e7d32;}
        .mkt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;}
        .mkt-card{background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:1.5rem;display:flex;flex-direction:column;gap:0.75rem;transition:box-shadow 0.15s,transform 0.15s;}
        .mkt-card:hover{box-shadow:0 6px 20px rgba(0,0,0,0.08);transform:translateY(-2px);}
        .mkt-card-top{display:flex;align-items:center;justify-content:space-between;}
        .mkt-product-badge{background:#dcfce7;color:#16a34a;font-size:0.72rem;font-weight:700;padding:2px 10px;border-radius:20px;}
        .mkt-seller{font-size:0.75rem;color:#9ca3af;}
        .mkt-product-name{font-size:1.1rem;font-weight:800;color:#111827;}
        .mkt-details{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;}
        .mkt-detail{background:#f9fafb;border-radius:8px;padding:0.5rem 0.75rem;}
        .mkt-detail span{font-size:0.65rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:2px;}
        .mkt-detail strong{font-size:0.875rem;color:#374151;font-weight:700;}
        .mkt-total{font-size:0.78rem;color:#6b7280;background:#fffbeb;border-radius:6px;padding:0.4rem 0.75rem;}
        .mkt-btn{width:100%;padding:0.75rem;border-radius:10px;border:none;background:#1b5e20;color:#fff;font-size:0.875rem;font-weight:700;cursor:pointer;transition:background 0.15s;font-family:inherit;}
        .mkt-btn:hover{background:#2e7d32;}
        .mkt-empty{text-align:center;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem;color:#9ca3af;}
        .mkt-empty span{font-size:3rem;}
        .mkt-empty p{font-size:0.875rem;}
        .mkt-error{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:0.75rem 1rem;color:#dc2626;font-size:0.82rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:0.5rem;}
        .mkt-error button{background:none;border:none;color:#dc2626;font-weight:700;cursor:pointer;margin-left:auto;}
        .mkt-sell-panel{background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:2rem;max-width:600px;}
        .mkt-sell-panel h3{font-size:1rem;font-weight:800;color:#111827;margin-bottom:0.35rem;}
        .mkt-sell-panel p{font-size:0.82rem;color:#6b7280;margin-bottom:1.5rem;}
        .mkt-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}
        @media(max-width:500px){.mkt-form-grid{grid-template-columns:1fr;}}
        .mkt-form-field{display:flex;flex-direction:column;gap:0.3rem;}
        .mkt-form-field label{font-size:0.8rem;font-weight:600;color:#374151;}
        .mkt-form-field input{height:42px;padding:0 0.875rem;border:1.5px solid #d1d5db;border-radius:9px;font-size:0.875rem;outline:none;transition:border-color 0.15s;font-family:inherit;}
        .mkt-form-field input:focus{border-color:#2e7d32;box-shadow:0 0 0 3px rgba(46,125,50,0.12);}
        .mkt-form-msg{padding:0.65rem 0.875rem;border-radius:8px;font-size:0.82rem;font-weight:600;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;margin-bottom:0.75rem;}
        .mkt-form-msg.success{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0;}
        .mkt-submit-btn{width:100%;height:46px;background:#2e7d32;color:#fff;border:none;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;transition:background 0.15s;font-family:inherit;}
        .mkt-submit-btn:hover:not(:disabled){background:#1b5e20;}
        .mkt-submit-btn:disabled{opacity:0.65;cursor:not-allowed;}
        .mkt-modal-info{display:flex;gap:0.75rem;flex-wrap:wrap;background:#f0fdf4;border-radius:8px;padding:0.75rem;margin-bottom:1rem;}
        .mkt-modal-info span{font-size:0.82rem;color:#16a34a;font-weight:600;}
      `}</style>
    </Layout>
  );
}
