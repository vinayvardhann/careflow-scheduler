const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

dotenv.config();

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@medschedule.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create Patient users
    const patients = await User.create([
      { name: 'John Martinez', email: 'john@patient.com', password: 'patient123', role: 'patient', age: 45, phone: '555-0101' },
      { name: 'Emily Watson', email: 'emily@patient.com', password: 'patient123', role: 'patient', age: 72, phone: '555-0102' },
      { name: 'David Kim', email: 'david@patient.com', password: 'patient123', role: 'patient', age: 34, phone: '555-0103' },
      { name: 'Maria Garcia', email: 'maria@patient.com', password: 'patient123', role: 'patient', age: 68, phone: '555-0104' },
      { name: 'Alex Thompson', email: 'alex@patient.com', password: 'patient123', role: 'patient', age: 28, phone: '555-0105' },
      { name: 'Sophie Brown', email: 'sophie@patient.com', password: 'patient123', role: 'patient', age: 55, phone: '555-0106' },
      { name: 'Robert Lee', email: 'robert@patient.com', password: 'patient123', role: 'patient', age: 41, phone: '555-0107' },
      { name: 'Nina Patel', email: 'nina@patient.com', password: 'patient123', role: 'patient', age: 80, phone: '555-0108' },
    ]);

    // Create Doctors
    const doctors = await Doctor.create([
      { name: 'Dr. Sarah Chen', email: 'sarah@doctor.com', specialization: 'Cardiology', avatar: 'SC', avgConsultationTime: 20 },
      { name: 'Dr. James Wilson', email: 'james@doctor.com', specialization: 'Orthopedics', avatar: 'JW', avgConsultationTime: 25 },
      { name: 'Dr. Priya Patel', email: 'priya@doctor.com', specialization: 'Dermatology', avatar: 'PP', avgConsultationTime: 15 },
      { name: 'Dr. Michael Brooks', email: 'michael@doctor.com', specialization: 'Neurology', avatar: 'MB', avgConsultationTime: 30 },
      { name: 'Dr. Lisa Rodriguez', email: 'lisa@doctor.com', specialization: 'Pediatrics', avatar: 'LR', avgConsultationTime: 20 },
    ]);

    // Create Doctor users
    for (const doc of doctors) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doctor123',
        role: 'doctor',
      });
      doc.userId = user._id;
      await doc.save();
    }

    // Create Appointments
    await Appointment.create([
      { patientName: 'John Martinez', patientAge: 45, patientId: patients[0]._id, doctorId: doctors[0]._id, doctorName: 'Dr. Sarah Chen', specialization: 'Cardiology', date: '2026-02-22', startTime: '09:00', endTime: '09:20', priority: 'emergency', status: 'confirmed', reason: 'Chest pain' },
      { patientName: 'Emily Watson', patientAge: 72, patientId: patients[1]._id, doctorId: doctors[1]._id, doctorName: 'Dr. James Wilson', specialization: 'Orthopedics', date: '2026-02-22', startTime: '09:30', endTime: '09:55', priority: 'high', status: 'confirmed', reason: 'Hip replacement follow-up' },
      { patientName: 'David Kim', patientAge: 34, patientId: patients[2]._id, doctorId: doctors[2]._id, doctorName: 'Dr. Priya Patel', specialization: 'Dermatology', date: '2026-02-22', startTime: '10:00', endTime: '10:15', priority: 'normal', status: 'pending', reason: 'Skin rash evaluation' },
      { patientName: 'Maria Garcia', patientAge: 68, patientId: patients[3]._id, doctorId: doctors[3]._id, doctorName: 'Dr. Michael Brooks', specialization: 'Neurology', date: '2026-02-22', startTime: '10:30', endTime: '11:00', priority: 'high', status: 'confirmed', reason: 'Migraine consultation' },
      { patientName: 'Alex Thompson', patientAge: 28, patientId: patients[4]._id, doctorId: doctors[4]._id, doctorName: 'Dr. Lisa Rodriguez', specialization: 'Pediatrics', date: '2026-02-22', startTime: '11:00', endTime: '11:20', priority: 'normal', status: 'completed', reason: 'Annual checkup' },
      { patientName: 'Sophie Brown', patientAge: 55, patientId: patients[5]._id, doctorId: doctors[0]._id, doctorName: 'Dr. Sarah Chen', specialization: 'Cardiology', date: '2026-02-22', startTime: '11:30', endTime: '11:50', priority: 'medium', status: 'pending', reason: 'Blood pressure review' },
      { patientName: 'Robert Lee', patientAge: 41, patientId: patients[6]._id, doctorId: doctors[2]._id, doctorName: 'Dr. Priya Patel', specialization: 'Dermatology', date: '2026-02-23', startTime: '09:00', endTime: '09:15', priority: 'normal', status: 'confirmed', reason: 'Mole check' },
      { patientName: 'Nina Patel', patientAge: 80, patientId: patients[7]._id, doctorId: doctors[3]._id, doctorName: 'Dr. Michael Brooks', specialization: 'Neurology', date: '2026-02-23', startTime: '09:30', endTime: '10:00', priority: 'emergency', status: 'confirmed', reason: 'Stroke symptoms' },
    ]);

    console.log('✅ Seed data inserted successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin:   admin@medschedule.com / admin123');
    console.log('  Doctor:  sarah@doctor.com / doctor123');
    console.log('  Patient: john@patient.com / patient123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
