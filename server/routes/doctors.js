const express = require('express');
const Doctor = require('../models/Doctor');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/doctors - Add a doctor (Admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, specialization, avatar, avgConsultationTime, availableSlots } = req.body;
    const doctor = await Doctor.create({ name, email, specialization, avatar, avgConsultationTime, availableSlots });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/doctors/:id - Update doctor
router.put('/:id', protect, authorizeRoles('admin', 'doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/doctors/:id - Delete doctor (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
