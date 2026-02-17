const MoodEntry = require('../models/MoodEntry');
const { successResponse, AppError } = require('../utils/responses');

/**
 * @desc    Log mood entry
 * @route   POST /api/moods
 * @access  Private
 */
const logMood = async (req, res, next) => {
  try {
    const { date, mood, notes, triggers, activities } = req.body;

    if (!mood) {
      throw new AppError('Please provide a mood', 400);
    }

    const moodDate = date ? new Date(date) : new Date();

    // Check if mood entry already exists for this date
    const existingEntry = await MoodEntry.findOne({
      user: req.user.id,
      date: {
        $gte: new Date(moodDate.setHours(0, 0, 0, 0)),
        $lt: new Date(moodDate.setHours(23, 59, 59, 999))
      }
    });

    let moodEntry;

    if (existingEntry) {
      // Update existing entry
      existingEntry.mood = mood;
      if (notes !== undefined) existingEntry.notes = notes;
      if (triggers) existingEntry.triggers = triggers;
      if (activities) existingEntry.activities = activities;
      moodEntry = await existingEntry.save();
    } else {
      // Create new entry
      moodEntry = await MoodEntry.create({
        user: req.user.id,
        date: moodDate,
        mood,
        notes,
        triggers,
        activities
      });
    }

    return successResponse(res, existingEntry ? 200 : 201, 'Mood logged successfully', {
      moodEntry
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mood entries
 * @route   GET /api/moods
 * @access  Private
 */
const getMoodEntries = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    const query = { user: req.user.id };

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.date = { $gte: thirtyDaysAgo };
    }

    const moodEntries = await MoodEntry.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Mood entries retrieved successfully', {
      moodEntries,
      count: moodEntries.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mood statistics
 * @route   GET /api/moods/stats
 * @access  Private
 */
const getMoodStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })();

    const end = endDate ? new Date(endDate) : new Date();

    const stats = await MoodEntry.getMoodStats(req.user.id, start, end);

    // Calculate mood trends
    const entries = await MoodEntry.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    const moodScores = {
      great: 5,
      happy: 4,
      okay: 3,
      anxious: 2,
      sad: 1
    };

    const averageScore = entries.length > 0
      ? entries.reduce((sum, entry) => sum + (moodScores[entry.mood] || 3), 0) / entries.length
      : 3;

    // Get most common triggers and activities
    const triggers = {};
    const activities = {};

    entries.forEach(entry => {
      if (entry.triggers) {
        entry.triggers.forEach(trigger => {
          triggers[trigger] = (triggers[trigger] || 0) + 1;
        });
      }
      if (entry.activities) {
        entry.activities.forEach(activity => {
          activities[activity] = (activities[activity] || 0) + 1;
        });
      }
    });

    const topTriggers = Object.entries(triggers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));

    const topActivities = Object.entries(activities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }));

    return successResponse(res, 200, 'Mood statistics retrieved successfully', {
      stats,
      averageScore: averageScore.toFixed(2),
      totalEntries: entries.length,
      dateRange: { start, end },
      topTriggers,
      topActivities
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete mood entry
 * @route   DELETE /api/moods/:id
 * @access  Private
 */
const deleteMoodEntry = async (req, res, next) => {
  try {
    const moodEntry = await MoodEntry.findById(req.params.id);

    if (!moodEntry) {
      throw new AppError('Mood entry not found', 404);
    }

    // Check if mood entry belongs to user
    if (moodEntry.user.toString() !== req.user.id) {
      throw new AppError('Not authorized to delete this mood entry', 403);
    }

    await moodEntry.deleteOne();

    return successResponse(res, 200, 'Mood entry deleted successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  logMood,
  getMoodEntries,
  getMoodStats,
  deleteMoodEntry
};
