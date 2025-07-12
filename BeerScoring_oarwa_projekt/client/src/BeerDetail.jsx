"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import "./BeerDetail.css"
import Loader from "./Loader"
import UserReviewList from "./UserReviewList"

const BeerDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [beer, setBeer] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  })
  const [editingReview, setEditingReview] = useState(null)

  useEffect(() => {
    fetchBeerDetails()
    fetchReviews()
    fetchAverageRating()
  }, [id])

  const fetchBeerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/beers/${id}`)
      const currentBeer = await response.json();
      setBeer(currentBeer);
      if (!response.ok) {
        throw new Error("Beer not found")
      }
    } catch (error) {
      setError("Failed to fetch beer details")
    }
  }

  const fetchReviews = async () => {
    try {
        console.log("Beer ID:", id);
      const response = await fetch(`http://localhost:5000/api/reviews/beer/${id}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched reviews:", data)
        setReviews(data)
      }
    } catch (error) {
      setError("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const fetchAverageRating = async () => {
    try {
        console.log("Fetching average rating for beer ID:", id);
      const response = await fetch(`http://localhost:5000/api/beers/average/${id}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Average rating data:", data);
        console.log("Setting total reviews:", data.totalReviews);
        setAverageRating(data.averageRating)
        setTotalReviews(data.totalReviews)
      }
    } catch (error) {
      console.error("Failed to fetch average rating")
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingReview
        ? `http://localhost:5000/api/reviews/${editingReview._id}`
        : "http://localhost:5000/api/reviews/add"

      const method = editingReview ? "PUT" : "POST"
      const body = editingReview
        ? { rating: reviewForm.rating, comment: reviewForm.comment }
        : { beerId: id, rating: reviewForm.rating, comment: reviewForm.comment }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setReviewForm({ rating: 5, comment: "" })
        setShowReviewForm(false)
        setEditingReview(null)
        fetchReviews()
        fetchAverageRating()
      } else {
        const data = await response.json()
        setError(data.message || "Failed to submit review")
      }
    } catch (error) {
      setError("Network error")
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
        fetchReviews()
        fetchAverageRating()
      } else {
        const data = await response.json()
        setError(data.message || "Failed to delete review")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  const startEditReview = (review) => {
    setEditingReview(review)
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    })
    setShowReviewForm(true)
  }

  const cancelEdit = () => {
    setEditingReview(null)
    setReviewForm({ rating: 5, comment: "" })
    setShowReviewForm(false)
  }

  const canDeleteReview = (review) => {
    return user.role === "admin" || review.userId._id === user.id
  }

  const canEditReview = (review) => {
    return review.userId._id === user.id
  }

  const userHasReviewed = reviews.some((review) => review.userId._id === user.id)

  if (loading) return <Loader message="Loading beer details..." />
  if (error) return <div className="error">{error}</div>
  if (!beer) return <div className="error">Beer not found</div>

  return (
    <div className="beer-detail">
      <div className="container">
        <button onClick={() => navigate("/")} className="back-btn">
          ← Back to Beers
        </button>

        <div className="beer-header">
          <div className="beer-image">
            <img src={beer.image || "/placeholder.svg"} alt={beer.name} />
          </div>
          <div className="beer-info">
            <h1>{beer.name}</h1>
            <p className="beer-description">{beer.description}</p>
            <div className="rating-summary">
              <div className="rating-stars">
                {"★".repeat(Math.round(averageRating)/2)}
                {"☆".repeat(5 - Math.round(averageRating)/2)}
              </div>
              <span className="rating-text">
                {averageRating}/10 ({totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Reviews</h2>
            {!userHasReviewed && !editingReview && (
              <button onClick={() => setShowReviewForm(true)} className="add-review-btn">
                Add Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <h3>{editingReview ? "Edit Review" : "Add Your Review"}</h3>

              <div className="form-group">
                <label>Rating:</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number.parseInt(e.target.value) })}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Comment:</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts about this beer..."
                  required
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingReview ? "Update Review" : "Submit Review"}
                </button>
                <button type="button" onClick={cancelEdit} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <UserReviewList
            reviews={reviews}
            currentUser={user}
            onEdit={startEditReview}
            onDelete={handleDeleteReview}
            showBeerInfo={false}
          />
        </div>
      </div>
    </div>
  )
}

export default BeerDetail
