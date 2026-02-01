import { useState, useEffect } from 'react'
import { Heart, Search, Bookmark, MapPin, Clock, Award, Phone, Mail, Calendar, User, CloudRain, Zap, Flame, HeartCrack, Wind, HelpCircle, UserX, Shield, CheckCircle, Settings, ArrowLeft, ChevronRight } from 'lucide-react'

// Mood categories with associated therapist specialties
const moods = [
  { 
    icon: CloudRain, 
    label: 'Sad/Depressed', 
    description: 'Feeling down, hopeless, or losing interest',
    specialties: ['Depression', 'Mood Disorders', 'CBT']
  },
  { 
    icon: Zap, 
    label: 'Anxious', 
    description: 'Worried, nervous, or panic attacks',
    specialties: ['Anxiety', 'Panic Disorders', 'Stress Management']
  },
  { 
    icon: Flame, 
    label: 'Angry/Frustrated', 
    description: 'Anger issues or feeling irritable',
    specialties: ['Anger Management', 'Emotional Regulation', 'Conflict Resolution']
  },
  { 
    icon: HeartCrack, 
    label: 'Heartbroken', 
    description: 'Relationship problems or breakup',
    specialties: ['Relationship Therapy', 'Couples Counseling', 'Grief Counseling']
  },
  { 
    icon: Wind, 
    label: 'Stressed/Burnout', 
    description: 'Overwhelmed, exhausted, or burnt out',
    specialties: ['Stress Management', 'Work-Life Balance', 'Mindfulness']
  },
  { 
    icon: HelpCircle, 
    label: 'Confused/Lost', 
    description: 'Life direction or identity questions',
    specialties: ['Life Coaching', 'Career Counseling', 'Identity Exploration']
  },
  { 
    icon: UserX, 
    label: 'Lonely', 
    description: 'Feeling isolated or disconnected',
    specialties: ['Social Skills', 'Connection Building', 'Depression']
  },
  { 
    icon: Shield, 
    label: 'Traumatized', 
    description: 'Past trauma or PTSD symptoms',
    specialties: ['Trauma Therapy', 'PTSD', 'EMDR']
  },
]

