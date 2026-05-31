import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api.js';

const STATUS = {
  draft: { bg: 'rgba(100,116,139,0.1)', color: '#64748B', label: 'Draft' },
  sent: { bg: 'rgba(0,119,182,0.1)', color: '#0077B6', label: 'Sent' },
  paid: { bg: 'rgba(6,182,160,0.1)', color: '#06B6A0', label: 'Paid' },
  overdue: { bg: 'rgba(234,88,12,0.1)', color: '#EA580C', label: 'Overdue' },
  cancelled: { bg: 'rgba(100,116,139,0.08)', color: '#94A3B8', label: 'Cancelled' },
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/invoices', { params: { status: statusFilter || undefined, page, limit: 15 } });
      setInvoices(data.invoices);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 15);
  const totalAmount = invoices.reduce((s, inv) => s + (inv.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Invoices</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{total} invoices · Total on page: ${totalAmount.toLocaleString()}</p>
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ fontFamily: 'var(--font-body)' }}
          className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none max-w-xs">
          <option value="">All statuses</option>
          {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#F1F5F9] text-xs font-semibold text-[#94A3B8] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}>
          <div className="col-span-2">Invoice #</div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-2">Status</div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}>No invoices found</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
            {invoices.map((inv) => {
              const sc = STATUS[inv.status] || STATUS.draft;
              return (
                <motion.div key={inv._id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className="grid grid-cols-12 px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors items-center">
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: '#0077B6' }}>{inv.invoiceNumber}</div>
                  <div className="col-span-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text)' }}>
                    {inv.patient?.firstName} {inv.patient?.lastName}
                  </div>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {inv.createdAt ? format(new Date(inv.createdAt), 'dd MMM yyyy') : '—'}
                  </div>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: inv.status === 'overdue' ? '#EA580C' : 'var(--muted)' }}>
                    {inv.dueDate ? format(new Date(inv.dueDate), 'dd MMM yyyy') : '—'}
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    <DollarSign size={13} className="text-[#06B6A0]" />
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>
                      {inv.total?.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)' }}>
                      {sc.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F8FAFC]"><ChevronLeft size={16} /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F8FAFC]"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
