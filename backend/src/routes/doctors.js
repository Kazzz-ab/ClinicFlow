import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

const doctorInclude = { user: { select: { id: true, name: true, email: true } } };

function shapeDoctor(d) {
  const doc = withId(d);
  if (doc.user) doc.user._id = doc.user.id;
  doc.workingHours = { start: doc.workingHoursStart, end: doc.workingHoursEnd };
  return doc;
}

router.get('/', async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({ where: { isActive: true }, include: doctorInclude });
    res.json(doctors.map(shapeDoctor));
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { userId, specialization, licenseNumber, qualifications, consultationFee, availableDays, workingHours, bio } = req.body;
    const doctor = await prisma.doctor.create({
      data: {
        userId,
        specialization,
        licenseNumber,
        qualifications: qualifications || [],
        consultationFee: Number(consultationFee) || 0,
        availableDays: availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        workingHoursStart: workingHours?.start || '09:00',
        workingHoursEnd: workingHours?.end || '17:00',
        bio,
      },
      include: doctorInclude,
    });
    res.status(201).json(shapeDoctor(doctor));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id }, include: doctorInclude });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(shapeDoctor(doctor));
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { specialization, licenseNumber, qualifications, consultationFee, availableDays, workingHours, bio } = req.body;
    const doctor = await prisma.doctor.update({
      where: { id: req.params.id },
      data: {
        specialization,
        licenseNumber,
        qualifications: qualifications || [],
        consultationFee: Number(consultationFee) || 0,
        availableDays: availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        workingHoursStart: workingHours?.start || '09:00',
        workingHoursEnd: workingHours?.end || '17:00',
        bio,
      },
      include: doctorInclude,
    });
    res.json(shapeDoctor(doctor));
  } catch (err) { next(err); }
});

router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await prisma.doctor.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
