import React, { useState, useEffect } from 'react'
import axios from 'axios'
export default function ContactUs() {
    const [admins, setAdmins] = useState([])
    const [planners, setPlanners] = useState([])
    const[loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    useEffect(() => {

        fetchUsers()
    }, [])        
    const fetchUsers = async () => {
        const token = localStorage.getItem('token')
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } }
        try {
            setError(null)
            const [adminRes, plannerRes] = await Promise.all([
                axios.get('/api/users/role/admin', authHeaders),
                axios.get('/api/users/role/planner', authHeaders)
            ])
            setPlanners(plannerRes.data)
            setAdmins(adminRes.data)
        } catch(e) {
            setError('Failed to load Data')
        } finally {
            setLoading(false)
        }
    }
  if (loading) return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <p className="text-indigo-400 text-sm">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
    </div>
  )

  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-indigo-50 pt-20 px-6 pb-10">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-indigo-900">Contact Us</h1>
        <p className="text-sm text-indigo-400 mt-1">Reach out to our admins and planners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Admins Panel */}
        <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-indigo-100 flex items-center gap-2 bg-[#92a5e8]">
            <span className="text-white font-medium text-sm">Admins</span>
            <span className="bg-white/30 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {admins.length}
            </span>
          </div>
          <div className="p-3 flex flex-col gap-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {admins.length === 0 ? (
              <p className="text-center text-indigo-300 text-sm py-8">No admins found</p>
            ) : (
              admins.map(admin => (
                <div key={admin._id} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {initials(admin.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{admin.name}</p>
                    <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Planners Panel */}
        <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-indigo-100 flex items-center gap-2 bg-[#92a5e8]">
            <span className="text-white font-medium text-sm">Planners</span>
            <span className="bg-white/30 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {planners.length}
            </span>
          </div>
          <div className="p-3 flex flex-col gap-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {planners.length === 0 ? (
              <p className="text-center text-indigo-300 text-sm py-8">No planners found</p>
            ) : (
              planners.map(planner => (
                <div key={planner._id} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                  <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {initials(planner.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{planner.name}</p>
                    <p className="text-xs text-gray-400 truncate">{planner.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
