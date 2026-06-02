import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.patient.count({ where }),
    ]);
    res.json({ patients: withId(patients), total, page: Number(page) });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, email, phone, bloodGroup, allergies, medicalHistory, insuranceProvider, insurancePolicyNumber } = req.body;
    const patient = await prisma.patient.create({
      data: { firstName, lastName, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, gender, email, phone, bloodGroup, allergies: allergies || [], medicalHistory, insuranceProvider, insurancePolicyNumber },
    });
    res.status(201).json(withId(patient));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(withId(patient));
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, email, phone, bloodGroup, allergies, medicalHistory, insuranceProvider, insurancePolicyNumber } = req.body;
    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: { firstName, lastName, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, gender, email, phone, bloodGroup, allergies: allergies || [], medicalHistory, insuranceProvider, insurancePolicyNumber },
    });
    res.json(withId(patient));
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.patient.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
