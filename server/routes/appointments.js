const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/appointments - Get all appointments
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter by role
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }

    // Optional filters
    if (req.query.date) query.date = req.query.date;
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.doctorId) query.doctorId = req.query.doctorId;

    const appointments = await Appointment.find(query)
      .sort({ date: 1, startTime: 1 })
      .populate('doctorId', 'name specialization');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/appointments - Book appointment with priority scheduling
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, priority, reason, patientName, patientAge } = req.body;

    // Check for double booking
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflict) {
      return res.status(409).json({
        message: 'Time slot conflict detected. This slot is already booked.',
        conflictWith: conflict,
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointment = await Appointment.create({
      patientName: patientName || req.user.name,
      patientAge: patientAge || req.user.age,
      patientId: req.user._id,
      doctorId,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date,
      startTime,
      endTime,
      priority: priority || 'normal',
      reason,
      status: priority === 'emergency' ? 'confirmed' : 'pending',
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/appointments/:id/status - Update appointment status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/appointments/:id - Reschedule appointment
router.put('/:id', protect, async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    // Check for conflicts with new time
    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Appointment not found' });

    const conflict = await Appointment.findOne({
      _id: { $ne: req.params.id },
      doctorId: existing.doctorId,
      date,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflict) {
      return res.status(409).json({ message: 'New time slot has a conflict' });
    }

    existing.date = date;
    existing.startTime = startTime;
    existing.endTime = endTime;
    existing.status = 'pending';
    await existing.save();

    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/appointments/:id - Cancel appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/appointments/stats - Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({ date: today });
    const completed = await Appointment.countDocuments({ status: 'completed' });
    const completionRate = totalAppointments > 0 ? ((completed / totalAppointments) * 100).toFixed(1) : 0;

    // Calculate average wait time from consultation times
    const doctors = await Doctor.find({});
    const avgWaitTime = doctors.length > 0
      ? Math.round(doctors.reduce((sum, d) => sum + d.avgConsultationTime, 0) / doctors.length)
      : 0;

    res.json({
      totalAppointments,
      todayAppointments,
      avgWaitTime,
      completionRate: parseFloat(completionRate),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
