import { Router } from 'express';
import Doctor from '../models/Doctor.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).populate('user', 'name email');
    res.json(doctors);
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) { next(err); }
});

export default router;
