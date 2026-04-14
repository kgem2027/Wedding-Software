import React, { useState } from 'react'
import GradientText from "../components/ui/gradient-text.jsx"
import AuthenticationBackground from "./pageComponents/AuthenticationBackground.jsx"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/authProvider.jsx'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [errors, setErrors] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [mode, setMode] = useState('login') //'login' or 'Wedding'
  const [weddingAuthData, setWeddingAuthData] = useState({
    authCode: '',
    authPassword: ''
  })
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handelWeddingAuthChange = (e) => {
    setWeddingAuthData({
      ...weddingAuthData,
      [e.target.id]: e.target.value
    })
  }
  const handleWeddingAuthSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.get('/api/weddings/auth', { params: weddingAuthData })
      navigate(`/wedding/${res.data._id}`)
    } catch (error) {
      setErrors(error.response?.data?.message || 'An error occurred during wedding authentication.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', formData)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (error) {
      setErrors(error.response?.data?.message || 'An error occurred during login.')
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
          Login
        </GradientText>
        {errors && <p style={{ color: 'red', marginTop: '20px' }}>{errors}</p>}

        <form onSubmit={handleSubmit} className="mt-6 w-72">
          <div>
            <label className="block text-white text-sm font-medium mb-2" style={{ color: 'white' }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-white text-sm font-medium mb-2" style={{ color: 'white' }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <div className="mt-6">
          <p className="text-white mb-2">Or access a wedding with an authentication code:</p>
          <form onSubmit={handleWeddingAuthSubmit} className="w-72">
            <div>
              <label className="block text-white text-sm font-medium mb-2" style={{ color: 'white' }}>
                Auth Code:
              </label>
              <input
                type="text"
                id="authCode"
                className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter wedding auth code"
                name="authCode"
                value={weddingAuthData.authCode}
                onChange={handelWeddingAuthChange}
                required
              />
              <label className="block text-white text-sm font-medium mb-2" style={{ color: 'white' }}>
                Auth Password:
              </label>
              <input
                type="password"
                id="authPassword"
                className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter wedding auth password"
                name="authPassword"
                value={weddingAuthData.authPassword}
                onChange={handelWeddingAuthChange}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Access Wedding
            </button>
          </form>
        </div>
      </AuthenticationBackground>
    </div>
  )
}

export default Login