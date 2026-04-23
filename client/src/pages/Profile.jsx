import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../components/authProvider.jsx'

export default function Profile() {
  const { user, token, login } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    bio: user?.bio || '',
    service: user?.service || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSave = async () => {
    if (!form.name || !form.email) { setError('Name and email are required.'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      const body = { name: form.name, email: form.email, bio: form.bio }
      if (form.password) body.password = form.password
      if (user?.role === 'vendor') body.service = form.service
      const res = await axios.put(`/api/users/${user._id}`, body)
      login(res.data, token)
      setSuccess('Profile updated.')
      setForm(f => ({ ...f, password: '' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-indigo-50 pt-20 px-6 pb-10 flex flex-col items-center">

      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-indigo-900">My Profile</h1>
          <p className="text-sm text-indigo-400 mt-1">Update your account details</p>
        </div>

        <div className="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-indigo-100 flex items-center gap-3 bg-[#92a5e8]">
            <div className="w-9 h-9 rounded-full bg-white/30 text-white flex items-center justify-center text-xs font-semibold">
              {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">New Password <span className="text-gray-300">(leave blank to keep current)</span></label>
              <input
                type="password"
                placeholder="New password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent resize-none overflow-y-auto"
              />
            </div>

            {user?.role === 'vendor' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Service</label>
                <input
                  type="text"
                  placeholder="e.g. Photography, Catering…"
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92a5e8] focus:border-transparent"
                />
              </div>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}
            {success && <p className="text-xs text-emerald-500">{success}</p>}

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-2 text-sm bg-pink-300/80 hover:bg-pink-400 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
