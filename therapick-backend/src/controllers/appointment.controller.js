const Appointment = require('../models/Appointment');
const { successResponse, AppError } = require('../utils/responses');

/**
 * @desc    Create appointment
 * @route   POST /api/appointments
 * @access  Private
 */
const createAppointment = async (req, res, next) => {
  try {
    const { therapistId, therapistName, therapistSpecialty, date, time, notes } = req.body;

    // Validate required fields
    if (!therapistId || !therapistName || !therapistSpecialty || !date || !time) {
      throw new AppError('Please provide all required fields', 400);
    }

    // Check if appointment date is in the future
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      throw new AppError('Appointment date must be in the future', 400);
    }

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user.id,
      therapistId,
      therapistName,
      therapistSpecialty,
      date: appointmentDate,
      time,
      notes
    });

    return successResponse(res, 201, 'Appointment created successfully', {
      appointment
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's appointments
 * @route   GET /api/appointments
 * @access  Private
 */
const getAppointments = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = { user: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query).sort({ date: 1 });

    return successResponse(res, 200, 'Appointments retrieved successfully', {
      appointments,
      count: appointments.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single appointment
 * @route   GET /api/appointments/:id
 * @access  Private
 */
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if appointment belongs to user
    if (appointment.user.toString() !== req.user.id) {
      throw new AppError('Not authorized to access this appointment', 403);
    }

    return successResponse(res, 200, 'Appointment retrieved successfully', {
      appointment
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
const updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if appointment belongs to user
    if (appointment.user.toString() !== req.user.id) {
      throw new AppError('Not authorized to update this appointment', 403);
    }

    const { date, time, notes } = req.body;

    const fieldsToUpdate = {};
    if (date) {
      const newDate = new Date(date);
      if (newDate < new Date()) {
        throw new AppError('Appointment date must be in the future', 400);
      }
      fieldsToUpdate.date = newDate;
      fieldsToUpdate.status = 'rescheduled';
    }
    if (time) fieldsToUpdate.time = time;
    if (notes !== undefined) fieldsToUpdate.notes = notes;

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Appointment updated successfully', {
      appointment
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if appointment belongs to user
    if (appointment.user.toString() !== req.user.id) {
      throw new AppError('Not authorized to cancel this appointment', 403);
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      throw new AppError('Appointments must be cancelled at least 24 hours in advance', 400);
    }

    const { reason } = req.body;

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    await appointment.save();

    return successResponse(res, 200, 'Appointment cancelled successfully', {
      appointment
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get upcoming appointments
 * @route   GET /api/appointments/upcoming
 * @access  Private
 */
const getUpcomingAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      user: req.user.id,
      status: 'upcoming',
      date: { $gte: new Date() }
    }).sort({ date: 1 });

    return successResponse(res, 200, 'Upcoming appointments retrieved successfully', {
      appointments,
      count: appointments.length
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getUpcomingAppointments
};
