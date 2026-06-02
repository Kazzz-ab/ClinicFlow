import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Phone, Mail, MoreHorizontal, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api.js';

function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]">
        <MoreHorizontal size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 z-20 mt-1 w-36 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <button onClick={() => { setOpen(false); onEdit(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#F8FAFC] transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => { setOpen(false); onDelete(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors text-red-500"
                style={{ fontFamily: 'var(--font-body)' }}>
                <Trash2 size={13} /> Remove
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PatientModal({ patient, onClose, onSave }) {
  const isEdit = Boolean(patient?._id);
  const [form, setForm] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    dateOfBirth: patient?.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
    gender: patient?.gender || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    bloodGroup: patient?.bloodGroup || '',
    insuranceProvider: patient?.insuranceProvider || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/patients/${patient._id}`, form);
      } else {
        await api.post('/patients', form);
      }
      onSave();
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', options = null) => (
    <div>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>
        {label}
      </label>
      {options ? (
        <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ fontFamily: 'var(--font-body)' }}
          className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6]">
          <option value="">Select…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ fontFamily: 'var(--font-body)' }}
          className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6]" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
            {isEdit ? 'Edit Patient' : 'New Patient'}
          </h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#64748B]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {field('First Name', 'firstName')}
          {field('Last Name', 'lastName')}
          {field('Date of Birth', 'dateOfBirth', 'date')}
          {field('Gender', 'gender', 'text', ['male', 'female', 'other'])}
          {field('Email', 'email', 'email')}
          {field('Phone', 'phone', 'tel')}
          {field('Blood Group', 'bloodGroup', 'text', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}
          {field('Insurance Provider', 'insuranceProvider')}
          <div className="col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC]"
              style={{ fontFamily: 'var(--font-body)' }}>
              Cancel
            </button>
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Patient'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const itemVariant = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | patient object

  const handleDelete = async (id) => {
    await api.delete(`/patients/${id}`);
    load();
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patients', { params: { search, page, limit: 15 } });
      setPatients(data.patients);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Patients</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {total} registered patients
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(0,119,182,0.25)' }}>
          <Plus size={16} /> Add Patient
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name…"
          style={{ fontFamily: 'var(--font-body)' }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6]" />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#F1F5F9] text-xs font-semibold text-[#94A3B8] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}>
          <div className="col-span-4">Patient</div>
          <div className="col-span-2">DOB</div>
          <div className="col-span-2">Blood</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-1" />
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>Loading…</div>
        ) : patients.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.9rem' }}>No patients found</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
            {patients.map((p) => (
              <motion.div key={p._id} variants={itemVariant}
                className="grid grid-cols-12 px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors items-center">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)' }}>
                    {p.firstName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>
                      {p.firstName} {p.lastName}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {p.gender || '—'}
                    </p>
                  </div>
                </div>
                <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)' }}>
                  {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </div>
                <div className="col-span-2">
                  {p.bloodGroup ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(234,88,12,0.08)', color: '#EA580C', fontFamily: 'var(--font-body)' }}>
                      {p.bloodGroup}
                    </span>
                  ) : <span style={{ color: 'var(--muted)', fontSize: '0.83rem', fontFamily: 'var(--font-body)' }}>—</span>}
                </div>
                <div className="col-span-3 space-y-0.5">
                  {p.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]" style={{ fontFamily: 'var(--font-body)' }}>
                      <Phone size={11} /> {p.phone}
                    </div>
                  )}
                  {p.email && (
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]" style={{ fontFamily: 'var(--font-body)' }}>
                      <Mail size={11} /> {p.email}
                    </div>
                  )}
                </div>
                <div className="col-span-1 flex justify-end">
                  <RowMenu onEdit={() => setModal(p)} onDelete={() => handleDelete(p._id)} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F8FAFC]">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F8FAFC]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <PatientModal
            patient={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
