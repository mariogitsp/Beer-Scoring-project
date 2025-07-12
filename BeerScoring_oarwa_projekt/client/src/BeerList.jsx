"use client"

import BeerCard from "./BeerCard"
import "./BeerList.css"

const BeerList = ({ beers }) => {
  if (beers.length === 0) {
    return (
      <div className="no-beers">
        <p>No beers available yet.</p>
      </div>
    )
  }

  return (
    <div className="beer-grid">
      {beers.map((beer) => (
        <BeerCard key={beer._id} beer={beer} />
      ))}
    </div>
  )
}

export default BeerList