// Mock therapist database
const therapistsDatabase = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Depression & Mood Disorders',
    experience: '12 years',
    location: 'Manhattan, NY',
    bio: 'Specializing in Cognitive Behavioral Therapy (CBT) for depression and mood disorders. I provide a safe, non-judgmental space for healing.',
    tags: ['Depression', 'CBT', 'Mood Disorders', 'Anxiety'],
    rating: 4.9,
    availability: 'Next available: Tomorrow',
    insurance: 'Most major insurance accepted',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@therapy.com'
  },
  {
    id: 2,
    name: 'Michael Chen, LMFT',
    specialty: 'Anxiety & Stress Management',
    experience: '8 years',
    location: 'Brooklyn, NY',
    bio: 'I help clients manage anxiety and stress through evidence-based techniques including mindfulness and exposure therapy.',
    tags: ['Anxiety', 'Panic Disorders', 'Stress Management', 'Mindfulness'],
    rating: 4.8,
    availability: 'Next available: This week',
    insurance: 'Aetna, Blue Cross, UnitedHealthcare',
    phone: '(555) 234-5678',
    email: 'mchen@therapy.com'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Trauma & PTSD',
    experience: '15 years',
    location: 'Queens, NY',
    bio: 'Board-certified in trauma therapy and EMDR. I specialize in helping survivors process and heal from traumatic experiences.',
    tags: ['Trauma Therapy', 'PTSD', 'EMDR', 'Sexual Assault'],
    rating: 5.0,
    availability: 'Next available: 2 weeks',
    insurance: 'Most major insurance accepted',
    phone: '(555) 345-6789',
    email: 'emily.rodriguez@therapy.com'
  },
  {
    id: 4,
    name: 'James Wilson, LCSW',
    specialty: 'Relationship & Couples Therapy',
    experience: '10 years',
    location: 'Manhattan, NY',
    bio: 'Helping couples and individuals navigate relationship challenges, communication issues, and emotional intimacy.',
    tags: ['Relationship Therapy', 'Couples Counseling', 'Communication', 'Conflict Resolution'],
    rating: 4.7,
    availability: 'Next available: 3 days',
    insurance: 'Cigna, Aetna, Oscar',
    phone: '(555) 456-7890',
    email: 'jwilson@therapy.com'
  },
  {
    id: 5,
    name: 'Dr. Aisha Patel',
    specialty: 'Life Coaching & Career Counseling',
    experience: '7 years',
    location: 'Remote (Online)',
    bio: 'Guiding professionals through career transitions, life changes, and personal growth. Virtual sessions available.',
    tags: ['Life Coaching', 'Career Counseling', 'Identity Exploration', 'Goal Setting'],
    rating: 4.9,
    availability: 'Next available: Today',
    insurance: 'Self-pay, FSA/HSA accepted',
    phone: '(555) 567-8901',
    email: 'aisha.patel@therapy.com'
  },
  {
    id: 6,
    name: 'Robert Thompson, PhD',
    specialty: 'Anger Management',
    experience: '20 years',
    location: 'Bronx, NY',
    bio: 'Expert in anger management and emotional regulation. I help clients develop healthy coping strategies and communication skills.',
    tags: ['Anger Management', 'Emotional Regulation', 'Conflict Resolution', 'Family Therapy'],
    rating: 4.8,
    availability: 'Next available: 1 week',
    insurance: 'Medicare, Medicaid, most major insurance',
    phone: '(555) 678-9012',
    email: 'rthompson@therapy.com'
  },
  {
    id: 7,
    name: 'Lisa Martinez, LMHC',
    specialty: 'Grief & Loss Counseling',
    experience: '9 years',
    location: 'Staten Island, NY',
    bio: 'Compassionate support for those experiencing grief, loss, or major life transitions. You don\'t have to go through it alone.',
    tags: ['Grief Counseling', 'Loss', 'Life Transitions', 'Depression'],
    rating: 5.0,
    availability: 'Next available: 5 days',
    insurance: 'Most major insurance accepted',
    phone: '(555) 789-0123',
    email: 'lmartinez@therapy.com'
  },
  {
    id: 8,
    name: 'Dr. David Kim',
    specialty: 'Mindfulness & Stress Reduction',
    experience: '11 years',
    location: 'Manhattan, NY',
    bio: 'Integrating mindfulness-based approaches with traditional therapy to help clients find balance and reduce stress.',
    tags: ['Mindfulness', 'Stress Management', 'Meditation', 'Work-Life Balance'],
    rating: 4.9,
    availability: 'Next available: Tomorrow',
    insurance: 'Oxford, UnitedHealthcare, Cigna',
    phone: '(555) 890-1234',
    email: 'dkim@therapy.com'
  },
]

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedMoods, setSelectedMoods] = useState([])
  const [filteredTherapists, setFilteredTherapists] = useState([])
  const [savedMatches, setSavedMatches] = useState([])
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterInsurance, setFilterInsurance] = useState('all')
  const [moodHistory, setMoodHistory] = useState([])

  // Load saved matches and mood history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('therapick-matches')
    if (saved) {
      setSavedMatches(JSON.parse(saved))
    }
    
    const history = localStorage.getItem('therapick-mood-history')
    if (history) {
      setMoodHistory(JSON.parse(history))
    }
  }, [])

  // Toggle mood selection
  const toggleMood = (mood) => {
    setSelectedMoods(prev => {
      const isSelected = prev.some(m => m.label === mood.label)
      if (isSelected) {
        return prev.filter(m => m.label !== mood.label)
      } else {
        return [...prev, mood]
      }
    })
  }

  // Filter therapists based on selected moods
  const searchTherapists = () => {
    if (selectedMoods.length === 0) {
      setFilteredTherapists([])
      return
    }

    // Collect all specialties from selected moods
    const allSpecialties = selectedMoods.flatMap(mood => mood.specialties)

    const matchingTherapists = therapistsDatabase.filter(therapist => {
      return allSpecialties.some(specialty => 
        therapist.tags.some(tag => 
          tag.toLowerCase().includes(specialty.toLowerCase())
        )
      )
    })

    setFilteredTherapists(matchingTherapists)
    setCurrentView('results')
  }

  // Save/bookmark a therapist
  const saveMatch = (therapist) => {
    const match = {
      ...therapist,
      savedDate: new Date().toISOString(),
      moods: selectedMoods.map(m => m.label).join(', ') || 'General'
    }

    const updated = [...savedMatches, match]
    setSavedMatches(updated)
    localStorage.setItem('therapick-matches', JSON.stringify(updated))
    alert(`${therapist.name} saved to your matches!`)
  }

  // Log mood for today
  const logMoodForToday = (mood) => {
    const today = new Date().toISOString().split('T')[0]
    const existingEntry = moodHistory.find(entry => entry.date === today)
    
    let updated
    if (existingEntry) {
      // Update existing entry
      updated = moodHistory.map(entry => 
        entry.date === today 
          ? { ...entry, moods: [...new Set([...entry.moods, mood.label])] }
          : entry
      )
    } else {
      // Create new entry
      updated = [...moodHistory, { date: today, moods: [mood.label], icon: mood.icon }]
    }
    
    setMoodHistory(updated)
    localStorage.setItem('therapick-mood-history', JSON.stringify(updated))
  }

  // Remove saved match
  const removeMatch = (therapistId) => {
    const updated = savedMatches.filter(match => match.id !== therapistId)
    setSavedMatches(updated)
    localStorage.setItem('therapick-matches', JSON.stringify(updated))
  }

  // Check if therapist is already saved
  const isTherapistSaved = (therapistId) => {
    return savedMatches.some(match => match.id === therapistId)
  }

  // Apply additional filters
  const getFilteredResults = () => {
    let results = [...filteredTherapists]

    if (filterLocation !== 'all') {
      results = results.filter(t => t.location.includes(filterLocation))
    }

    if (filterInsurance !== 'all') {
      results = results.filter(t => 
        t.insurance.toLowerCase().includes(filterInsurance.toLowerCase())
      )
    }

    return results
  }

  return (
    <div className="app-container">
      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <button 
          className={`bottom-nav-button ${currentView === 'matches' ? 'active' : ''}`}
          onClick={() => setCurrentView('matches')}
        >
          <Bookmark size={24} />
          <span>Matches</span>
          {savedMatches.length > 0 && <span className="badge">{savedMatches.length}</span>}
        </button>
        <button 
          className={`bottom-nav-button center ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <Search size={28} />
          <span>Find Therapist</span>
        </button>
        <button 
          className={`bottom-nav-button ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
        >
          <div className="profile-avatar-mini">
            <User size={20} />
          </div>
          <span>Profile</span>
        </button>
      </div>

      {/* Home View */}
      {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h1>Therapick</h1>
              <p className="hero-tagline">Finding Therapists The Easy Way</p>
              <p className="hero-description">
                We've all been through things in life, and sometimes having someone to talk to would be ideal. 
                Finding a therapist can be daunting, but it doesn't have to be. Therapick makes it stress-free 
                by tailoring suggestions based on how you feel.
              </p>
              <button 
                className="cta-button"
                onClick={() => {
                  if (selectedMoods.length > 0) {
                    searchTherapists()
                  } else {
                    document.getElementById('mood-section').scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {selectedMoods.length > 0 ? `Find Therapists (${selectedMoods.length} mood${selectedMoods.length > 1 ? 's' : ''} selected)` : 'Get Started'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* Mood Check Section */}
            <div id="mood-section" className="mood-check-section">
              <h2 className="section-title">How are you feeling today?</h2>
              <p className="section-subtitle">
                Select the mood that best describes how you're feeling. We'll match you with therapists who specialize in helping with these feelings.
              </p>

              <div className="mood-grid">
                {moods.map((mood) => {
                  const MoodIcon = mood.icon;
                  const isSelected = selectedMoods.some(m => m.label === mood.label);
                  return (
                    <div
                      key={mood.label}
                      className={`mood-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleMood(mood)}
                    >
                      <MoodIcon className="mood-icon" />
                      <div className="mood-label">{mood.label}</div>
                      <div className="mood-description">{mood.description}</div>
                    </div>
                  );
                })}
              </div>

              {selectedMoods.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle size={24} style={{ color: '#26a69a' }} />
                  <p style={{ fontSize: '1.1rem', color: '#26a69a', fontWeight: '600', margin: 0 }}>
                    {selectedMoods.length} mood{selectedMoods.length > 1 ? 's' : ''} selected. Click "Get Started" to find matching therapists.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Results View */}
      {currentView === 'results' && (
        <div className="main-content">
          <div className="results-section">
            <div className="results-header">
              <h2 className="section-title">
                Therapists for {selectedMoods.map(m => m.label).join(', ')}
              </h2>
              <p className="section-subtitle">
                {getFilteredResults().length} therapists matched to your needs
              </p>
            </div>

            {/* Filters */}
            <div className="filter-bar">
              <select 
                className="filter-select"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="Manhattan">Manhattan</option>
                <option value="Brooklyn">Brooklyn</option>
                <option value="Queens">Queens</option>
                <option value="Bronx">Bronx</option>
                <option value="Staten Island">Staten Island</option>
                <option value="Remote">Remote/Online</option>
              </select>

              <select 
                className="filter-select"
                value={filterInsurance}
                onChange={(e) => setFilterInsurance(e.target.value)}
              >
                <option value="all">All Insurance</option>
                <option value="Aetna">Aetna</option>
                <option value="Blue Cross">Blue Cross</option>
                <option value="UnitedHealthcare">UnitedHealthcare</option>
                <option value="Cigna">Cigna</option>
                <option value="Medicare">Medicare</option>
              </select>
            </div>

            {/* Therapist Grid */}
            {getFilteredResults().length === 0 ? (
              <div className="empty-state">
                <Search />
                <h3>No therapists found</h3>
                <p>Try adjusting your filters or select a different mood</p>
              </div>
            ) : (
              <div className="therapist-grid">
                {getFilteredResults().map((therapist) => (
                  <div key={therapist.id} className="therapist-card">
                    <div className="therapist-header">
                      <div className="therapist-avatar">
                        {therapist.name.charAt(0)}
                      </div>
                      <div className="therapist-info">
                        <h3>{therapist.name}</h3>
                        <div className="therapist-specialty">{therapist.specialty}</div>
                      </div>
                    </div>

                    <div className="therapist-details">
                      <div className="detail-item">
                        <Award />
                        <span>{therapist.experience} experience</span>
                      </div>
                      <div className="detail-item">
                        <MapPin />
                        <span>{therapist.location}</span>
                      </div>
                      <div className="detail-item">
                        <Clock />
                        <span>{therapist.availability}</span>
                      </div>
                      <div className="detail-item">
                        <Heart />
                        <span>{therapist.rating}/5.0 rating</span>
                      </div>
                    </div>

                    <p className="therapist-bio">{therapist.bio}</p>

                    <div className="tags">
                      {therapist.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#607d8b' }}>
                      <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        <span>{therapist.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                        <span>{therapist.email}</span>
                      </div>
                    </div>

                    <button 
                      className="contact-button"
                      onClick={() => !isTherapistSaved(therapist.id) && saveMatch(therapist)}
                      style={isTherapistSaved(therapist.id) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    >
                      {isTherapistSaved(therapist.id) ? '✓ Saved to Matches' : 'Save to My Matches'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Matches View */}
      {currentView === 'matches' && (
        <div className="main-content">
          <div className="results-section">
            <div className="results-header">
              <h2 className="section-title">My Saved Matches</h2>
              <p className="section-subtitle">
                Therapists you've bookmarked for later
              </p>
            </div>

            {savedMatches.length === 0 ? (
              <div className="empty-state">
                <Bookmark />
                <h3>No saved matches yet</h3>
                <p>Start by selecting how you're feeling and save therapists you'd like to contact later.</p>
                <button 
                  className="cta-button"
                  onClick={() => setCurrentView('home')}
                  style={{ marginTop: '20px' }}
                >
                  Find Therapists
                </button>
              </div>
            ) : (
              <div className="my-matches-section">
                {savedMatches.map((therapist) => (
                  <div key={therapist.id} className="match-item">
                    <div className="match-info">
                      <h4>{therapist.name}</h4>
                      <p style={{ color: '#607d8b', fontSize: '0.9rem' }}>
                        {therapist.specialty} • {therapist.location}
                      </p>
                      <p className="match-date">
                        Saved on {new Date(therapist.savedDate).toLocaleDateString()} 
                        {therapist.moods && ` for ${therapist.moods}`}
                      </p>
                      <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <Phone size={16} />
                          <span>{therapist.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} />
                          <span>{therapist.email}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeMatch(therapist.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile View */}
      {currentView === 'profile' && (
        <div className="main-content">
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar-large">
                <User size={48} />
              </div>
              <h2 className="profile-name">My Profile</h2>
              <p className="profile-email">user@therapick.com</p>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <Bookmark size={24} />
                <div className="stat-value">{savedMatches.length}</div>
                <div className="stat-label">Saved Matches</div>
              </div>
              <div className="stat-card">
                <Calendar size={24} />
                <div className="stat-value">{moodHistory.length}</div>
                <div className="stat-label">Days Tracked</div>
              </div>
            </div>

            <button 
              className="settings-button"
              onClick={() => setCurrentView('settings')}
            >
              <Settings size={20} />
              <span>Settings & Mood Tracker</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Settings View with Mood Tracker */}
      {currentView === 'settings' && (
        <div className="main-content">
          <div className="settings-section">
            <button 
              className="back-button"
              onClick={() => setCurrentView('profile')}
            >
              <ArrowLeft size={20} />
              <span>Back to Profile</span>
            </button>

            <h2 className="section-title">Settings</h2>

            {/* Mood Tracker Section */}
            <div className="mood-tracker-section">
              <h3 className="subsection-title">Mood Tracker</h3>
              <p className="section-subtitle">
                Log your daily moods to reflect on your emotional journey
              </p>

              {/* Today's Mood Logger */}
              <div className="mood-logger">
                <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>How are you feeling today?</h4>
                <div className="mood-grid-compact">
                  {moods.map((mood) => {
                    const MoodIcon = mood.icon;
                    const today = new Date().toISOString().split('T')[0];
                    const todayEntry = moodHistory.find(entry => entry.date === today);
                    const isLoggedToday = todayEntry?.moods.includes(mood.label);
                    
                    return (
                      <div
                        key={mood.label}
                        className={`mood-tracker-card ${isLoggedToday ? 'logged' : ''}`}
                        onClick={() => logMoodForToday(mood)}
                        title={mood.label}
                      >
                        <MoodIcon size={32} />
                        <span className="mood-tracker-label">{mood.label.split('/')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mood History */}
              <div className="mood-history">
                <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Your Mood History</h4>
                {moodHistory.length === 0 ? (
                  <div className="empty-state-small">
                    <p>No mood entries yet. Start tracking your moods above!</p>
                  </div>
                ) : (
                  <div className="mood-history-list">
                    {[...moodHistory].reverse().slice(0, 14).map((entry, index) => (
                      <div key={index} className="mood-history-item">
                        <div className="mood-history-date">
                          <Calendar size={16} />
                          <span>{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="mood-history-moods">
                          {entry.moods.map((moodLabel, idx) => (
                            <span key={idx} className="mood-history-badge">{moodLabel}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
