import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  Search, Bookmark, User, CloudRain, Zap, Flame, HeartCrack, 
  Wind, HelpCircle, UserX, Shield, Settings, MapPin, Star, Heart, ChevronLeft, ChevronRight,
  X, Calendar, Smile, Frown, Meh, ThumbsUp, AlertCircle, Phone, Mail
} from 'lucide-react'
import { therapistsDatabase } from '../data/therapists'

const moods = [
  { icon: CloudRain, label: 'Sad/Depressed', description: 'Feeling down, hopeless, or losing interest', specialties: ['Depression', 'Mood Disorders', 'CBT'] },
  { icon: Zap, label: 'Anxious', description: 'Worried, nervous, or panic attacks', specialties: ['Anxiety', 'Panic Disorders', 'Stress Management'] },
  { icon: Flame, label: 'Angry/Frustrated', description: 'Anger issues or feeling irritable', specialties: ['Anger Management', 'Emotional Regulation', 'Conflict Resolution'] },
  { icon: HeartCrack, label: 'Heartbroken', description: 'Relationship problems or breakup', specialties: ['Relationship Therapy', 'Couples Counseling', 'Grief Counseling'] },
  { icon: Wind, label: 'Stressed/Burnout', description: 'Overwhelmed, exhausted, or burnt out', specialties: ['Stress Management', 'Work-Life Balance', 'Mindfulness'] },
  { icon: HelpCircle, label: 'Confused/Lost', description: 'Life direction or identity questions', specialties: ['Life Coaching', 'Career Counseling', 'Identity Exploration'] },
  { icon: UserX, label: 'Lonely', description: 'Feeling isolated or disconnected', specialties: ['Social Skills', 'Connection Building', 'Depression'] },
  { icon: Shield, label: 'Traumatized', description: 'Past trauma or PTSD symptoms', specialties: ['Trauma Therapy', 'PTSD', 'EMDR'] },
]

const testimonials = [
  { name: 'Sarah M.', text: 'Therapick made finding the right therapist so easy. Within a week, I was in a session that truly helped me.', rating: 5 },
  { name: 'James L.', text: 'I was skeptical at first, but the mood-based matching really works. Found someone who understands exactly what I\'m going through.', rating: 5 },
  { name: 'Emily R.', text: 'Finally, a stress-free way to find mental health support. The app is intuitive and the therapists are top-notch!', rating: 5 },
  { name: 'Michael T.', text: 'As someone who struggled with anxiety about therapy, this app made it feel approachable and simple.', rating: 5 },
  { name: 'Lisa K.', text: 'The distance feature is amazing! Found a great therapist just 2 miles away. Highly recommend!', rating: 5 },
]

