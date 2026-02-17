const therapapiService = require('../services/therapapi.service');
const { successResponse, AppError } = require('../utils/responses');

/**
 * Mood to specialty mapping
 */
const MOOD_SPECIALTY_MAP = {
  'Sad/Depressed': ['Depression', 'Mood Disorders', 'CBT'],
  'Anxious': ['Anxiety', 'Panic Disorders', 'Stress Management'],
  'Angry/Frustrated': ['Anger Management', 'Emotional Regulation', 'Conflict Resolution'],
  'Heartbroken': ['Relationship Therapy', 'Couples Counseling', 'Grief Counseling'],
  'Stressed/Burnout': ['Stress Management', 'Work-Life Balance', 'Mindfulness'],
  'Confused/Lost': ['Life Coaching', 'Career Counseling', 'Identity Exploration'],
  'Lonely': ['Social Skills', 'Connection Building', 'Depression'],
  'Traumatized': ['Trauma Therapy', 'PTSD', 'EMDR']
};

/**
 * @desc    Search therapists
 * @route   GET /api/therapists/search
 * @access  Public
 */
const searchTherapists = async (req, res, next) => {
  try {
    const {
      moods,
      location,
      latitude,
      longitude,
      radius,
      insurance,
      gender,
      language,
      limit = 20,
      offset = 0
    } = req.query;

    // Build search parameters
    const searchParams = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    // Add location parameters
    if (location) {
      searchParams.location = location;
    } else if (latitude && longitude) {
      searchParams.latitude = parseFloat(latitude);
      searchParams.longitude = parseFloat(longitude);
    } else {
      // Default to New York City if no location provided
      searchParams.location = 'New York, NY';
    }

    if (radius) {
      searchParams.radius = parseInt(radius);
    }

    // Map moods to specialties
    if (moods) {
      const moodArray = typeof moods === 'string' ? [moods] : moods;
      const specialties = new Set();
      
      moodArray.forEach(mood => {
        const mappedSpecialties = MOOD_SPECIALTY_MAP[mood];
        if (mappedSpecialties) {
          mappedSpecialties.forEach(spec => specialties.add(spec));
        }
      });

      searchParams.specialties = Array.from(specialties);
    }

    // Add other filters
    if (insurance) {
      searchParams.insurance = typeof insurance === 'string' ? [insurance] : insurance;
    }

    if (gender) {
      searchParams.gender = gender;
    }

    if (language) {
      searchParams.language = language;
    }

    // Call TherapAPI
    const result = await therapapiService.searchTherapists(searchParams);

    return successResponse(res, 200, 'Therapists retrieved successfully', {
      therapists: result.therapists,
      total: result.total,
      hasMore: result.hasMore,
      filters: {
        moods: moods ? (typeof moods === 'string' ? [moods] : moods) : [],
        specialties: searchParams.specialties || [],
        location: searchParams.location || null,
        radius: searchParams.radius || 25
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get therapist by ID
 * @route   GET /api/therapists/:id
 * @access  Public
 */
const getTherapistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const therapist = await therapapiService.getTherapistById(id);

    if (!therapist) {
      throw new AppError('Therapist not found', 404);
    }

    return successResponse(res, 200, 'Therapist retrieved successfully', {
      therapist
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get therapist reviews
 * @route   GET /api/therapists/:id/reviews
 * @access  Public
 */
const getTherapistReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reviews = await therapapiService.getTherapistReviews(id);

    return successResponse(res, 200, 'Reviews retrieved successfully', {
      reviews
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get available specialties
 * @route   GET /api/therapists/specialties
 * @access  Public
 */
const getSpecialties = async (req, res, next) => {
  try {
    const specialties = await therapapiService.getSpecialties();

    return successResponse(res, 200, 'Specialties retrieved successfully', {
      specialties,
      moodMap: MOOD_SPECIALTY_MAP
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchTherapists,
  getTherapistById,
  getTherapistReviews,
  getSpecialties
};
