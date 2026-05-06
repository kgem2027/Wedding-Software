import React from 'react'
import { StarsBackground } from "../../components/ui/stars.jsx"

export default function AuthenticationBackground({ children }) {
  return (
     <StarsBackground>
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        height: '40vh',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '16px',
      }}>
        {children}
      </div>
    </StarsBackground>
  )
}
