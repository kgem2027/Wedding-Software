import { BrowserRouter as Router, Routes,
  Route,
  Navigate
  } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/login"
import Register from "./pages/Register"
import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [user, setUser] = useState(null)
  const [error,setError] = useState('')
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
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
      </Routes>

    </Router>
  )
}
export default App