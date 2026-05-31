import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  qualifications: [String],
  consultationFee: { type: Number, default: 0 },
  availableDays: {
    type: [String],
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' },
  },
  bio: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
