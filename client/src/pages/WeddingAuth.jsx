import React, { useState } from 'react'
import GradientText from "../components/ui/gradient-text.jsx"
import AuthenticationBackground from "./pageComponents/AuthenticationBackground.jsx"
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const WeddingAccess = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ firstName: '', lastName: '', authPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/guest-login', formData)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      const weddingRes = await axios.get(`/api/weddings/auth/${formData.authPassword}`)
      navigate(`/wedding/details`, { state: weddingRes.data })
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AuthenticationBackground>
        <GradientText
          colors={["#ff6b9d", "#ffffff", "#ff8585"]}
          animationSpeed={4}
          className="auth-text"
        >
          Access Wedding
        </GradientText>

        <p className="text-white text-sm mt-3 text-center" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '18rem' }}>
          Enter the auth code provided by your wedding planner to view the wedding.
        </p>

        {error && <p style={{ color: '#ff8585', marginTop: '16px', fontSize: '14px' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 w-72">
          <div>
            <label className="block text-white text-sm font-medium mb-2" style={{ color: 'white' }}>
              Wedding Auth Code:
            </label>
            <input
              type="text"
              id="authPassword"
              className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your wedding auth code"
              value={formData.authPassword}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="mt-4">
            <label className="block text-white text-sm font-medium mb-2">First Name:</label>
            <input
              type="text"
              id="firstName"
              className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="mt-4">
            <label className="block text-white text-sm font-medium mb-2">Last Name:</label>
            <input
              type="text"
              id="lastName"
              className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Access Wedding'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            Have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </AuthenticationBackground>
    </div>
  )
}

export default WeddingAccess