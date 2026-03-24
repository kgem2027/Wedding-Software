import { useState, useEffect } from "react";

const API_BASE = "/api/registry"; // adjust this to match your Express route prefix

export default function RegistryApp() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemName: "", quantity: "", store: "", description: "", link: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all registry items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError("Failed to load registry items.");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault(); // no page reload
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: form.itemName,
          quantity: Number(form.quantity),
          store: form.store,
          description: form.description,
          link: form.link,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]); // add to list without reload
      setForm({ itemName: "", quantity: "", store: "", description: "", link: "" }); // clear form
      setSuccess("Item added to registry!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Gift Registry</h1>

      {/* ADD ITEM FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.sectionTitle}>Add New Item</h2>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Item Name *</label>
            <input
              style={styles.input}
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="e.g. KitchenAid Mixer"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Quantity *</label>
            <input
              style={styles.input}
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="1"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Store *</label>
            <input
              style={styles.input}
              name="store"
              value={form.store}
              onChange={handleChange}
              placeholder="e.g. Target"
              required
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <input
            style={styles.input}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional description"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Link</label>
          <input
            style={styles.input}
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.successMsg}>{success}</p>}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add to Registry"}
        </button>
      </form>

      {/* REGISTRY LIST */}
      <div style={styles.list}>
        <h2 style={styles.sectionTitle}>Registry Items ({items.length})</h2>
        {items.length === 0 ? (
          <p style={styles.empty}>No items yet. Add one above!</p>
        ) : (
          items.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.cardInfo}>
                <strong style={styles.itemName}>{item.itemName}</strong>
                <span style={styles.meta}>Qty: {item.quantity} &nbsp;|&nbsp; Store: {item.store}</span>
                {item.description && <p style={styles.desc}>{item.description}</p>}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noreferrer" style={styles.link}>
                    View Item →
                  </a>
                )}
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(item._id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", height: "100vh", maxWidth: 780, margin: "0 auto", padding: "2rem 1.5rem 0", fontFamily: "Georgia, serif", color: "#1a1a1a", boxSizing: "border-box" },
  title: { fontSize: "2.2rem", fontWeight: "bold", marginBottom: "2rem", borderBottom: "2px solid #1a1a1a", paddingBottom: "0.5rem", flexShrink: 0 },
  sectionTitle: { fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem", color: "#333" },
  form: { background: "#92a5e8", border: "1px solid #ddd", borderRadius: 8, padding: "1.5rem", marginBottom: "2rem", flexShrink: 0 },
  row: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", flex: 1, minWidth: 160, marginBottom: "1rem" },
  label: { fontSize: "0.85rem", fontWeight: "bold", marginBottom: 4, color: "#444" },
  input: { padding: "0.5rem 0.75rem", border: "1px solid #ccc", borderRadius: 5, fontSize: "1rem", fontFamily: "inherit", outline: "none" },
  button: { marginTop: "0.5rem", padding: "0.65rem 1.5rem", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 5, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" },
  error: { color: "#c0392b", marginBottom: "0.5rem" },
  successMsg: { color: "#27ae60", marginBottom: "0.5rem" },
  list: { flex: 1, overflowY: "auto", paddingBottom: "2rem" },
  card: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1rem 1.25rem", border: "1px solid #e0e0e0", borderRadius: 7, marginBottom: "0.75rem", background: "#fff" },
  cardInfo: { display: "flex", flexDirection: "column", gap: 4 },
  itemName: { fontSize: "1.1rem" },
  meta: { fontSize: "0.85rem", color: "#666" },
  desc: { fontSize: "0.9rem", color: "#444", margin: 0 },
  link: { fontSize: "0.85rem", color: "#2563eb" },
  deleteBtn: { background: "none", border: "1px solid #ccc", borderRadius: 5, padding: "0.35rem 0.75rem", cursor: "pointer", color: "#c0392b", fontSize: "0.85rem", whiteSpace: "nowrap" },
  empty: { color: "#999", fontStyle: "italic" },
};