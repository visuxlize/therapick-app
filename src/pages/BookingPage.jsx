import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Calendar, Clock, CheckCircle } from 'lucide-react'
import { therapistsDatabase } from '../data/therapists'

function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [therapist, setTherapist] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const found = therapistsDatabase.find(t => t.id === parseInt(id))
    setTherapist(found)

    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split('T')[0])
  }, [id])

  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time')
      return
    }

    const appointment = {
      id: Date.now(),
      therapistId: therapist.id,
      therapistName: therapist.name,
      therapistSpecialty: therapist.specialty,
      date: selectedDate,
      time: selectedTime,
      notes: notes,
      status: 'upcoming',
      bookedAt: new Date().toISOString()
    }

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('therapick-appointments') || '[]')
    appointments.push(appointment)
    localStorage.setItem('therapick-appointments', JSON.stringify(appointments))

    setConfirmed(true)
    
    // Redirect to profile after 2 seconds
    setTimeout(() => {
      navigate('/home')
    }, 2000)
  }

  if (!therapist) {
    return <div className="loading">Loading...</div>
  }

  if (confirmed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="booking-confirmed"
      >
        <CheckCircle size={80} className="confirm-icon" />
        <h2>Appointment Confirmed!</h2>
        <p>You'll receive a confirmation email shortly.</p>
        <div className="appointment-summary">
          <p><strong>{therapist.name}</strong></p>
          <p>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>{selectedTime}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="booking-page"
    >
      <div className="booking-header">
        <button onClick={() => navigate(-1)} className="back-button-booking">
          <ArrowLeft size={24} />
        </button>
        <h2>Book Appointment</h2>
      </div>

      <div className="booking-content">
        <div className="booking-therapist-info">
          <div className="booking-therapist-avatar">
            {therapist.name.charAt(0)}
          </div>
          <div>
            <h3>{therapist.name}</h3>
            <p>{therapist.specialty}</p>
          </div>
        </div>

        <div className="booking-section">
          <label className="booking-label">
            <Calendar size={20} />
            <span>Select Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="booking-date-input"
          />
        </div>

        <div className="booking-section">
          <label className="booking-label">
            <Clock size={20} />
            <span>Select Time</span>
          </label>
          <div className="time-slots">
            {availableTimeSlots.map((time) => (
              <button
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="booking-section">
          <label className="booking-label">
            <span>Additional Notes (Optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific concerns or topics you'd like to discuss..."
            className="booking-notes"
            rows={4}
          />
        </div>

        <button onClick={handleBooking} className="confirm-booking-button">
          Confirm Appointment
        </button>
      </div>
    </motion.div>
  )
}

export default BookingPage
