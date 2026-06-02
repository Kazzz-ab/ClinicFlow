import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

const apptInclude = {
  patient: { select: { id: true, firstName: true, lastName: true } },
  doctor: { include: { user: { select: { id: true, name: true } } } },
};

router.get('/', async (req, res, next) => {
  try {
    const { date, doctor, patient, status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }
    if (doctor) where.doctorId = doctor;
    if (patient) where.patientId = patient;
    if (status) where.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({ where, skip, take: Number(limit), include: apptInclude, orderBy: [{ date: 'asc' }, { startTime: 'asc' }] }),
      prisma.appointment.count({ where }),
    ]);
    res.json({ appointments: withId(appointments), total });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { patient, doctor, date, startTime, endTime, type, status, chiefComplaint, diagnosis, prescription, notes, fee } = req.body;
    const appointment = await prisma.appointment.create({
      data: { patientId: patient, doctorId: doctor, date: new Date(date), startTime, endTime, type, status, chiefComplaint, diagnosis, prescription, notes, fee: fee ? Number(fee) : null },
      include: apptInclude,
    });
    res.status(201).json(withId(appointment));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appt = await prisma.appointment.findUnique({ where: { id: req.params.id }, include: apptInclude });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(withId(appt));
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { patient, doctor, date, startTime, endTime, type, status, chiefComplaint, diagnosis, prescription, notes, fee } = req.body;
    const appt = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        ...(patient && { patientId: patient }),
        ...(doctor && { doctorId: doctor }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(type && { type }),
        ...(status && { status }),
        ...(chiefComplaint !== undefined && { chiefComplaint }),
        ...(diagnosis !== undefined && { diagnosis }),
        ...(prescription !== undefined && { prescription }),
        ...(notes !== undefined && { notes }),
        ...(fee !== undefined && { fee: fee ? Number(fee) : null }),
      },
      include: apptInclude,
    });
    res.json(withId(appt));
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.appointment.update({ where: { id: req.params.id }, data: { status: 'cancelled' } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
