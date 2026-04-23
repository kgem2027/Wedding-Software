import { useState, useEffect } from "react";

const WEDDINGS_API = "/api/weddings";
const REGISTRY_API = "/api/registry";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function RegistryApp() {
  const [user, setUser] = useState(null); // { _id, role, name }

  const [weddings, setWeddings] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [weddingsLoading, setWeddingsLoading] = useState(true);

  const [items, setItems] = useState([]);
  const [registryLoading, setRegistryLoading] = useState(false);

  const [form, setForm] = useState({ itemName: "", quantity: "", store: "", description: "", link: "" });
  const [formLoading, setFormLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
  }, []);


  useEffect(() => {
    if (!user) return;
    setWeddingsLoading(true);
    fetch(WEDDINGS_API, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((data) => {
        const accessible = data.filter(w =>
          w.accessList?.some(a => String(a.userId?._id ?? a.userId) === String(user._id))
        );
        setWeddings(accessible);
        if (accessible.length === 1) setSelectedWedding(accessible[0]);
      })
      .catch(() => setError("Failed to load your weddings."))
      .finally(() => setWeddingsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedWedding) return;
    setRegistryLoading(true);
    setItems([]);
    fetch(`${REGISTRY_API}/registryItemsByWeddingId/${selectedWedding._id}`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setError("Failed to load registry items."))
      .finally(() => setRegistryLoading(false));
  }, [selectedWedding]);

  const canEdit   = user?.role === "admin" || user?.role === "planner";
  const canManage = canEdit || user?.role === "client";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null); setFormLoading(true);
    try {
      const res = await fetch(REGISTRY_API, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          weddingId: selectedWedding._id,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Something went wrong"); }
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
      setForm({ itemName: "", quantity: "", store: "", description: "", link: "" });
      setSuccess("Item added!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${REGISTRY_API}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i._id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id) {
    setEditLoading(true);
    try {
      const res = await fetch(`${REGISTRY_API}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...editForm, quantity: Number(editForm.quantity) }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Update failed"); }
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  // ── Shared classes ────────────────────────────────────────────────────────────
  const inputClass =
    "px-3 py-2 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
  const editInputClass =
    "px-2.5 py-1.5 border border-stone-300 rounded-md text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition w-full";

  if (!user) {
    return (
      <div className="h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Gift Registry</h1>
          <p className="text-stone-400 text-sm font-sans">Please log in to view your registry.</p>
        </div>
      </div>
    );
  }

  if (weddingsLoading) {
    return (
      <div className="h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-400">
        <p className="text-sm font-sans italic">Loading your weddings…</p>
      </div>
    );
  }

  if (weddings.length === 0) {
    return (
      <div className="h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Gift Registry</h1>
          <p className="text-stone-400 text-sm font-sans">You don't have access to any weddings yet.</p>
        </div>
      </div>
    );
  }

  if (!selectedWedding) {
    return (
      <div className="h-screen bg-stone-50 font-serif text-stone-900 flex flex-col">
        <div className="border-b-2 border-stone-900 px-8 py-5 pt-20">
          <h1 className="text-4xl font-bold tracking-tight">Gift Registry</h1>
          <p className="text-sm text-stone-500 font-sans mt-1">Select a wedding to view its registry</p>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-2xl">
          <ul className="space-y-3">
            {weddings.map((w) => (
              <li key={w._id}>
                <button
                  onClick={() => setSelectedWedding(w)}
                  className="w-full text-left bg-white border border-stone-200 rounded-lg px-6 py-5 shadow-sm hover:shadow-md hover:border-stone-400 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-stone-900 group-hover:text-indigo-700 transition-colors">
                        {w.weddingName}
                      </p>
                      <p className="text-sm text-stone-400 font-sans mt-0.5">{w.weddingDate}</p>
                      {w.plannerId?.name && (
                        <p className="text-xs text-stone-400 font-sans mt-0.5">Planner: {w.plannerId.name}</p>
                      )}
                    </div>
                    <span className="text-stone-300 group-hover:text-indigo-400 transition-colors text-xl">→</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-50 font-serif text-stone-900 flex flex-col">

      {/* Header */}
      <div className="border-b-2 border-stone-900 px-8 py-5 pt-20 flex items-end justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {weddings.length > 1 && (
              <button
                onClick={() => { setSelectedWedding(null); setItems([]); setError(null); }}
                className="text-xs font-sans text-stone-400 hover:text-stone-700 transition-colors"
              >
                ← All Weddings
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{selectedWedding.weddingName}</h1>
          <div className="flex gap-4 mt-1 text-sm text-stone-400 font-sans">
            <span>{selectedWedding.weddingDate}</span>
            {selectedWedding.plannerId?.name && <span>Planner: {selectedWedding.plannerId.name}</span>}
            <span className="capitalize">{selectedWedding.privacy}</span>
          </div>
        </div>
        <span className="text-xs font-sans text-stone-400 capitalize bg-stone-100 px-2.5 py-1 rounded-full">
          {user.role}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Registry list */}
        <div className="flex-1 overflow-y-auto px-8 py-6 border-r border-stone-200">
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            Registry Items
            <span className="text-xs font-sans font-normal bg-stone-900 text-white rounded-full px-2.5 py-0.5">
              {items.length}
            </span>
          </h2>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2 font-sans">
              {error}
            </p>
          )}

          {registryLoading ? (
            <p className="text-stone-400 italic text-sm font-sans">Loading registry…</p>
          ) : items.length === 0 ? (
            <p className="text-stone-400 italic text-sm">No items yet.{canManage ? " Add one using the form." : ""}</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Card top */}
                  <div className="flex justify-between items-start px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-base font-semibold ${item.bought ? "line-through text-stone-400" : "text-stone-900"}`}>
                          {item.itemName}
                        </span>
                        {item.bought ? (
                          <span className="text-xs font-sans bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                            Bought by {item.boughtBy}
                          </span>
                        ) : (
                          <span className="text-xs font-sans bg-stone-100 text-stone-400 border border-stone-200 rounded-full px-2 py-0.5">
                            Available
                          </span>
                        )}
                      </div>
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

                    {canManage && (
                      <div className="flex gap-2 ml-4 mt-0.5 flex-shrink-0">
                        {canEdit && <button
                          onClick={() =>
                            editingId === item._id
                              ? (setEditingId(null), setEditForm({}))
                              : (setEditingId(item._id),
                                setEditForm({
                                  itemName: item.itemName,
                                  quantity: item.quantity,
                                  store: item.store,
                                  description: item.description || "",
                                  link: item.link || "",
                                }))
                          }
                          className="px-3 py-1.5 text-xs font-sans text-stone-600 border border-stone-200 rounded-md hover:border-stone-400 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {editingId === item._id ? "Cancel" : "Edit"}
                        </button>}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-3 py-1.5 text-xs font-sans text-red-500 border border-stone-200 rounded-md hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {canEdit && editingId === item._id && (
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
                          {editLoading ? "Saving…" : "Save Changes"}
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditForm({}); }}
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

        <div className="w-80 flex-shrink-0 overflow-y-auto px-8 py-6 bg-white">

          {(() => {
            const isWeddingPlanner = (selectedWedding.plannerId?._id || selectedWedding.plannerId) === user?._id
            const isWeddingClient = selectedWedding.accessList?.some(
              a => (a.userId?._id || a.userId) === user?._id && a.role === 'client'
            )
            return (isWeddingPlanner || isWeddingClient) && selectedWedding.authPassword ? (
              <div className="mb-5 px-3 py-2.5 bg-pink-50 border border-pink-100 rounded-lg flex items-center gap-2">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wide font-sans">Auth Code</span>
                <span className="text-xs font-mono text-pink-600 bg-pink-100 px-2 py-0.5 rounded select-all">
                  {selectedWedding.authPassword}
                </span>
              </div>
            ) : null
          })()}

          {canManage ? (
            <>
              <h2 className="text-lg font-bold text-stone-700 mb-5">Add New Item</h2>

              {success && (
                <p className="text-emerald-600 text-sm mb-3 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 font-sans">
                  {success}
                </p>
              )}

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
                  disabled={formLoading}
                  className="w-full px-6 py-2.5 bg-stone-900 text-white text-sm font-sans rounded-md hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {formLoading ? "Adding…" : "Add to Registry"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-stone-700 mb-5">Wedding Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">Wedding</p>
                  <p className="text-sm text-stone-800">{selectedWedding.weddingName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">Date</p>
                  <p className="text-sm text-stone-800">{selectedWedding.weddingDate}</p>
                </div>
                {selectedWedding.plannerId?.name && (
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">Planner</p>
                    <p className="text-sm text-stone-800">{selectedWedding.plannerId.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">Privacy</p>
                  <p className="text-sm text-stone-800 capitalize">{selectedWedding.privacy}</p>
                </div>
                <div className="border-t border-stone-100 pt-4">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide font-sans mb-0.5">Guests on Registry</p>
                  <p className="text-sm text-stone-800">{selectedWedding.accessList?.length ?? 0} people</p>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}