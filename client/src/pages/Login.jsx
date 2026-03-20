import React from 'react'
import GradientText from "../components/ui/gradient-text.jsx"
import AuthenticationBackground from "./pageComponents/AuthenticationBackground.jsx"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = ({ setUser }) => {
  const navigate = useNavigate()

  const [errors, setErrors] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/users/login', formData)
      localStorage.setItem('token', res.data.token)
      console.log(res.data)
      setUser(res.data.user)
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
        className = "auth-text"
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
          placeholder = "Enter your email"
          name = "email"
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
          placeholder = "Enter your password"
          name = "password"
          value={formData.password}
          onChange={handleChange}
          required  
        />
      </div>
      <button type="submit" className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Login
      </button>
    </form>
    </AuthenticationBackground>
    </div>
  )
}

export default Login