function HomePage() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedMoods, setSelectedMoods] = useState([])
  const [filteredTherapists, setFilteredTherapists] = useState([])
  const [savedMatches, setSavedMatches] = useState([])
  const [appointments, setAppointments] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [moodHistory, setMoodHistory] = useState([])
  const [todayMood, setTodayMood] = useState(null)
  const [selectedMoodDate, setSelectedMoodDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    const saved = localStorage.getItem('therapick-matches')
    if (saved) setSavedMatches(JSON.parse(saved))

    const appts = localStorage.getItem('therapick-appointments')
    if (appts) setAppointments(JSON.parse(appts))
    
    const moods = localStorage.getItem('therapick-mood-history')
    if (moods) {
      const history = JSON.parse(moods)
      setMoodHistory(history)
      // Check if mood logged today
      const today = new Date().toISOString().split('T')[0]
      const todayEntry = history.find(m => m.date === today)
      if (todayEntry) setTodayMood(todayEntry.mood)
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => console.log('Location access denied')
      )
    }
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 5000) // Change every 5 seconds
    
    return () => clearInterval(interval)
  }, [])

  const toggleMood = (mood) => {
    setSelectedMoods(prev => {
      const isSelected = prev.some(m => m.label === mood.label)
      return isSelected ? prev.filter(m => m.label !== mood.label) : [...prev, mood]
    })
  }

  const searchTherapists = () => {
    if (selectedMoods.length === 0) return
    
    const allSpecialties = selectedMoods.flatMap(mood => mood.specialties)
    let matching = therapistsDatabase.filter(therapist =>
      allSpecialties.some(specialty =>
        therapist.tags.some(tag => tag.toLowerCase().includes(specialty.toLowerCase()))
      )
    )

    // Sort by distance if location available
    if (userLocation) {
      matching = matching.map(t => ({
        ...t,
        distance: calculateDistance(userLocation, t.coordinates)
      })).sort((a, b) => (a.distance || 999) - (b.distance || 999))
    }

    setFilteredTherapists(matching)
    setCurrentView('results')
  }

  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return null
    const R = 3959 // Earth radius in miles
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  const handleTherapistClick = (therapist) => {
    navigate(`/therapist/${therapist.id}`)
  }

  const removeMatch = (therapistId, e) => {
    e.stopPropagation()
    const updated = savedMatches.filter(t => t.id !== therapistId)
    setSavedMatches(updated)
    localStorage.setItem('therapick-matches', JSON.stringify(updated))
  }

  const logMood = (moodType) => {
    const moodEntry = { date: selectedMoodDate, mood: moodType, timestamp: new Date().toISOString() }
    
    const updatedHistory = moodHistory.filter(m => m.date !== selectedMoodDate)
    updatedHistory.push(moodEntry)
    
    setMoodHistory(updatedHistory)
    
    // Update today's mood if selected date is today
    const today = new Date().toISOString().split('T')[0]
    if (selectedMoodDate === today) {
      setTodayMood(moodType)
    }
    
    localStorage.setItem('therapick-mood-history', JSON.stringify(updatedHistory))
  }

  const cancelAppointment = (appointmentId) => {
    const updated = appointments.filter(a => a.id !== appointmentId)
    setAppointments(updated)
    localStorage.setItem('therapick-appointments', JSON.stringify(updated))
    setShowAppointmentModal(false)
    setSelectedAppointment(null)
  }

  const openAppointmentModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentModal(true)
  }

  const getTherapistDetails = (therapistId) => {
    return therapistsDatabase.find(t => t.id === therapistId)
  }

  const openDirections = (therapist) => {
    if (therapist?.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${therapist.coordinates.lat},${therapist.coordinates.lng}`
      window.open(url, '_blank')
    }
  }

  const getMoodIcon = (moodType) => {
    const icons = {
      happy: Smile,
      okay: Meh,
      sad: Frown,
      anxious: AlertCircle,
      great: ThumbsUp
    }
    return icons[moodType] || Meh
  }

  const getMoodColor = (moodType) => {
    const colors = {
      happy: '#C2D8B9',
      okay: '#A1B5D8',
      sad: '#738290',
      anxious: '#E4A853',
      great: '#7BC96F'
    }
    return colors[moodType] || '#A1B5D8'
  }

  const getMoodStats = () => {
    const last30Days = moodHistory.filter(m => {
      const moodDate = new Date(m.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return moodDate >= thirtyDaysAgo
    })
    
    const counts = last30Days.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1
      return acc
    }, {})
    
    return counts
  }

  return (
    <div className="app-container">
      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className={`bottom-nav-button ${currentView === 'matches' ? 'active' : ''}`} onClick={() => setCurrentView('matches')}>
          <Bookmark size={24} />
          <span>Matches</span>
          {savedMatches.length > 0 && <span className="badge">{savedMatches.length}</span>}
        </button>
        <button className={`bottom-nav-button center ${currentView === 'home' || currentView === 'results' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>
          <Search size={28} />
          <span>Find</span>
        </button>
        <button className={`bottom-nav-button ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setCurrentView('profile')}>
          <div className="profile-avatar-mini"><User size={20} /></div>
          <span>Profile</span>
        </button>
      </div>

      {/* Home/Search View */}
      {(currentView === 'home' || currentView === 'results') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-content">
          {currentView === 'home' && (
            <div className="hero-section-modern">
              <h1>Hello, {user?.name || 'there'}</h1>
              <p className="hero-subtitle">How are you feeling today?</p>
              
              <div className="mood-grid-modern">
                {moods.map((mood) => {
                  const MoodIcon = mood.icon
                  const isSelected = selectedMoods.some(m => m.label === mood.label)
                  return (
                    <motion.div
                      key={mood.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mood-card-modern ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleMood(mood)}
                    >
                      <MoodIcon className="mood-icon-modern" />
                      <div className="mood-label-modern">{mood.label}</div>
                    </motion.div>
                  )
                })}
              </div>

              {selectedMoods.length > 0 && (
                <motion.button
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="search-button-modern"
                  onClick={searchTherapists}
                >
                  Find Therapists ({selectedMoods.length} mood{selectedMoods.length > 1 ? 's' : ''})
                </motion.button>
              )}

              {/* Testimonials Carousel */}
              <div className="testimonials-section">
                <h3>What Our Users Say</h3>
                <div className="testimonials-carousel">
                  <button 
                    onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="carousel-button prev"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="testimonial-card"
                    >
                      <div className="testimonial-stars">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} size={18} fill="#C2D8B9" stroke="#C2D8B9" />
                        ))}
                      </div>
                      <p className="testimonial-text">"{testimonials[currentTestimonial].text}"</p>
                      <p className="testimonial-author">— {testimonials[currentTestimonial].name}</p>
                    </motion.div>
                  </AnimatePresence>

                  <button 
                    onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="carousel-button next"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                
                <div className="carousel-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`carousel-dot ${index === currentTestimonial ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'results' && (
            <div className="results-container-redesign">
              <div className="results-header">
                <button onClick={() => setCurrentView('home')} className="back-to-search">
                  <ChevronLeft size={20} />
                  <span>Back to Search</span>
                </button>
                <div className="results-title-section">
                  <h2>Perfect Matches for You</h2>
                  <p className="results-subtitle">{filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''} match your needs</p>
                </div>
              </div>
              
              <div className="therapist-grid-modern">
                {filteredTherapists.map((therapist, index) => (
                  <motion.div
                    key={therapist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="therapist-card-redesign"
                    onClick={() => handleTherapistClick(therapist)}
                  >
                    <div className="therapist-card-top">
                      <div className="therapist-avatar-large">{therapist.name.charAt(0)}</div>
                      {therapist.distance && (
                        <div className="distance-badge">
                          <MapPin size={12} />
                          <span>{therapist.distance.toFixed(1)} mi</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="therapist-card-body">
                      <h3>{therapist.name}</h3>
                      <p className="therapist-credentials">{therapist.credentials}</p>
                      <p className="therapist-specialty">{therapist.specialty}</p>
                      
                      <div className="therapist-rating-row">
                        <div className="rating-display">
                          <Star size={16} fill="#ffc107" stroke="#ffc107" />
                          <span className="rating-number">{therapist.rating}</span>
                          <span className="review-count">({therapist.reviewCount})</span>
                        </div>
                      </div>
                      
                      <div className="therapist-tags-preview">
                        {therapist.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="tag-mini">{tag}</span>
                        ))}
                        {therapist.tags.length > 3 && <span className="tag-more">+{therapist.tags.length - 3}</span>}
                      </div>
                    </div>
                    
                    <div className="therapist-card-footer-new">
                      <div className="footer-info">
                        <MapPin size={14} />
                        <span>{therapist.location}</span>
                      </div>
                      <div className="view-profile-hint">
                        View Profile →
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Matches View */}
      {currentView === 'matches' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-content">
          <div className="matches-header">
            <h2>Saved Matches</h2>
            <p className="matches-subtitle">{savedMatches.length} therapist{savedMatches.length !== 1 ? 's' : ''} saved</p>
          </div>
          {savedMatches.length === 0 ? (
            <div className="empty-state-modern">
              <Bookmark size={64} />
              <p>No saved therapists yet</p>
              <p className="empty-hint">Save therapists from search results to find them here</p>
            </div>
          ) : (
            <div className="matches-list-redesign">
              {savedMatches.map((therapist) => (
                <motion.div 
                  key={therapist.id} 
                  className="match-card-redesign" 
                  onClick={() => handleTherapistClick(therapist)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="match-card-content">
                    <div className="match-avatar">{therapist.name.charAt(0)}</div>
                    <div className="match-info">
                      <h4>{therapist.name}</h4>
                      <p className="match-specialty">{therapist.specialty}</p>
                      <div className="match-meta">
                        <Star size={14} fill="#ffc107" stroke="#ffc107" />
                        <span>{therapist.rating}</span>
                        <span className="match-location">• {therapist.location}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="remove-match-button" 
                    onClick={(e) => removeMatch(therapist.id, e)}
                    title="Remove from saved"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Profile View */}
      {currentView === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-content">
          <div className="profile-header-modern">
            <div className="profile-avatar-large-modern"><User size={48} /></div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
          
          {/* Daily Mood Tracker */}
          <div className="profile-section-modern">
            <h3>Daily Mood Tracker</h3>
            <div className="mood-date-selector">
              <label htmlFor="mood-date">Select Date:</label>
              <input
                id="mood-date"
                type="date"
                value={selectedMoodDate}
                onChange={(e) => {
                  setSelectedMoodDate(e.target.value)
                  const moodForDate = moodHistory.find(m => m.date === e.target.value)
                  setTodayMood(moodForDate ? moodForDate.mood : null)
                }}
                max={new Date().toISOString().split('T')[0]}
                className="mood-date-input"
              />
            </div>
            <p className="mood-tracker-subtitle">
              {selectedMoodDate === new Date().toISOString().split('T')[0] 
                ? 'How are you feeling today?' 
                : `How were you feeling on ${new Date(selectedMoodDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}?`}
            </p>
            <div className="mood-tracker-buttons">
              {['great', 'happy', 'okay', 'anxious', 'sad'].map(mood => {
                const MoodIcon = getMoodIcon(mood)
                const isSelected = todayMood === mood
                return (
                  <motion.button
                    key={mood}
                    className={`mood-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => logMood(mood)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      backgroundColor: isSelected ? getMoodColor(mood) : 'white',
                      color: isSelected ? 'white' : getMoodColor(mood),
                      borderColor: getMoodColor(mood)
                    }}
                  >
                    <MoodIcon size={24} />
                    <span>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                  </motion.button>
                )
              })}
            </div>
            
            {/* Mood Statistics */}
            {moodHistory.length > 0 && (
              <div className="mood-stats">
                <h4>This Month's Mood Summary</h4>
                <div className="mood-stats-grid">
                  {Object.entries(getMoodStats()).map(([mood, count]) => {
                    const MoodIcon = getMoodIcon(mood)
                    return (
                      <div key={mood} className="mood-stat-item">
                        <div className="mood-stat-icon" style={{ backgroundColor: getMoodColor(mood) }}>
                          <MoodIcon size={18} color="white" />
                        </div>
                        <div>
                          <div className="mood-stat-label">{mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
                          <div className="mood-stat-count">{count} day{count !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Mood Calendar */}
            <div className="mood-calendar">
              <h4>Mood Calendar</h4>
              <div className="mood-calendar-grid">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (29 - i))
                  const dateStr = date.toISOString().split('T')[0]
                  const moodEntry = moodHistory.find(m => m.date === dateStr)
                  const MoodIcon = moodEntry ? getMoodIcon(moodEntry.mood) : null
                  
                  return (
                    <div
                      key={dateStr}
                      className="mood-calendar-day"
                      style={{
                        backgroundColor: moodEntry ? getMoodColor(moodEntry.mood) : '#f5f7fa'
                      }}
                      title={moodEntry ? `${date.toLocaleDateString()}: ${moodEntry.mood}` : date.toLocaleDateString()}
                    >
                      {moodEntry && <MoodIcon size={12} color="white" />}
                      {!moodEntry && <span className="calendar-day-number">{date.getDate()}</span>}
                    </div>
                  )
                })}
              </div>
              <p className="mood-calendar-legend">Last 30 days</p>
            </div>
          </div>
          
          <div className="profile-section-modern">
            <h3>Upcoming Appointments</h3>
            {appointments.filter(a => a.status === 'upcoming').length === 0 ? (
              <p className="no-appointments">No upcoming appointments</p>
            ) : (
              <div className="appointments-list">
                {appointments.filter(a => a.status === 'upcoming').map((appt) => (
                  <motion.div 
                    key={appt.id} 
                    className="appointment-card"
                    onClick={() => openAppointmentModal(appt)}
                    whileHover={{ scale: 1.02 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="appointment-info">
                      <h4>{appt.therapistName}</h4>
                      <p className="appointment-specialty">{appt.therapistSpecialty}</p>
                      <p className="appointment-datetime">
                        {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {appt.time}
                      </p>
                    </div>
                    <div className="appointment-arrow">
                      <ChevronRight size={20} color="var(--primary)" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <button onClick={logout} className="logout-button">Logout</button>
        </motion.div>
      )}

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {showAppointmentModal && selectedAppointment && (() => {
          const therapist = getTherapistDetails(selectedAppointment.therapistId)
          if (!therapist) return null
          
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowAppointmentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="appointment-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Appointment Details</h3>
                  <button onClick={() => setShowAppointmentModal(false)} className="modal-close">
                    <X size={24} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* Therapist Info */}
                  <div className="modal-therapist-section">
                    <div className="modal-therapist-header">
                      <div className="modal-therapist-avatar">{therapist.name.charAt(0)}</div>
                      <div>
                        <h4>{therapist.name}</h4>
                        <p className="modal-credentials">{therapist.credentials}</p>
                        <p className="modal-specialty">{therapist.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="modal-rating">
                      <Star size={18} fill="#ffc107" stroke="#ffc107" />
                      <span>{therapist.rating}</span>
                      <span className="modal-review-count">({therapist.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="modal-appointment-section">
                    <h5>Scheduled For</h5>
                    <div className="modal-datetime">
                      <Calendar size={20} />
                      <div>
                        <p className="modal-date">
                          {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="modal-time">{selectedAppointment.time}</p>
                      </div>
                    </div>
                    {selectedAppointment.notes && (
                      <div className="modal-notes">
                        <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Contact & Location */}
                  <div className="modal-contact-section">
                    <h5>Contact & Location</h5>
                    <div className="modal-contact-list">
                      <a href={`tel:${therapist.phone}`} className="modal-contact-item">
                        <Phone size={18} />
                        <span>{therapist.phone}</span>
                      </a>
                      <a href={`mailto:${therapist.email}`} className="modal-contact-item">
                        <Mail size={18} />
                        <span>{therapist.email}</span>
                      </a>
                      <div className="modal-contact-item">
                        <MapPin size={18} />
                        <span>{therapist.fullAddress}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => openDirections(therapist)}
                      className="modal-directions-button"
                    >
                      <MapPin size={18} />
                      Get Directions
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <button 
                    className="modal-reschedule-button"
                    onClick={() => {
                      setShowAppointmentModal(false)
                      navigate(`/booking/${therapist.id}`)
                    }}
                  >
                    <Calendar size={18} />
                    Reschedule
                  </button>
                  <button 
                    className="modal-cancel-button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this appointment?')) {
                        cancelAppointment(selectedAppointment.id)
                      }
                    }}
                  >
                    <X size={18} />
                    Cancel Appointment
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
