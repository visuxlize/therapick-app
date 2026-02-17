const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapistId: {
    type: String,
    required: [true, 'Therapist ID is required']
  },
  therapistName: {
    type: String,
    required: true
  },
  therapistSpecialty: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
    default: 'upcoming'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String,
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for querying user appointments
appointmentSchema.index({ user: 1, date: -1 });
appointmentSchema.index({ status: 1, date: 1 });

// Validate that appointment date is in the future
appointmentSchema.pre('save', function(next) {
  if (this.isNew && this.date < new Date()) {
    next(new Error('Appointment date must be in the future'));
  }
  next();
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentDate = new Date(this.date);
  const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
  
  // Allow cancellation if appointment is more than 24 hours away
  return hoursDifference > 24;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
