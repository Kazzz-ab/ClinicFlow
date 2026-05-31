import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  invoiceNumber: { type: String, required: true, unique: true },
  lineItems: [{
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
  dueDate: { type: Date },
  paidAt: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
