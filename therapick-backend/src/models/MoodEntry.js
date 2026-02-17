const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  mood: {
    type: String,
    enum: ['great', 'happy', 'okay', 'anxious', 'sad'],
    required: [true, 'Mood is required']
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  },
  triggers: [{
    type: String,
    enum: ['work', 'relationships', 'health', 'financial', 'family', 'other']
  }],
  activities: [{
    type: String,
    enum: ['exercise', 'meditation', 'therapy', 'socializing', 'hobbies', 'rest', 'other']
  }]
}, {
  timestamps: true
});

// Compound index to ensure one mood entry per user per day
moodEntrySchema.index({ user: 1, date: 1 }, { unique: true });

// Index for querying user's mood history
moodEntrySchema.index({ user: 1, date: -1 });

// Normalize date to start of day
moodEntrySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('date')) {
    const date = new Date(this.date);
    date.setHours(0, 0, 0, 0);
    this.date = date;
  }
  next();
});

// Static method to get mood statistics for a user
moodEntrySchema.statics.getMoodStats = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        mood: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
};

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
