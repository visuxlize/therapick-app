const mongoose = require('mongoose');

const savedTherapistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapistId: {
    type: String,
    required: [true, 'Therapist ID is required']
  },
  therapistData: {
    // Store snapshot of therapist data when saved
    name: String,
    specialty: String,
    rating: Number,
    location: String
  },
  moods: [{
    type: String
  }],
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate saves
savedTherapistSchema.index({ user: 1, therapistId: 1 }, { unique: true });

// Index for querying user's saved therapists
savedTherapistSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SavedTherapist', savedTherapistSchema);
