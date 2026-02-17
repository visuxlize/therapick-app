const express = require('express');
const router = express.Router();
const {
  saveTherapist,
  getSavedTherapists,
  removeSavedTherapist,
  checkIfSaved
} = require('../controllers/savedTherapist.controller');
const { protect } = require('../middleware/auth');

// All saved therapist routes require authentication
router.use(protect);

router.post('/', saveTherapist);
router.get('/', getSavedTherapists);
router.get('/check/:therapistId', checkIfSaved);
router.delete('/:therapistId', removeSavedTherapist);

module.exports = router;
