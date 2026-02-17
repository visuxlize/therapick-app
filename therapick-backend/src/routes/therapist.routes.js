const express = require('express');
const router = express.Router();
const {
  searchTherapists,
  getTherapistById,
  getTherapistReviews,
  getSpecialties
} = require('../controllers/therapist.controller');
const { optionalAuth } = require('../middleware/auth');

// Public routes (with optional authentication for personalization)
router.get('/search', optionalAuth, searchTherapists);
router.get('/specialties', getSpecialties);
router.get('/:id', optionalAuth, getTherapistById);
router.get('/:id/reviews', getTherapistReviews);

module.exports = router;
