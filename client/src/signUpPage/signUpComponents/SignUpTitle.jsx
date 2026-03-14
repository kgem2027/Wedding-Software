import React from 'react'
import GradientText from "../../components/ui/gradient-text.jsx"
export default function SignUpTitle() {
  return (
    <div className="relative z-10 text-center">
      <GradientText
        colors={["#ff6b9d", "#ffffff", "#ff8585"]}
        animationSpeed={4}
      >
        Wedding Planner
      </GradientText>
    </div>
  )
}