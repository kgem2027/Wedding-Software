import { motion } from "motion/react"

export default function GradientText({
  children,
  className,
  colors = ["#ff6b9d", "#ffffff", "#ff8585"],
  animationSpeed = 4,
  showBorder = false,
}) {
  return (
    <motion.span
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{
        duration: animationSpeed,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(",")})`,
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontSize: "4rem",
        fontWeight: "bold",
        borderBottom: showBorder ? "1px solid rgba(255,255,255,0.2)" : "none",
      }}
      className={className}
    >
      {children}
    </motion.span>
  )
}