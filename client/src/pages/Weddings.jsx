import { useState, useEffect } from 'react'
import axios from 'axios'

const Weddings = () => {
  const [weddings, setWeddings] = useState([])
  const [registryItems, setRegistryItems] = useState({})
  const [loadingRegistry, setLoadingRegistry] = useState({})
  const [selectedWeddingId, setSelectedWeddingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [modalData, setModalData] = useState({ weddingName: '', weddingDate: '', privacy: 'private' })
  const [modalError, setModalError] = useState('')
  const [modalLoading, setModalLoading] = useState(false)

  const [addItemModalOpen, setAddItemModalOpen] = useState(false)
  const [addItemWeddingId, setAddItemWeddingId] = useState(null)
  const [itemForm, setItemForm] = useState({ itemName: '', quantity: 1, store: '', description: '', link: '' })
  const [itemError, setItemError] = useState('')
  const [itemLoading, setItemLoading] = useState(false)

  const [vendorModalOpen, setVendorModalOpen] = useState(false)
  const [vendorWeddingId, setVendorWeddingId] = useState(null)
  const [vendorSelected, setVendorSelected] = useState('')
  const [vendorList, setVendorList] = useState([])
  const [vendorError, setVendorError] = useState('')
  const [vendorLoading, setVendorLoading] = useState(false)

  const token = localStorage.getItem('token')
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  const canEdit = user?.role === 'admin' || user?.role === 'planner'
  const isAdmin = user?.role === 'admin'

  useEffect(() => { fetchWeddings() }, [])

  const fetchWeddings = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get('/api/weddings', authHeaders)
      setWeddings(res.data)
    } catch {
      setError('Failed to load weddings.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistry = async (weddingId) => {
    if (registryItems[weddingId]) return
    setLoadingRegistry(prev => ({ ...prev, [weddingId]: true }))
    try {
      const res = await axios.get(`/api/registry/registryItemsByWeddingId/${weddingId}`, authHeaders)
      setRegistryItems(prev => ({ ...prev, [weddingId]: res.data }))
    } catch {
      setRegistryItems(prev => ({ ...prev, [weddingId]: [] }))
    } finally {
      setLoadingRegistry(prev => ({ ...prev, [weddingId]: false }))
    }
  }

  const handleRowClick = (weddingId) => {
    if (selectedWeddingId === weddingId) {
      setSelectedWeddingId(null)
    } else {
      setSelectedWeddingId(weddingId)
      fetchRegistry(weddingId)
    }
  }

  const initials = (name = '') =>
    name.split('&').map(s => s.trim()[0]).join('').toUpperCase().slice(0, 2) || '?'

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // ── Wedding Modal ──
  const openAddModal = () => {
    setModalMode('add')
    setModalData({ weddingName: '', weddingDate: '', privacy: 'private' })
    setModalError('')
    setModalOpen(true)
  }

  const openEditModal = (wedding, e) => {
    e.stopPropagation()
    setModalMode('edit')
    setModalData({ weddingName: wedding.weddingName, weddingDate: wedding.weddingDate?.slice(0, 10), privacy: wedding.privacy, _id: wedding._id })
    setModalError('')
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setModalError('') }

  const handleSave = async () => {
    if (!modalData.weddingName || !modalData.weddingDate) {
      setModalError('Name and date are required.')
      return
    }
    setModalLoading(true)
    setModalError('')
    try {
      if (modalMode === 'add') {
        await axios.post('/api/weddings/create', {
          weddingName: modalData.weddingName,
          weddingDate: modalData.weddingDate,
          privacy: modalData.privacy,
          plannerId: user?._id,
          accessList: []
        }, authHeaders)
      } else {
        await axios.put(`/api/weddings/${modalData._id}`, {
          weddingName: modalData.weddingName,
          weddingDate: modalData.weddingDate,
          privacy: modalData.privacy
        }, authHeaders)
      }
      closeModal()
      fetchWeddings()
    } catch (err) {
      setModalError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this wedding?')) return
    try {
      await axios.delete(`/api/weddings/${id}`, authHeaders)
      fetchWeddings()
      if (selectedWeddingId === id) setSelectedWeddingId(null)
    } catch {
      alert('Failed to delete wedding.')
    }
  }

  // ── Add Registry Item Modal ──
  const openAddItemModal = (weddingId, e) => {
    e.stopPropagation()
    setAddItemWeddingId(weddingId)
    setItemForm({ itemName: '', quantity: 1, store: '', description: '', link: '' })
    setItemError('')
    setAddItemModalOpen(true)
  }

  const handleAddItem = async () => {
    if (!itemForm.itemName || !itemForm.store) {
      setItemError('Item name and store are required.')
      return
    }
    setItemLoading(true)
    setItemError('')
    try {
      const res = await axios.post('/api/registry', { ...itemForm, weddingId: addItemWeddingId }, authHeaders)
      setRegistryItems(prev => ({
        ...prev,
        [addItemWeddingId]: [...(prev[addItemWeddingId] || []), res.data]
      }))
      setAddItemModalOpen(false)
    } catch (err) {
      setItemError(err.response?.data?.error || 'Failed to add item.')
    } finally {
      setItemLoading(false)
    }
  }

  const handleDeleteItem = async (itemId, weddingId, e) => {
    e.stopPropagation()
    try {
      await axios.delete(`/api/registry/${itemId}`, authHeaders)
      setRegistryItems(prev => ({
        ...prev,
        [weddingId]: prev[weddingId].filter(i => i._id !== itemId)
      }))
    } catch {
      alert('Failed to delete item.')
    }
  }

  const openVendorModal = async (weddingId, e) => {
    e.stopPropagation()
    setVendorWeddingId(weddingId)
    setVendorSelected('')
    setVendorError('')
    setVendorModalOpen(true)
    try {
      const res = await axios.get('/api/users/role/vendor', authHeaders)
      const wedding = weddings.find(w => w._id === weddingId)
      const alreadyAdded = new Set(wedding?.accessList?.map(a => a.userId?._id || a.userId) ?? [])
      setVendorList(res.data.filter(v => !alreadyAdded.has(v._id)))
    } catch {
      setVendorError('Failed to load vendors.')
    }
  }

  const handleAddVendor = async () => {
    if (!vendorSelected) { setVendorError('Please select a vendor.'); return }
    setVendorLoading(true)
    setVendorError('')
    try {
      const res = await axios.post(`/api/weddings/${vendorWeddingId}/access`, { userId: vendorSelected }, authHeaders)
      setWeddings(prev => prev.map(w => w._id === vendorWeddingId ? { ...w, accessList: res.data.accessList } : w))
      setVendorModalOpen(false)
    } catch (err) {
      setVendorError(err.response?.data?.error || 'Failed to add vendor.')
    } finally {
      setVendorLoading(false)
    }
  }

  const handleRemoveVendor = async (weddingId, userId, e) => {
    e.stopPropagation()
    try {
      const res = await axios.delete(`/api/weddings/${weddingId}/access/${userId}`, authHeaders)
      setWeddings(prev => prev.map(w => w._id === weddingId ? { ...w, accessList: res.data.accessList } : w))
    } catch {
      alert('Failed to remove vendor.')
    }
  }

  const filtered = weddings.filter(w =>
    w.weddingName?.toLowerCase().includes(search.toLowerCase()) ||
    w.plannerId?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
      <p className="text-indigo-400 text-sm">Loading weddings...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-indigo-50 pt-20 px-6 pb-10">

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-indigo-900">Weddings</h1>
          <p className="text-sm text-indigo-400 mt-1">
            {user?.role === 'admin' ? 'All weddings in the system' :
             user?.role === 'planner' ? 'Weddings assigned to you' :
             'Allowed Viewed Weddings'}
          </p>
        </div>
        {/* Search */}
        <div className="relative w-56">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search weddings…"
            className="w-full pl-8 pr-3 py-1.5 border border-indigo-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
          />
        </div>
      </div>

      {/* Single panel — full width list */}
      <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">

        {/* Panel header */}
        <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between bg-[#92a5e8]">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">Weddings</span>
            <span className="bg-white/30 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          {canEdit && (
            <button
              onClick={openAddModal}
              className="text-xs bg-pink-300/80 hover:bg-pink-400 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              + Add wedding
            </button>
          )}
        </div>

        {/* Wedding rows */}
        <div className="p-3 flex flex-col gap-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-indigo-300 text-sm py-8">No weddings found</p>
          ) : (
            filtered.map(wedding => {
              const isSelected = selectedWeddingId === wedding._id
              const items = registryItems[wedding._id] || []
              const clients = wedding.accessList?.filter(a => a.role === 'client').length ?? 0
              const vendors = wedding.accessList?.filter(a => a.role === 'vendor').length ?? 0

              return (
                <div key={wedding._id}>
                  {/* Wedding row */}
                  <div
                    onClick={() => handleRowClick(wedding._id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-all group
                      ${isSelected
                        ? 'bg-indigo-50 border-indigo-300 rounded-b-none'
                        : 'border-transparent hover:bg-indigo-50 hover:border-indigo-100'
                      }`}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {initials(wedding.weddingName)}
                    </div>

                    {/* Name + date */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">{wedding.weddingName}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {formatDate(wedding.weddingDate)}
                        {wedding.plannerId?.name ? ` · ${wedding.plannerId.name}` : ''}
                      </p>
                    </div>

                    {/* Guest chip + privacy + actions */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-indigo-300 hidden sm:block">
                        {clients} clients · {vendors} vendors
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                        ${wedding.privacy === 'private'
                          ? 'bg-pink-100 text-pink-500'
                          : 'bg-green-100 text-green-600'
                        }`}>
                        {wedding.privacy}
                      </span>
                      {canEdit && (
                        <button
                          onClick={e => openEditModal(wedding, e)}
                          className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Edit
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={e => handleDelete(wedding._id, e)}
                          className="text-xs px-2 py-1 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      )}
                      <span className={`text-indigo-300 text-xs transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded registry panel */}
                  {isSelected && (
                    <div className="border border-indigo-200 border-t-0 rounded-b-xl overflow-hidden mb-1">

                      {/* Registry header */}
                      <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-indigo-400">Registry</p>
                          <span className="text-xs bg-indigo-100 text-indigo-500 font-medium px-2 py-0.5 rounded-full">
                            {loadingRegistry[wedding._id] ? '…' : items.length}
                          </span>
                        </div>
                        {canEdit && (
                          <button
                            onClick={e => openAddItemModal(wedding._id, e)}
                            className="text-xs bg-pink-300/80 hover:bg-pink-400 text-white font-semibold px-2.5 py-1 rounded-lg transition-all"
                          >
                            + Add item
                          </button>
                        )}
                      </div>

                      {/* Registry items */}
                      {loadingRegistry[wedding._id] ? (
                        <p className="text-center text-indigo-300 text-xs py-4">Loading registry…</p>
                      ) : items.length === 0 ? (
                        <p className="text-center text-indigo-300 text-xs py-4">No registry items yet</p>
                      ) : (
                        items.map(item => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between px-4 py-2.5 border-b border-indigo-50 last:border-b-0 bg-white group/item"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{item.itemName}</p>
                                <p className="text-xs text-gray-400">{item.store}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-lg">x{item.quantity}</span>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="text-xs text-indigo-400 hover:text-indigo-600 hover:underline"
                                >
                                  View
                                </a>
                              )}
                              {canEdit && (
                                <button
                                  onClick={e => handleDeleteItem(item._id, wedding._id, e)}
                                  className="text-red-200 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
                                >
                                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      {/* Vendor access panel */}
                      {canEdit && (
                        <div className="border-t border-indigo-100">
                          <div className="px-4 py-2 bg-indigo-50/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-indigo-400">Vendors</p>
                              <span className="text-xs bg-indigo-100 text-indigo-500 font-medium px-2 py-0.5 rounded-full">
                                {wedding.accessList?.filter(a => a.role === 'vendor').length ?? 0}
                              </span>
                            </div>
                            <button
                              onClick={e => openVendorModal(wedding._id, e)}
                              className="text-xs bg-pink-300/80 hover:bg-pink-400 text-white font-semibold px-2.5 py-1 rounded-lg transition-all"
                            >
                              + Add vendor
                            </button>
                          </div>
                          {wedding.accessList?.filter(a => a.role === 'vendor').map(entry => (
                            <div key={entry.userId} className="flex items-center justify-between px-4 py-2 border-b border-indigo-50 last:border-b-0 bg-white group/vendor">
                              <div>
                                <span className="text-xs font-medium text-gray-700">{entry.userId?.name || entry.userId}</span>
                                {entry.userId?.service && (
                                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded-full">{entry.userId.service}</span>
                                )}
                              </div>
                              <button
                                onClick={e => handleRemoveVendor(wedding._id, entry.userId?._id || entry.userId, e)}
                                className="text-red-200 hover:text-red-400 transition-colors opacity-0 group-hover/vendor:opacity-100"
                              >
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Add / Edit Wedding Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {modalMode === 'add' ? 'Add wedding' : 'Edit wedding'}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Wedding Name</label>
                <input
                  type="text"
                  placeholder="e.g. Smith & Johnson"
                  value={modalData.weddingName}
                  onChange={e => setModalData({ ...modalData, weddingName: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Wedding Date</label>
                <input
                  type="date"
                  value={modalData.weddingDate}
                  onChange={e => setModalData({ ...modalData, weddingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Privacy</label>
                <select
                  value={modalData.privacy}
                  onChange={e => setModalData({ ...modalData, privacy: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent bg-white"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
            {modalError && <p className="text-xs text-red-400 mt-3">{modalError}</p>}
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={closeModal} className="px-4 py-2 text-sm border border-indigo-200 rounded-lg text-gray-500 hover:bg-indigo-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={modalLoading} className="px-4 py-2 text-sm bg-pink-300/80 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
                {modalLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Vendor Modal ── */}
      {vendorModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setVendorModalOpen(false)}>
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-800 mb-5">Add vendor</h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vendor *</label>
              <select
                value={vendorSelected}
                onChange={e => setVendorSelected(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent bg-white"
              >
                <option value="">Select a vendor…</option>
                {vendorList.map(v => (
                  <option key={v._id} value={v._id}>{v.name}{v.service ? ` — ${v.service}` : ''}</option>
                ))}
              </select>
              {vendorList.length === 0 && !vendorError && (
                <p className="text-xs text-gray-400 mt-1">No available vendors to add.</p>
              )}
            </div>
            {vendorError && <p className="text-xs text-red-400 mt-3">{vendorError}</p>}
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setVendorModalOpen(false)} className="px-4 py-2 text-sm border border-indigo-200 rounded-lg text-gray-500 hover:bg-indigo-50 transition-all">
                Cancel
              </button>
              <button onClick={handleAddVendor} disabled={vendorLoading} className="px-4 py-2 text-sm bg-pink-300/80 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
                {vendorLoading ? 'Adding...' : 'Add vendor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Registry Item Modal ── */}
      {addItemModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setAddItemModalOpen(false)}>
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-800 mb-5">Add registry item</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. KitchenAid Mixer"
                  value={itemForm.itemName}
                  onChange={e => setItemForm({ ...itemForm, itemName: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Store *</label>
                  <input
                    type="text"
                    placeholder="e.g. Target"
                    value={itemForm.store}
                    onChange={e => setItemForm({ ...itemForm, store: e.target.value })}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-xs text-gray-500 mb-1">Qty *</label>
                  <input
                    type="number"
                    min="1"
                    value={itemForm.quantity}
                    onChange={e => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Link</label>
                <input
                  type="url"
                  placeholder="https://…"
                  value={itemForm.link}
                  onChange={e => setItemForm({ ...itemForm, link: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent resize-none"
                />
              </div>
            </div>
            {itemError && <p className="text-xs text-red-400 mt-3">{itemError}</p>}
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setAddItemModalOpen(false)} className="px-4 py-2 text-sm border border-indigo-200 rounded-lg text-gray-500 hover:bg-indigo-50 transition-all">
                Cancel
              </button>
              <button onClick={handleAddItem} disabled={itemLoading} className="px-4 py-2 text-sm bg-pink-300/80 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
                {itemLoading ? 'Adding...' : 'Add item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Weddings;