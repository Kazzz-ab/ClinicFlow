import { Router } from 'express';
import Patient from '../models/Patient.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = search
      ? { $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }] }
      : {};
    const [patients, total] = await Promise.all([
      Patient.find(filter).skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
      Patient.countDocuments(filter),
    ]);
    res.json({ patients, total, page: Number(page) });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
