import { useState, useEffect } from "react";

const API_BASE = "/api/registry";

export default function RegistryApp() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemName: "", quantity: "", store: "", description: "", link: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

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
    e.preventDefault();
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
      setItems((prev) => [...prev, newItem]);
      setForm({ itemName: "", quantity: "", store: "", description: "", link: "" });
      setSuccess("Item added to registry!");
      setTimeout(() => setSuccess(null), 3000);
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
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditForm({
      itemName: item.itemName,
      quantity: item.quantity,
      store: item.store,
      description: item.description || "",
      link: item.link || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function handleUpdate(id) {
    setEditLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, quantity: Number(editForm.quantity) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      const updated = await res.json();
      setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  const inputClass = "px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
  const editInputClass = "px-2.5 py-1.5 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition w-full";

  return (
    <div className="min-h-screen bg-stone-50 font-serif text-stone-900 flex flex-col">

      {/* Header */}
      <div className="border-b-2 border-stone-900 px-8 py-5 flex-shrink-0 pt-20">
        <h1 className="text-4xl font-bold tracking-tight">Gift Registry</h1>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Registry List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 border-r border-stone-200">
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            Registry Items
            <span className="text-xs font-sans font-normal bg-stone-900 text-white rounded-full px-2.5 py-0.5">{items.length}</span>
          </h2>

          {items.length === 0 ? (
            <p className="text-stone-400 italic text-sm">No items yet. Add one using the form.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item._id} className="bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Card top */}
                  <div className="flex justify-between items-start px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-stone-900">{item.itemName}</span>
                      <span className="text-xs text-stone-400 font-sans">
                        Qty: {item.quantity}&nbsp;&nbsp;·&nbsp;&nbsp;Store: {item.store}
                      </span>
                      {item.description && (
                        <p className="text-sm text-stone-500 mt-0.5">{item.description}</p>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-0.5 font-sans transition-colors"
                        >
                          View Item →
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4 mt-0.5 flex-shrink-0">
                      <button
                        onClick={() => editingId === item._id ? cancelEdit() : startEdit(item)}
                        className="px-3 py-1.5 text-xs font-sans text-stone-600 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {editingId === item._id ? "Cancel" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1.5 text-xs font-sans text-red-500 border border-stone-200 rounded-md hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Inline edit form */}
                  {editingId === item._id && (
                    <div className="border-t border-stone-100 bg-stone-50 px-5 py-4">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex flex-col flex-1 min-w-[140px]">
                          <label className="text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide font-sans">Item Name</label>
                          <input
                            className={editInputClass}
                            value={editForm.itemName}
                            onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col w-24">
                          <label className="text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide font-sans">Qty</label>
                          <input
                            className={editInputClass}
                            type="number"
                            min="1"
                            value={editForm.quantity}
                            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-[140px]">
                          <label className="text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide font-sans">Store</label>
                          <input
                            className={editInputClass}
                            value={editForm.store}
                            onChange={(e) => setEditForm({ ...editForm, store: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex flex-col flex-1 min-w-[160px]">
                          <label className="text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide font-sans">Description</label>
                          <input
                            className={editInputClass}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Optional"
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-[160px]">
                          <label className="text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide font-sans">Link</label>
                          <input
                            className={editInputClass}
                            value={editForm.link}
                            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(item._id)}
                          disabled={editLoading}
                          className="px-4 py-1.5 bg-stone-900 text-white text-xs font-sans rounded-md hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          {editLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-1.5 text-xs font-sans text-stone-600 border border-stone-300 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: Add Form */}
        <div className="w-80 flex-shrink-0 overflow-y-auto px-8 py-6 bg-white">
          <h2 className="text-lg font-bold text-stone-700 mb-5">Add New Item</h2>

          {error && <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 rounded-md px-3 py-2 font-sans">{error}</p>}
          {success && <p className="text-emerald-600 text-sm mb-3 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 font-sans">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide font-sans">Item Name *</label>
              <input
                className={inputClass}
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g. KitchenAid Mixer"
                required
              />
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex flex-col w-24">
                <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide font-sans">Qty *</label>
                <input
                  className={inputClass}
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide font-sans">Store *</label>
                <input
                  className={inputClass}
                  name="store"
                  value={form.store}
                  onChange={handleChange}
                  placeholder="e.g. Target"
                  required
                />
              </div>
            </div>

            <div className="border-t border-stone-100 my-4" />

            <div className="flex flex-col mb-4">
              <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide font-sans">
                Description <span className="normal-case font-normal text-stone-400 tracking-normal">(optional)</span>
              </label>
              <input
                className={inputClass}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description"
              />
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide font-sans">
                Link <span className="normal-case font-normal text-stone-400 tracking-normal">(optional)</span>
              </label>
              <input
                className={inputClass}
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 bg-stone-900 text-white text-sm font-sans rounded-md hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? "Adding..." : "Add to Registry"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}