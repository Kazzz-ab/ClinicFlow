import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 3600000);

    const [upcoming, overdue] = await Promise.all([
      prisma.appointment.findMany({
        where: { date: { gte: now, lte: twoHoursFromNow }, status: { in: ['scheduled', 'confirmed'] } },
        include: { patient: { select: { firstName: true, lastName: true } } },
        orderBy: { date: 'asc' },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: { status: 'overdue' },
        include: { patient: { select: { firstName: true, lastName: true } } },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
    ]);

    const notifications = [
      ...upcoming.map(a => ({
        id: `appt-${a.id}`,
        type: 'appointment',
        title: `Upcoming: ${a.patient.firstName} ${a.patient.lastName}`,
        body: `${a.startTime} — ${a.type}`,
        time: a.date,
        href: '/appointments',
      })),
      ...overdue.map(i => ({
        id: `inv-${i.id}`,
        type: 'invoice',
        title: `Overdue invoice: ${i.patient.firstName} ${i.patient.lastName}`,
        body: `${i.invoiceNumber} — $${i.total}`,
        time: i.dueDate,
        href: '/invoices',
      })),
    ];

    res.json({ notifications, count: notifications.length });
  } catch (err) { next(err); }
});

export default router;
