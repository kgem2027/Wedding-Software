import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/login"
import Register from "./pages/Register"
import Registry from "./pages/Registry"
import { useEffect, useState } from "react"
import axios from "axios"

function AppContent() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const location = useLocation()

  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await axios.get('/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(res.data)
        } catch (err) {
          setError('Failed to fetch user')
          localStorage.removeItem('token')
        }
      }
    }

    fetchUser()
  }, [])

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
       
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route path = "/registry" element={<Registry setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App