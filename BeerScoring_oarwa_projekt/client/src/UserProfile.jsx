"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext"
import "./UserProfile.css"

const UserProfile = () => {
  const { user } = useAuth()
  const [userReviews, setUserReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserReviews()
  }, [])

  const fetchUserReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.ok) {
        const allReviews = await response.json()
        const myReviews = allReviews.filter((review) => review.userId?._id === user.id)
        setUserReviews(myReviews)
      } else {
        setError("Failed to fetch reviews")
      }
    } catch (error) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.ok) {
        setUserReviews(userReviews.filter((review) => review._id !== reviewId))
      } else {
        const data = await response.json()
        setError(data.message || "Failed to delete review")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  const calculateAverageRating = () => {
    if (userReviews.length === 0) return 0
    const sum = userReviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / userReviews.length).toFixed(1)
  }

  if (loading) return <div className="loading">Loading your profile...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="profile-stats">
            <div className="stat-card">
              <h3>{userReviews.length}</h3>
              <p>Total Reviews</p>
            </div>
            <div className="stat-card">
              <h3>{calculateAverageRating()}</h3>
              <p>Average Rating</p>
            </div>
            <div className="stat-card">
              <h3>{user.role === "admin" ? "Admin" : "User"}</h3>
              <p>Account Type</p>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>My Reviews</h2>

          {userReviews.length === 0 ? (
            <div className="no-reviews">
              <p>You haven't written any reviews yet.</p>
              <Link to="/" className="browse-beers-btn">
                Browse Beers to Review
              </Link>
            </div>
          ) : (
            <div className="reviews-list">
              {userReviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="beer-info">
                      {review.beerId ? (
                        <Link to={`/beer/${review.beerId._id}`} className="beer-link">
                          <img
                            src={review.beerId.image || "/placeholder.svg"}
                            alt={review.beerId.name}
                            className="beer-thumbnail"
                          />
                          <div>
                            <h4>{review.beerId.name}</h4>
                            <div className="review-rating">
                              {"★".repeat(review.rating / 2)}
                              {"☆".repeat(5 - review.rating / 2)}
                              <span className="rating-number">({review.rating}/10)</span>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="beer-link missing-beer">
                          <img
                            src="/placeholder.svg"
                            alt="Beer missing"
                            className="beer-thumbnail"
                          />
                          <div>
                            <h4>Deleted Beer</h4>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="review-actions">
                      {review.beerId && (
                        <Link to={`/beer/${review.beerId._id}`} className="edit-btn">
                          Edit
                        </Link>
                      )}
                      <button onClick={() => handleDeleteReview(review._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
