import React from 'react'
import SignUpTitle from './signUpComponents/SignUpTitle'
import SignUpBackground from './signUpComponents/SignUpBackground'
import SignUpBio from './signUpComponents/SignUpBio'
export default function SignUp() {
  return( 
    <SignUpBackground>
    <SignUpTitle />
    <SignUpBio />
    </SignUpBackground>
  )
}