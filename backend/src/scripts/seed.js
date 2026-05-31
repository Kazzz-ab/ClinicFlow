import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Invoice from '../models/Invoice.js';

const PATIENTS = [
  { firstName: 'Sarah', lastName: 'Mitchell', dateOfBirth: '1988-04-15', gender: 'female', email: 'sarah.mitchell@email.com', phone: '+1-555-0101', bloodGroup: 'A+', insuranceProvider: 'BlueCross' },
  { firstName: 'James', lastName: 'Okafor', dateOfBirth: '1975-09-22', gender: 'male', email: 'james.okafor@email.com', phone: '+1-555-0102', bloodGroup: 'O+', insuranceProvider: 'Aetna' },
  { firstName: 'Elena', lastName: 'Vasquez', dateOfBirth: '1992-01-30', gender: 'female', email: 'elena.v@email.com', phone: '+1-555-0103', bloodGroup: 'B-' },
  { firstName: 'David', lastName: 'Kim', dateOfBirth: '1965-07-08', gender: 'male', email: 'dkim@email.com', phone: '+1-555-0104', bloodGroup: 'AB+', insuranceProvider: 'UnitedHealth' },
  { firstName: 'Amara', lastName: 'Osei', dateOfBirth: '2000-11-14', gender: 'female', email: 'amara.osei@email.com', phone: '+1-555-0105', bloodGroup: 'O-' },
  { firstName: 'Marcus', lastName: 'Thompson', dateOfBirth: '1983-03-27', gender: 'male', email: 'm.thompson@email.com', phone: '+1-555-0106', bloodGroup: 'A-', insuranceProvider: 'Cigna' },
];

const DOCTORS_DATA = [
  { name: 'Dr. Chen Wei', email: 'chen.wei@clinicflow.io', specialization: 'Internal Medicine', licenseNumber: 'LIC-001-CA', consultationFee: 150 },
  { name: 'Dr. Priya Nair', email: 'priya.nair@clinicflow.io', specialization: 'Pediatrics', licenseNumber: 'LIC-002-CA', consultationFee: 130 },
  { name: 'Dr. Marcus Hill', email: 'marcus.hill@clinicflow.io', specialization: 'Emergency Medicine', licenseNumber: 'LIC-003-CA', consultationFee: 200 },
];

async function seed() {
  await connectDB();
  console.log('Clearing existing data…');
  await Promise.all([User.deleteMany({}), Patient.deleteMany({}), Doctor.deleteMany({}), Appointment.deleteMany({}), Invoice.deleteMany({})]);

  // Admin user
  const admin = await User.create({ name: 'Admin User', email: 'admin@clinicflow.io', password: 'Admin123!', role: 'admin' });
  console.log('Admin: admin@clinicflow.io / Admin123!');

  // Doctors (each needs a User)
  const doctors = [];
  for (const d of DOCTORS_DATA) {
    const user = await User.create({ name: d.name, email: d.email, password: 'Doctor123!', role: 'doctor' });
    const doc = await Doctor.create({ user: user._id, specialization: d.specialization, licenseNumber: d.licenseNumber, consultationFee: d.consultationFee });
    doctors.push(doc);
  }
  console.log(`Created ${doctors.length} doctors`);

  // Patients
  const patients = await Patient.insertMany(PATIENTS);
  console.log(`Created ${patients.length} patients`);

  // Appointments
  const today = new Date();
  const appts = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + Math.floor(i / 2));
    appts.push({
      patient: patients[i]._id,
      doctor: doctors[i % doctors.length]._id,
      date,
      startTime: ['09:00', '10:30', '11:00', '14:15', '15:30', '16:00'][i],
      type: ['consultation', 'follow-up', 'emergency', 'routine', 'follow-up', 'consultation'][i],
      status: ['confirmed', 'completed', 'scheduled', 'confirmed', 'scheduled', 'scheduled'][i],
      fee: doctors[i % doctors.length].consultationFee,
    });
  }
  await Appointment.insertMany(appts);
  console.log(`Created ${appts.length} appointments`);

  // Invoices
  const invoices = [];
  for (let i = 0; i < 4; i++) {
    const amount = (i + 1) * 150;
    invoices.push({
      patient: patients[i]._id,
      invoiceNumber: `INV-CF-${String(i + 1).padStart(5, '0')}`,
      lineItems: [{ description: 'Medical Consultation', quantity: 1, unitPrice: amount }],
      subtotal: amount,
      tax: amount * 0.1,
      total: amount * 1.1,
      status: ['paid', 'sent', 'overdue', 'draft'][i],
      dueDate: new Date(today.getTime() + (i - 1) * 7 * 86400000),
    });
  }
  await Invoice.insertMany(invoices);
  console.log(`Created ${invoices.length} invoices`);

  console.log('\n✓ ClinicFlow seeded successfully');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
