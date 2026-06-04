import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronLeft, ChevronRight, DollarSign, Plus, X, Trash2, ChevronDown, Download, CheckSquare, Square, SquareCheck } from 'lucide-react';
import { exportInvoicePDF } from '../lib/exportPDF.js';
import { format } from 'date-fns';
import api from '../lib/api.js';

const STATUS = {
  draft: { bg: 'rgba(100,116,139,0.1)', color: '#64748B', label: 'Draft' },
  sent: { bg: 'rgba(0,119,182,0.1)', color: '#0077B6', label: 'Sent' },
  paid: { bg: 'rgba(6,182,160,0.1)', color: '#06B6A0', label: 'Paid' },
  overdue: { bg: 'rgba(234,88,12,0.1)', color: '#EA580C', label: 'Overdue' },
  cancelled: { bg: 'rgba(100,116,139,0.08)', color: '#94A3B8', label: 'Cancelled' },
};

function InvoiceModal({ onClose, onSave }) {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    status: 'draft',
    dueDate: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
    notes: '',
  });
  const [lineItems, setLineItems] = useState([{ description: '', quantity: 1, unitPrice: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/patients', { params: { limit: 200 } }).then(r => setPatients(r.data.patients));
  }, []);

  const updateLine = (i, key, val) => {
    const items = [...lineItems];
    items[i] = { ...items[i], [key]: val };
    setLineItems(items);
  };

  const subtotal = lineItems.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/invoices', {
        ...form,
        lineItems: lineItems.filter(l => l.description && l.unitPrice),
        subtotal,
        total: subtotal,
      });
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>New Invoice</h2>
          <button onClick={onClose}><X size={18} className="text-[#94A3B8]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Patient</label>
              <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20">
                <option value="">Select…</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none">
                {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              style={{ fontFamily: 'var(--font-body)' }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>Line Items</label>
              <button type="button" onClick={() => setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: '' }])}
                className="text-xs text-[#0077B6] hover:underline" style={{ fontFamily: 'var(--font-body)' }}>+ Add line</button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs text-[#94A3B8] font-semibold uppercase px-1" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Unit Price</div>
                <div className="col-span-1" />
              </div>
              {lineItems.map((line, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input value={line.description} onChange={(e) => updateLine(i, 'description', e.target.value)} placeholder="Service…"
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="col-span-6 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none" />
                  <input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(i, 'quantity', e.target.value)}
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="col-span-2 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none" />
                  <input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(e) => updateLine(i, 'unitPrice', e.target.value)} placeholder="0.00"
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="col-span-3 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none" />
                  <button type="button" onClick={() => setLineItems(lineItems.filter((_, j) => j !== i))}
                    className="col-span-1 flex justify-center text-[#94A3B8] hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3 pt-3 border-t border-[#F1F5F9]">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)' }}>Subtotal: </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)', marginLeft: '0.5rem' }}>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              style={{ fontFamily: 'var(--font-body)' }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#64748B]"
              style={{ fontFamily: 'var(--font-body)' }}>Cancel</button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)' }}>
              {saving ? 'Creating…' : 'Create Invoice'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function StatusDropdown({ invoiceId, current, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const sc = STATUS[current] || STATUS.draft;

  const handleChange = async (newStatus) => {
    setOpen(false);
    setUpdating(true);
    try {
      await api.put(`/invoices/${invoiceId}`, { status: newStatus });
      onUpdate();
    } finally { setUpdating(false); }
  };

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} disabled={updating}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs disabled:opacity-60"
        style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)' }}>
        {sc.label}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute left-0 z-20 mt-1 w-32 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
              {Object.entries(STATUS).map(([v, { label, color }]) => (
                <button key={v} onClick={() => handleChange(v)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#F8FAFC] transition-colors"
                  style={{ fontFamily: 'var(--font-body)', color: v === current ? color : 'var(--text)', fontWeight: v === current ? 600 : 400 }}>
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulking, setBulking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { data } = await api.get('/invoices', { params: { status: statusFilter || undefined, page, limit: 15 } });
      setInvoices(data.invoices);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === invoices.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(invoices.map(i => i._id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selected.size === 0) return;
    setBulking(true);
    try {
      await api.patch('/invoices/bulk-status', { ids: Array.from(selected), status: bulkStatus });
      setSelected(new Set());
      setBulkStatus('');
      load();
    } finally { setBulking(false); }
  };

  const totalPages = Math.ceil(total / 15);
  const totalAmount = invoices.reduce((s, inv) => s + (inv.total || 0), 0);
  const allSelected = invoices.length > 0 && selected.size === invoices.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Invoices</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {total} invoices · Total on page: ${totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ fontFamily: 'var(--font-body)' }}
            className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none max-w-xs">
            <option value="">All statuses</option>
            {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(0,119,182,0.25)' }}>
            <Plus size={16} /> New Invoice
          </motion.button>
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,119,182,0.06)', border: '1px solid rgba(0,119,182,0.18)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#0077B6' }}>
              {selected.size} selected
            </span>
            <span className="text-[#CBD5E1]">|</span>
            <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}
              style={{ fontFamily: 'var(--font-body)' }}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20">
              <option value="">Set status…</option>
              {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleBulkUpdate}
              disabled={!bulkStatus || bulking}
              className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)' }}>
              {bulking ? 'Updating…' : 'Apply'}
            </motion.button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-[#94A3B8] hover:text-[#64748B]">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#F1F5F9] text-xs font-semibold text-[#94A3B8] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}>
          <div className="col-span-1 flex items-center">
            <button onClick={toggleAll} className="text-[#94A3B8] hover:text-[#0077B6] transition-colors">
              {allSelected ? <CheckSquare size={15} style={{ color: '#0077B6' }} /> : someSelected ? <SquareCheck size={15} style={{ color: '#0077B6' }} /> : <Square size={15} />}
            </button>
          </div>
          <div className="col-span-2">Invoice #</div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1" />
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
            {invoices.map((inv) => (
              <motion.div key={inv._id}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className={`grid grid-cols-12 px-6 py-4 border-b border-[#F8FAFC] last:border-0 transition-colors items-center ${selected.has(inv._id) ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'}`}>
                <div className="col-span-1">
                  <button onClick={() => toggleSelect(inv._id)} className="text-[#94A3B8] hover:text-[#0077B6] transition-colors">
                    {selected.has(inv._id) ? <CheckSquare size={15} style={{ color: '#0077B6' }} /> : <Square size={15} />}
                  </button>
                </div>
                <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: '#0077B6' }}>{inv.invoiceNumber}</div>
                <div className="col-span-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text)' }}>
                  {inv.patient?.firstName} {inv.patient?.lastName}
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
                  <StatusDropdown invoiceId={inv._id} current={inv.status} onUpdate={load} />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => exportInvoicePDF(inv)} title="Download PDF"
                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0077B6] transition-colors">
                    <Download size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
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

      <AnimatePresence>
        {modal && <InvoiceModal onClose={() => setModal(false)} onSave={() => { setModal(false); load(); }} />}
      </AnimatePresence>
    </div>
  );
}
