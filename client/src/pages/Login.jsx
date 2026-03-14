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
        {errors}
    </AuthenticationBackground>
       

    </div>
  )
}

export default Login