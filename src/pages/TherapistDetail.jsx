import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Globe, Clock, 
  Award, Heart, Navigation, ThumbsUp, Calendar 
} from 'lucide-react'
import { therapistsDatabase, reviewsDatabase } from '../data/therapists'

function TherapistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [therapist, setTherapist] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, text: '' })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const found = therapistsDatabase.find(t => t.id === parseInt(id))
    setTherapist(found)
    setReviews(reviewsDatabase[id] || [])
    
    // Check if saved
    const saved = JSON.parse(localStorage.getItem('therapick-matches') || '[]')
    setIsSaved(saved.some(s => s.id === parseInt(id)))
  }, [id])

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('therapick-matches') || '[]')
    if (isSaved) {
      const updated = saved.filter(s => s.id !== therapist.id)
      localStorage.setItem('therapick-matches', JSON.stringify(updated))
      setIsSaved(false)
    } else {
      saved.push({ ...therapist, savedDate: new Date().toISOString() })
      localStorage.setItem('therapick-matches', JSON.stringify(saved))
      setIsSaved(true)
    }
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    const review = {
      id: Date.now(),
      userId: 'currentUser',
      userName: 'You',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      text: newReview.text,
      helpful: 0
    }
    setReviews([review, ...reviews])
    setNewReview({ rating: 5, text: '' })
    setShowReviewForm(false)
  }

  const openDirections = () => {
    if (therapist.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${therapist.coordinates.lat},${therapist.coordinates.lng}`
      window.open(url, '_blank')
    }
  }

  if (!therapist) {
    return <div className="loading">Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="therapist-detail-page"
    >
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button-detail">
          <ArrowLeft size={24} />
        </button>
        <button onClick={handleSave} className="save-button-detail">
          <Heart size={24} fill={isSaved ? '#ef5350' : 'none'} stroke={isSaved ? '#ef5350' : 'currentColor'} />
        </button>
      </div>

      {/* Therapist Info */}
      <div className="detail-content">
        <div className="detail-hero">
          <div className="detail-avatar">
            {therapist.name.charAt(0)}
          </div>
          <h1>{therapist.name}</h1>
          <p className="detail-credentials">{therapist.credentials}</p>
          <div className="detail-rating">
            <Star size={20} fill="#ffc107" stroke="#ffc107" />
            <span className="rating-value">{therapist.rating}</span>
            <span className="rating-count">({therapist.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Specialty */}
        <div className="detail-section">
          <h3>Specialty</h3>
          <p className="specialty-text">{therapist.specialty}</p>
          <div className="detail-tags">
            {therapist.tags.map((tag, index) => (
              <span key={index} className="detail-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="detail-section">
          <h3>About</h3>
          <p>{therapist.bio}</p>
          <div className="detail-info-grid">
            <div className="info-item">
              <Award size={18} />
              <span>{therapist.experience} experience</span>
            </div>
            <div className="info-item">
              <Clock size={18} />
              <span>{therapist.availability}</span>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="detail-section">
          <h3>Contact Information</h3>
          <div className="contact-list">
            <a href={`tel:${therapist.phone}`} className="contact-item">
              <Phone size={18} />
              <span>{therapist.phone}</span>
            </a>
            <a href={`mailto:${therapist.email}`} className="contact-item">
              <Mail size={18} />
              <span>{therapist.email}</span>
            </a>
            {therapist.website && (
              <a href={`https://${therapist.website}`} target="_blank" rel="noopener noreferrer" className="contact-item">
                <Globe size={18} />
                <span>{therapist.website}</span>
              </a>
            )}
            <div className="contact-item">
              <MapPin size={18} />
              <span>{therapist.fullAddress}</span>
            </div>
            <div className="contact-item">
              <Clock size={18} />
              <span>{therapist.officeHours}</span>
            </div>
          </div>
        </div>

        {/* Map */}
        {therapist.coordinates && therapist.coordinates.lat && (
          <div className="detail-section">
            <h3>Location</h3>
            <div className="map-container">
              <MapContainer
                center={[therapist.coordinates.lat, therapist.coordinates.lng]}
                zoom={15}
                style={{ height: '300px', width: '100%', borderRadius: '15px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[therapist.coordinates.lat, therapist.coordinates.lng]}>
                  <Popup>{therapist.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <button onClick={openDirections} className="directions-button">
              <Navigation size={18} />
              <span>Get Directions</span>
            </button>
          </div>
        )}

        {/* Insurance */}
        <div className="detail-section">
          <h3>Insurance Accepted</h3>
          <div className="insurance-list">
            {therapist.insurance.map((ins, index) => (
              <span key={index} className="insurance-item">{ins}</span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="detail-section">
          <div className="reviews-header">
            <h3>Reviews ({reviews.length})</h3>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="write-review-button">
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-input">
                <label>Your Rating:</label>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={24}
                      fill={star <= newReview.rating ? '#ffc107' : 'none'}
                      stroke={star <= newReview.rating ? '#ffc107' : '#ccc'}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Share your experience..."
                required
                rows={4}
              />
              <div className="review-form-actions">
                <button type="button" onClick={() => setShowReviewForm(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-review-button">
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">{review.userName.charAt(0)}</div>
                    <div>
                      <div className="reviewer-name">{review.userName}</div>
                      <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? '#ffc107' : 'none'}
                        stroke={i < review.rating ? '#ffc107' : '#ccc'}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
                <button className="helpful-button">
                  <ThumbsUp size={14} />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Book Appointment CTA */}
        <div className="detail-cta">
          <button onClick={() => navigate(`/booking/${therapist.id}`)} className="book-button">
            <Calendar size={20} />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TherapistDetail
