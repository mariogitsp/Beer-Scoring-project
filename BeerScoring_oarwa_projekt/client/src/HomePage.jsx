"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext"
import "./HomePage.css"
import BeerList from "./BeerList"

const HomePage = () => {
  const [beers, setBeers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchBeers()
  }, [])

  const fetchBeers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/beers")
      if (response.ok) {
        const data = await response.json()

        // Fetch average ratings for each beer
        const beersWithRatings = await Promise.all(
          data.map(async (beer) => {
            try {
              const ratingResponse = await fetch(`http://localhost:5000/api/beers/average/${beer._id}`)
              const ratingData = await ratingResponse.json()
              return {
                ...beer,
                averageRating: ratingData.averageRating,
                totalReviews: ratingData.totalReviews,
              }
            } catch (error) {
              return {
                ...beer,
                averageRating: 0,
                totalReviews: 0,
              }
            }
          }),
        )

        setBeers(beersWithRatings)
      } else {
        setError("Failed to fetch beers")
      }
    } catch (error) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBeer = async (beerId) => {
    if (!window.confirm("Are you sure you want to delete this beer? This will also delete all reviews for this beer."))
      return

    try {
      const response = await fetch(`http://localhost:5000/api/beers/delete/${beerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.ok) {
        // Remove the deleted beer from the state
        setBeers(beers.filter((beer) => beer._id !== beerId))
      } else {
        const data = await response.json()
        setError(data.message || "Failed to delete beer")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  if (loading) return <div className="loading">Loading beers...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">🍺 Beer Collection</h1>
        <div className="add-beer-section">
          {user.role === "admin" && (
            <Link to="/add-beer" className="add-beer-btn">
              + Add New Beer
            </Link>
          )}
        </div>
        
        <BeerList beers={beers} onDelete={handleDeleteBeer} isAdmin={user.role === "admin"} />
      </div>
    </div>
  )
}

export default HomePage
