import { useState, useEffect } from "react";

const API_BASE = "/api/registry";

export default function RegistryApp() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemName: "", quantity: "", store: "", description: "", link: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-stone-50 font-serif text-stone-900">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 border-b-2 border-stone-900 pb-4 pt-10">
          <h1 className="text-4xl font-bold tracking-tight">Gift Registry</h1>
        </div>

        {/* Add Item Form */}
        <div className="bg-indigo-200 border border-indigo-300 rounded-xl p-6 mb-10 shadow-sm">
          <h2 className="text-lg font-bold text-stone-800 mb-5">Add New Item</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex flex-col flex-1 min-w-[160px]">
                <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Item Name *</label>
                <input
                  className="px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  placeholder="e.g. KitchenAid Mixer"
                  required
                />
              </div>

              <div className="flex flex-col w-28">
                <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Qty *</label>
                <input
                  className="px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
              </div>

              <div className="flex flex-col flex-1 min-w-[160px]">
                <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Store *</label>
                <input
                  className="px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  name="store"
                  value={form.store}
                  onChange={handleChange}
                  placeholder="e.g. Target"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Description</label>
              <input
                className="px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </div>

            <div className="flex flex-col mb-5">
              <label className="text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Link</label>
              <input
                className="px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-3">{error}</p>
            )}
            {success && (
              <p className="text-emerald-600 text-sm mb-3">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-stone-900 text-white text-sm font-sans rounded-md hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? "Adding..." : "Add to Registry"}
            </button>
          </form>
        </div>

        {/* Registry List */}
        <div>
          <h2 className="text-lg font-bold text-stone-700 mb-4">
            Registry Items
            <span className="ml-2 text-sm font-normal text-stone-400">({items.length})</span>
          </h2>

          {items.length === 0 ? (
            <p className="text-stone-400 italic text-sm">No items yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-start bg-white border border-stone-200 rounded-lg px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                >
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

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="ml-4 mt-0.5 px-3 py-1.5 text-xs font-sans text-red-500 border border-stone-200 rounded-md hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
