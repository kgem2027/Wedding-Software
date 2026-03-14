import React from 'react'
import GradientText from "../components/ui/gradient-text.jsx"
import AuthenticationBackground from "./pageComponents/AuthenticationBackground.jsx"
import { useState } from 'react'

const Login = () => {
  const [errors, setErrors] = useState('')


  return (
    <div>
    <AuthenticationBackground>
      <GradientText
        colors={["#ff6b9d", "#ffffff", "#ff8585"]}
        animationSpeed={4}
        >
            Login
        </GradientText>
        {errors && <p style={{ color: 'red', marginTop: '20px' }}>{errors}</p>}
    
    <form className="mt-6 w-72">
      <div>
        <label className="block text-white text-sm font-medium mb-2" style={{ color: 'white' }}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-3 border border-gray-500 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-blue-500"
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
        />
      </div>
    </form>
    </AuthenticationBackground>
    </div>
  )
}

export default Login