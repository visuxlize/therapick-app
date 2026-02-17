const SavedTherapist = require('../models/SavedTherapist');
const therapapiService = require('../services/therapapi.service');
const { successResponse, AppError } = require('../utils/responses');

/**
 * @desc    Save therapist
 * @route   POST /api/saved-therapists
 * @access  Private
 */
const saveTherapist = async (req, res, next) => {
  try {
    const { therapistId, moods, notes } = req.body;

    if (!therapistId) {
      throw new AppError('Please provide therapist ID', 400);
    }

    // Get therapist data from TherapAPI
    let therapistData;
    try {
      const therapist = await therapapiService.getTherapistById(therapistId);
      therapistData = {
        name: therapist.name,
        specialty: therapist.specialty || therapist.specialties?.[0],
        rating: therapist.rating,
        location: therapist.location || therapist.city
      };
    } catch (error) {
      // If TherapAPI fails, use provided data
      therapistData = {
        name: req.body.therapistName || 'Unknown',
        specialty: req.body.therapistSpecialty || 'Unknown',
        rating: req.body.therapistRating || 0,
        location: req.body.therapistLocation || 'Unknown'
      };
    }

    // Check if already saved
    const existing = await SavedTherapist.findOne({
      user: req.user.id,
      therapistId
    });

    if (existing) {
      // Update existing saved therapist
      existing.moods = moods || existing.moods;
      existing.notes = notes !== undefined ? notes : existing.notes;
      existing.therapistData = therapistData;
      await existing.save();

      return successResponse(res, 200, 'Saved therapist updated successfully', {
        savedTherapist: existing
      });
    }

    // Create new saved therapist
    const savedTherapist = await SavedTherapist.create({
      user: req.user.id,
      therapistId,
      therapistData,
      moods,
      notes
    });

    return successResponse(res, 201, 'Therapist saved successfully', {
      savedTherapist
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get saved therapists
 * @route   GET /api/saved-therapists
 * @access  Private
 */
const getSavedTherapists = async (req, res, next) => {
  try {
    const savedTherapists = await SavedTherapist.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Saved therapists retrieved successfully', {
      savedTherapists,
      count: savedTherapists.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove saved therapist
 * @route   DELETE /api/saved-therapists/:therapistId
 * @access  Private
 */
const removeSavedTherapist = async (req, res, next) => {
  try {
    const { therapistId } = req.params;

    const savedTherapist = await SavedTherapist.findOneAndDelete({
      user: req.user.id,
      therapistId
    });

    if (!savedTherapist) {
      throw new AppError('Saved therapist not found', 404);
    }

    return successResponse(res, 200, 'Therapist removed from saved list');

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if therapist is saved
 * @route   GET /api/saved-therapists/check/:therapistId
 * @access  Private
 */
const checkIfSaved = async (req, res, next) => {
  try {
    const { therapistId } = req.params;

    const savedTherapist = await SavedTherapist.findOne({
      user: req.user.id,
      therapistId
    });

    return successResponse(res, 200, 'Check completed', {
      isSaved: !!savedTherapist,
      savedTherapist
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveTherapist,
  getSavedTherapists,
  removeSavedTherapist,
  checkIfSaved
};
