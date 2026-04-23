import { useState, useEffect } from 'react'
import axios from 'axios'

const EditRoster = () => {
  const [planners, setPlanners] = useState([])
  const [vendors, setVendors] = useState([])
  const [allWeddings, setAllWeddings] = useState([])
  const [selectedPlannerId, setSelectedPlannerId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [modalData, setModalData] = useState({ name: '', email: '', password: '' })
  const [modalError, setModalError] = useState('')
  const [modalLoading, setModalLoading] = useState(false)

  const [vendorModalOpen, setVendorModalOpen] = useState(false)
  const [vendorModalMode, setVendorModalMode] = useState('add')
  const [vendorModalData, setVendorModalData] = useState({ name: '', email: '', password: '', service: '', _id: '' })
  const [vendorModalError, setVendorModalError] = useState('')
  const [vendorModalLoading, setVendorModalLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [plannersRes, vendorsRes, weddingsRes] = await Promise.all([
        axios.get('/api/users/role/planner'),
        axios.get('/api/users/role/vendor'),
        axios.get('/api/weddings/')
      ])
      setPlanners(plannersRes.data)
      setVendors(vendorsRes.data)
      setAllWeddings(weddingsRes.data)
    } catch (err) {
      setError('Failed to load roster data.')
    } finally {
      setLoading(false)
    }
  }

  const getPlannerWeddings = (plannerId) =>
    allWeddings.filter(w => w.plannerId === plannerId || w.plannerId?._id === plannerId)

  const initials = (name) =>
    name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  const openAddModal = () => {
    setModalMode('add')
    setModalData({ name: '', email: '', password: '' })
    setModalError('')
    setModalOpen(true)
  }

  const openEditModal = (planner, e) => {
    e.stopPropagation()
    setModalMode('edit')
    setModalData({ name: planner.name, email: planner.email, password: '', _id: planner._id })
    setModalError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalError('')
  }

  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.id]: e.target.value })
  }

  const handlePlannerSave = async () => {
    if (!modalData.name || !modalData.email) {
      setModalError('Name and email are required.')
      return
    }
    if (modalMode === 'add' && !modalData.password) {
      setModalError('Password is required.')
      return
    }
    setModalLoading(true)
    setModalError('')
    try {
      if (modalMode === 'add') {
        await axios.post('/api/users', {
          name: modalData.name,
          email: modalData.email,
          password: modalData.password,
          role: 'planner'
        })
      } else {
        await axios.put(`/api/users/${modalData._id}`, {
          name: modalData.name,
          email: modalData.email
        })
      }
      closeModal()
      fetchData()
    } catch (err) {
      setModalError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setModalLoading(false)
    }
  }
  

  const openAddVendorModal = () => {
    setVendorModalMode('add')
    setVendorModalData({ name: '', email: '', password: '', service: '', _id: '' })
    setVendorModalError('')
    setVendorModalOpen(true)
  }

  const openVendorEditModal = (vendor, e) => {
    e.stopPropagation()
    setVendorModalMode('edit')
    setVendorModalData({ name: vendor.name, email: vendor.email || '', password: '', service: vendor.service || '', _id: vendor._id })
    setVendorModalError('')
    setVendorModalOpen(true)
  }

  const handleVendorSave = async () => {
    if (!vendorModalData.name || !vendorModalData.email) {
      setVendorModalError('Name and email are required.')
      return
    }
    if (vendorModalMode === 'add' && !vendorModalData.password) {
      setVendorModalError('Password is required.')
      return
    }
    setVendorModalLoading(true)
    setVendorModalError('')
    try {
      if (vendorModalMode === 'add') {
        const res = await axios.post('/api/users', {
          name: vendorModalData.name,
          email: vendorModalData.email,
          password: vendorModalData.password,
          service: vendorModalData.service,
          role: 'vendor'
        })
        setVendors(prev => [...prev, res.data.user ?? res.data])
      } else {
        const res = await axios.put(`/api/users/${vendorModalData._id}`, {
          name: vendorModalData.name,
          service: vendorModalData.service
        })
        setVendors(prev => prev.map(v => v._id === vendorModalData._id ? { ...v, ...res.data } : v))
      }
      setVendorModalOpen(false)
    } catch (err) {
      setVendorModalError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong.')
    } finally {
      setVendorModalLoading(false)
    }
  }
  const handleDeleteVendor = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`)
      setVendors(prev => prev.filter(v => v._id !== id))
    } catch (err) {
      setVendorModalError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  const handleDeletePlanner = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`)
      setPlanners(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <p className="text-indigo-400 text-sm">Loading roster...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-indigo-50 pt-20 px-6 pb-10">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-indigo-900">Roster Management</h1>
        <p className="text-sm text-indigo-400 mt-1">Manage planners and view vendors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Vendors Panel (left) ── */}
        <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between bg-[#92a5e8]">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">Vendors</span>
              <span className="bg-white/30 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {vendors.length}
              </span>
            </div>
            <button
              onClick={openAddVendorModal}
              className="text-xs bg-pink-300/80 hover:bg-pink-400 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              + Add vendor
            </button>
          </div>

          {/* Scrollable vendor list */}
          <div className="p-3 flex flex-col gap-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {vendors.length === 0 ? (
              <p className="text-center text-indigo-300 text-sm py-8">No vendors found</p>
            ) : (
              vendors.map(vendor => (
                <div
                  key={vendor._id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {initials(vendor.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{vendor.name}</p>
                    <p className="text-xs text-gray-400 truncate">{vendor.email}</p>
                    {vendor.service
                      ? <span className="inline-block mt-0.5 text-xs bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded-full">{vendor.service}</span>
                      : <span className="inline-block mt-0.5 text-xs text-gray-300 italic">No service listed</span>
                    }
                  </div>
                  <button
                    onClick={e => openVendorEditModal(vendor, e)}
                    className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    Edit
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteVendor(vendor._id) }}
                    className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Planners Panel (right) ── */}
        <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between bg-[#92a5e8]">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">Planners</span>
              <span className="bg-white/30 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {planners.length}
              </span>
            </div>
            <button
              onClick={openAddModal}
              className="text-xs bg-pink-300/80 hover:bg-pink-400 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              + Add planner
            </button>
          </div>

          {/* Scrollable planner list with inline wedding expansion */}
          <div className="p-3 flex flex-col gap-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {planners.length === 0 ? (
              <p className="text-center text-indigo-300 text-sm py-8">No planners found</p>
            ) : (
              planners.map(planner => {
                const isSelected = selectedPlannerId === planner._id
                const plannerWeddings = getPlannerWeddings(planner._id)

                return (
                  <div key={planner._id}>
                    {/* Planner row */}
                    <div
                      onClick={() => setSelectedPlannerId(isSelected ? null : planner._id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-all group
                        ${isSelected
                          ? 'bg-indigo-50 border-indigo-300 rounded-b-none'
                          : 'border-transparent hover:bg-indigo-50 hover:border-indigo-100'
                        }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {initials(planner.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{planner.name}</p>
                        <p className="text-xs text-gray-400 truncate">{planner.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => openEditModal(planner, e)}
                          className="text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePlanner(planner._id) }}
                          className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                        <span className={`text-indigo-300 text-xs transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Inline wedding expansion */}
                    {isSelected && (
                      <div className="border border-indigo-200 border-t-0 rounded-b-xl overflow-hidden mb-1">
                        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                          <p className="text-xs font-medium text-indigo-400">Weddings</p>
                          <span className="text-xs bg-indigo-100 text-indigo-500 font-medium px-2 py-0.5 rounded-full">
                            {plannerWeddings.length}
                          </span>
                        </div>

                        {plannerWeddings.length === 0 ? (
                          <p className="text-center text-indigo-300 text-xs py-4">No weddings assigned yet</p>
                        ) : (
                          plannerWeddings.map((wedding, i) => (
                            <div
                              key={wedding._id || i}
                              className="flex items-center justify-between px-4 py-2.5 border-b border-indigo-50 last:border-b-0 bg-white"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-800">{wedding.weddingName}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                                ${wedding.privacy === 'private'
                                  ? 'bg-pink-100 text-pink-500'
                                  : 'bg-green-100 text-green-600'
                                }`}>
                                {wedding.privacy}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Vendor Modal ── */}
      {vendorModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setVendorModalOpen(false)}>
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {vendorModalMode === 'add' ? 'Add vendor' : 'Edit vendor'}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={vendorModalData.name}
                  onChange={e => setVendorModalData({ ...vendorModalData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={vendorModalData.email}
                  onChange={e => setVendorModalData({ ...vendorModalData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              {vendorModalMode === 'add' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Temporary password"
                    value={vendorModalData.password}
                    onChange={e => setVendorModalData({ ...vendorModalData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Service Provided</label>
                <input
                  type="text"
                  placeholder="e.g. Photography, Catering, Florist…"
                  value={vendorModalData.service}
                  onChange={e => setVendorModalData({ ...vendorModalData, service: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
            </div>
            {vendorModalError && <p className="text-xs text-red-400 mt-3">{vendorModalError}</p>}
            <div className="flex gap-2 justify-end mt-5">
              <button onClick={() => setVendorModalOpen(false)} className="px-4 py-2 text-sm border border-indigo-200 rounded-lg text-gray-500 hover:bg-indigo-50 transition-all">
                Cancel
              </button>
              <button onClick={handleVendorSave} disabled={vendorModalLoading} className="px-4 py-2 text-sm bg-pink-300/80 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
                {vendorModalLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {modalMode === 'add' ? 'Add planner' : 'Edit planner'}
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  value={modalData.name}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={modalData.email}
                  onChange={handleModalChange}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
              {modalMode === 'add' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Temporary password"
                    value={modalData.password}
                    onChange={handleModalChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {modalError && (
              <p className="text-xs text-red-400 mt-3">{modalError}</p>
            )}

            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm border border-indigo-200 rounded-lg text-gray-500 hover:bg-indigo-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePlannerSave}
                disabled={modalLoading}
                className="px-4 py-2 text-sm bg-pink-300/80 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {modalLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditRoster