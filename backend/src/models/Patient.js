import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  email: { type: String, lowercase: true },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  bloodGroup: { type: String },
  allergies: [String],
  medicalHistory: [{ condition: String, diagnosedAt: Date, notes: String }],
  insuranceProvider: { type: String },
  insurancePolicyNumber: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Patient', patientSchema);
