import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();

    // Last 7 days appointment counts by day
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const apptCounts = await Promise.all(days.map(async (day) => {
      const end = new Date(day); end.setHours(23, 59, 59, 999);
      const count = await prisma.appointment.count({ where: { date: { gte: day, lte: end } } });
      return {
        day: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        appointments: count,
      };
    }));

    // Last 6 months invoice totals
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return d;
    });

    const invoiceTotals = await Promise.all(months.map(async (start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
      const result = await prisma.invoice.aggregate({
        where: { status: 'paid', paidAt: { gte: start, lte: end } },
        _sum: { total: true },
      });
      return {
        month: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: Math.round(result._sum.total || 0),
      };
    }));

    // Status breakdown (pie)
    const statuses = await prisma.appointment.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const statusData = statuses.map(s => ({ name: s.status, value: s._count.id }));

    res.json({ apptCounts, invoiceTotals, statusData });
  } catch (err) { next(err); }
});

export default router;
