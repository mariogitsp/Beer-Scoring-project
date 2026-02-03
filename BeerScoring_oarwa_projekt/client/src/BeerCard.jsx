"use client"

import { Link } from "react-router-dom"
import "./BeerCard.css"

const BeerCard = ({ beer, onDelete, isAdmin}) => {
  const handleDelete = (e) => {
    e.preventDefault() // Prevent navigation to beer detail
    e.stopPropagation()
    onDelete(beer._id)
  }

  return (
    <div className="beer-card-wrapper">
      <Link to={`/beer/${beer._id}`} className="beer-card-link">
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
      {isAdmin && (
        <button onClick={handleDelete} className="delete-beer-btn" title="Delete Beer">
          🗑️
        </button>
      )}
    </div>
  )
}

export default BeerCard
