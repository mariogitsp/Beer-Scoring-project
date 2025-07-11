"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext"
import "./HomePage.css"

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

  if (loading) return <div className="loading">Loading beers...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">🍺 Beer Collection</h1>

        {beers.length === 0 ? (
          <div className="no-beers">
            <p>No beers available yet.</p>
          </div>
        ) : (
          <div className="beer-grid">
            {beers.map((beer) => (
              <Link to={`/beer/${beer._id}`} key={beer._id} className="beer-card-link">
                <div className="beer-card">
                  <div className="beer-image">
                    <img src={beer.image || "/placeholder.svg"} alt={beer.name} />
                  </div>
                  <div className="beer-info">
                    <h3 className="beer-name">{beer.name}</h3>
                    <p className="beer-description">{beer.description}</p>
                    <div className="beer-rating">
                      <div className="rating-stars">
                        {"★".repeat(Math.round(beer.averageRating || 0)/2)}
                        {"☆".repeat(5 - Math.round(beer.averageRating || 0)/2)}
                      </div>
                      <span className="rating-text">
                        {beer.averageRating || 0}/10 ({beer.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
