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
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalPatients,
      activeDoctors,
      todayAppointments,
      overdueInvoices,
      pendingInvoices,
      paidMTD,
    ] = await Promise.all([
      prisma.patient.count({ where: { isActive: true } }),
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.appointment.findMany({ where: { date: { gte: todayStart, lte: todayEnd } }, select: { status: true } }),
      prisma.invoice.count({ where: { status: 'overdue' } }),
      prisma.invoice.count({ where: { status: { in: ['sent', 'draft'] } } }),
      prisma.invoice.aggregate({ where: { status: 'paid', paidAt: { gte: monthStart } }, _sum: { total: true } }),
    ]);

    const breakdown = {};
    todayAppointments.forEach(a => { breakdown[a.status] = (breakdown[a.status] || 0) + 1; });
    const completionRate = todayAppointments.length > 0
      ? Math.round(((breakdown.completed || 0) / todayAppointments.length) * 1000) / 10
      : 0;

    res.json({
      totalPatients,
      activeDoctors,
      todayAppointments: todayAppointments.length,
      appointmentBreakdown: breakdown,
      completionRate,
      pendingInvoices,
      overdueInvoices,
      paidMTD: paidMTD._sum.total || 0,
    });
  } catch (err) { next(err); }
});

export default router;
