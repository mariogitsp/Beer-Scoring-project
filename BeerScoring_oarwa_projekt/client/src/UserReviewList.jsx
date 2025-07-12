"use client"

import { Link } from "react-router-dom"
import "./UserReviewList.css"

const UserReviewList = ({ reviews, currentUser, onEdit, onDelete, showBeerInfo = false }) => {
  const canDeleteReview = (review) => {
    return currentUser.role === "admin" || review.userId._id === currentUser.id
  }

  const canEditReview = (review) => {
    return review.userId._id === currentUser.id
  }

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>
          {showBeerInfo ? "You haven't written any reviews yet." : "No reviews yet. Be the first to review this beer!"}
        </p>
        {showBeerInfo && (
          <Link to="/" className="browse-beers-btn">
            Browse Beers to Review
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <div className={showBeerInfo ? "beer-info" : "reviewer-info"}>
              {showBeerInfo ? (
                <Link to={`/beer/${review.beerId._id}`} className="beer-link">
                  <img
                    src={review.beerId.image || "/placeholder.svg"}
                    alt={review.beerId.name}
                    className="beer-thumbnail"
                  />
                  <div>
                    <h4>{review.beerId.name}</h4>
                    <div className="review-rating">
                      {"★".repeat(review.rating/2)}
                      {"☆".repeat(5 - (review.rating/2))}
                      <span className="rating-number">({review.rating}/5)</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <>
                  <span className="reviewer-name">{review.userId.username}</span>
                  <div className="review-rating">
                    {"★".repeat(review.rating/2)}
                    {"☆".repeat(5 - review.rating/2)}
                  </div>
                </>
              )}
            </div>
            <div className="review-actions">
              {canEditReview(review) && (
                <button onClick={() => onEdit(review)} className="edit-btn">
                  Edit
                </button>
              )}
              {canDeleteReview(review) && (
                <button onClick={() => onDelete(review._id)} className="delete-btn">
                  Delete
                </button>
              )}
            </div>
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

export default UserReviewList
