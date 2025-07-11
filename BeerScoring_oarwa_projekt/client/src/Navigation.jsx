"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import "./Navigation.css"

function Navigation(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍺 BeerScoring
        </Link>

        <div className="nav-links">
          
          <Link to="/profile" className="nav-link">
            My Profile
          </Link>
          <span className="nav-user">Welcome, {user?.role === "admin" ? "Admin" : "User"}!</span>
          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
