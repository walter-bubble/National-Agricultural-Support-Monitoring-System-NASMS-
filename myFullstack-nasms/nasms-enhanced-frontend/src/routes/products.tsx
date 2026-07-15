import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { PRODUCTS, type Availability, type Product } from "@/data/products";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "NASMS – Farm Inputs" }] }),
  component: ProductsPage,
});

const AVAIL_LABEL: Record<Availability, [string, string]> = {
  in: ["avail-in", "✔ In Stock"],
  limited: ["avail-limited", "⚠ Limited Stock"],
  out: ["avail-out", "✗ Out of Stock"],
};

function ProductsPage() {
  const [cat, setCat] = useState("");
  const [avail, setAvail] = useState("");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Product | null>(null);
  const [qty, setQty] = useState("");
  const [loc, setLoc] = useState("");

  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        const s = search.toLowerCase();
        return (
          (!cat || p.category === cat) &&
          (!avail || p.avail === avail) &&
          (!s || p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s))
        );
      }),
    [cat, avail, search],
  );

  function submitRequest(e: FormEvent) {
    e.preventDefault();
    if (!qty || Number(qty) < 1) return alert("Please enter a valid quantity.");
    if (!loc.trim()) return alert("Please enter your delivery location.");
    alert(`✅ Request for ${qty} unit(s) of "${active?.name}" submitted to: ${loc}`);
    setActive(null);
    setQty("");
    setLoc("");
  }

  return (
    <Layout>
      <main className="section">
        <div className="section-inner">
          <div className="section-label">Farm Inputs Catalogue</div>
          <h2 className="section-title animate">Government-Subsidised Agricultural Inputs</h2>
          <p className="section-sub animate">
            Access certified and subsidised seeds, fertilizers, and equipment through your NASMS
            account.
          </p>

          <div className="filter-row animate">
            <select className="filter-select" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All Categories</option>
              <option value="seed">Seeds</option>
              <option value="fertilizer">Fertilizers</option>
              <option value="pesticide">Pesticides</option>
              <option value="equipment">Equipment</option>
            </select>
            <select className="filter-select" value={avail} onChange={(e) => setAvail(e.target.value)}>
              <option value="">All Availability</option>
              <option value="in">In Stock</option>
              <option value="limited">Limited</option>
              <option value="out">Out of Stock</option>
            </select>
            <input
              type="text" className="filter-select" placeholder="🔍  Search products…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: 200 }}
            />
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-light)", padding: 32 }}>
              No products match your filters.
            </p>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => {
                const [cls, lbl] = AVAIL_LABEL[p.avail];
                return (
                  <div key={p.id} className="product-card">
                    <div className="product-img">{p.icon}</div>
                    <div className="product-body">
                      <div className="category">{p.cat}</div>
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                      <div className="product-footer">
                        <span className={cls}>{lbl}</span>
                        {p.avail === "out" ? (
                          <button
                            className="btn-sm"
                            style={{ background: "#ccc", cursor: "not-allowed" }}
                            disabled
                          >
                            Notify Me
                          </button>
                        ) : (
                          <button className="btn-sm" onClick={() => setActive(p)}>Request</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={`Request: ${active?.name ?? ""}`}
      >
        <form onSubmit={submitRequest}>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number" min="1" placeholder="e.g. 5"
              value={qty} onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginTop: 14 }}>
            <label>Delivery Location</label>
            <input
              type="text" placeholder="Your ward / sub-location"
              value={loc} onChange={(e) => setLoc(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-full" style={{ marginTop: 20 }}>
            <i className="fa fa-check" /> Confirm Request
          </button>
        </form>
      </Modal>
    </Layout>
  );
}
