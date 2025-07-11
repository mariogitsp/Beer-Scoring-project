"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  console.log("AuthContext:", context)
  // Ensure context is not undefined
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Decode token to get user info
      try {
        console.log("Token found:", token)
        const payload = JSON.parse(atob(token.split(".")[1]))
        console.log("Decoded payload:", payload)
        setUser({
          id: payload.userId,
          role: payload.role,
          token: token,
        })
      } catch (error) {
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem("token", token)
    const payload = JSON.parse(atob(token.split(".")[1]))
    setUser({
      id: payload.userId,
      role: payload.role,
      token: token,
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
