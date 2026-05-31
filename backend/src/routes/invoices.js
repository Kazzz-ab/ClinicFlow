import { Router } from 'express';
import Invoice from '../models/Invoice.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status, patient, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (patient) filter.patient = patient;
    const [invoices, total] = await Promise.all([
      Invoice.find(filter).populate('patient', 'firstName lastName').skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      Invoice.countDocuments(filter),
    ]);
    res.json({ invoices, total });
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin', 'receptionist'), async (req, res, next) => {
  try {
    const count = await Invoice.countDocuments();
    req.body.invoiceNumber = `INV-CF-${String(count + 1).padStart(5, '0')}`;
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin', 'receptionist'), async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { next(err); }
});

export default router;
