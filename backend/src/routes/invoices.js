import { Router } from 'express';
import prisma, { withId } from '../lib/prisma.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(protect);

const invoiceInclude = {
  patient: { select: { id: true, firstName: true, lastName: true } },
};

router.get('/', async (req, res, next) => {
  try {
    const { status, patient, page = 1, limit = 20 } = req.query;
    const safeLimit = Math.min(Number(limit), 200);
    const where = {};
    if (status) where.status = status;
    if (patient) where.patientId = patient;
    const skip = Math.max(0, (Number(page) - 1) * safeLimit);
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({ where, skip, take: safeLimit, include: invoiceInclude, orderBy: { createdAt: 'desc' } }),
      prisma.invoice.count({ where }),
    ]);
    res.json({ invoices: withId(invoices), total });
  } catch (err) { next(err); }
});

router.post('/', requireRole('admin', 'receptionist'), async (req, res, next) => {
  try {
    const { patient, appointment, lineItems, subtotal, tax, total, status, dueDate, notes } = req.body;
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-CF-${String(count + 1).padStart(5, '0')}`;
    const invoice = await prisma.invoice.create({
      data: {
        patientId: patient,
        appointmentId: appointment || null,
        invoiceNumber,
        lineItems: lineItems || [],
        subtotal: Number(subtotal),
        tax: Number(tax) || 0,
        total: Number(total),
        status: status || 'draft',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
      },
      include: invoiceInclude,
    });
    res.status(201).json(withId(invoice));
  } catch (err) { next(err); }
});

router.put('/:id', requireRole('admin', 'receptionist'), async (req, res, next) => {
  try {
    const { status, dueDate, notes, lineItems, subtotal, tax, total } = req.body;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(notes !== undefined && { notes }),
        ...(lineItems && { lineItems }),
        ...(subtotal !== undefined && { subtotal: Number(subtotal) }),
        ...(tax !== undefined && { tax: Number(tax) }),
        ...(total !== undefined && { total: Number(total) }),
        ...(status === 'paid' && { paidAt: new Date() }),
      },
      include: invoiceInclude,
    });
    res.json(withId(invoice));
  } catch (err) { next(err); }
});

export default router;
