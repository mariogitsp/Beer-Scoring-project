"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import "./AddBeer.css"

const AddBeer = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Beer name is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (!formData.image.trim()) {
      setError("Image URL is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/beers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        navigate("/")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to add beer")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-beer-page">
      <div className="container">
        <div className="add-beer-card">
          <div className="add-beer-header">
            <button onClick={() => navigate("/")} className="back-btn">
              ← Back to Beers
            </button>
            <h1>Add New Beer</h1>
          </div>

          <form onSubmit={handleSubmit} className="add-beer-form">
            <div className="form-group">
              <label htmlFor="name">Beer Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter beer name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the beer (taste, style, brewery, etc.)"
                className="form-textarea"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/beer-image.jpg"
                className="form-input"
                required
              />
              {formData.image && (
                <div className="image-preview">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Beer preview"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={() => navigate("/")} className="cancel-btn" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Adding Beer..." : "Add Beer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBeer
