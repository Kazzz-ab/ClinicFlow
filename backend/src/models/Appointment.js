import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  type: { type: String, enum: ['consultation', 'follow-up', 'emergency', 'routine'], default: 'consultation' },
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
  chiefComplaint: { type: String },
  diagnosis: { type: String },
  prescription: { type: String },
  notes: { type: String },
  fee: { type: Number },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
