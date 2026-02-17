const express = require('express');
const router = express.Router();
const {
  logMood,
  getMoodEntries,
  getMoodStats,
  deleteMoodEntry
} = require('../controllers/mood.controller');
const { protect } = require('../middleware/auth');

// All mood routes require authentication
router.use(protect);

router.post('/', logMood);
router.get('/', getMoodEntries);
router.get('/stats', getMoodStats);
router.delete('/:id', deleteMoodEntry);

module.exports = router;
