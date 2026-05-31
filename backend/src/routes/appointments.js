import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { date, doctor, patient, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (date) filter.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) };
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    if (status) filter.status = status;
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patient', 'firstName lastName')
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
        .skip((page - 1) * limit).limit(Number(limit)).sort('date startTime'),
      Appointment.countDocuments(filter),
    ]);
    res.json({ appointments, total });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
