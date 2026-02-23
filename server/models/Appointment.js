const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  specialization: { type: String },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  priority: { type: String, enum: ['emergency', 'high', 'medium', 'normal'], default: 'normal' },
  status: { type: String, enum: ['confirmed', 'pending', 'completed', 'cancelled'], default: 'pending' },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
