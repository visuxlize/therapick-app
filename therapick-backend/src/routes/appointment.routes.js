const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getUpcomingAppointments
} = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth');

// All appointment routes require authentication
router.use(protect);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/upcoming', getUpcomingAppointments);
router.get('/:id', getAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', cancelAppointment);

module.exports = router;
