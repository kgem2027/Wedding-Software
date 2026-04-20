import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/login"
import Register from "./pages/Register"
import Registry from "./pages/Registry"
import EditRoster from "./pages/EditRoster"
import Weddings from "./pages/Weddings"
import WeddingAccess from "./pages/WeddingAuth"
import WeddingDetails from "./pages/WeddingDetails"
import ProtectedRoute from "./components/ProtectedRoutes.jsx"
import { AuthProvider, useAuth } from "./components/authProvider.jsx" 

function AppContent() {
  const { user } = useAuth()  
  const location = useLocation()
  const hideNavbar = ['/login', '/register', '/weddingAuth', '/wedding/details'].some(path => 
  location.pathname.replace(/\/$/, '') === path
  )
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/weddingAuth" element={<WeddingAccess />} />
        <Route path="/wedding/details" element={<WeddingDetails />} />
        <Route path="/registry" element={<ProtectedRoute allowedRoles={['client']}><Registry /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = "/edit/roster" element = {
          <ProtectedRoute allowedRoles={['admin']}>
            <EditRoster />
          </ProtectedRoute>
        }
          />
        <Route path = "/weddings" element = {
            <Weddings />
    
        }
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>  
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App