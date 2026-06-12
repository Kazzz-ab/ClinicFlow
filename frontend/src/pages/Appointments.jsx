import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import api from '../lib/api.js';

const STATUS_COLORS = {
  scheduled: { bg: 'rgba(124,58,237,0.1)', color: '#7C3AED', label: 'Scheduled' },
  confirmed: { bg: 'rgba(5,150,105,0.1)', color: '#059669', label: 'Confirmed' },
  completed: { bg: 'rgba(20,184,166,0.1)', color: '#14B8A6', label: 'Completed' },
  cancelled: { bg: 'rgba(100,116,139,0.1)', color: '#64748B', label: 'Cancelled' },
  'no-show': { bg: 'rgba(234,88,12,0.1)', color: '#EA580C', label: 'No-show' },
};

function AppointmentModal({ appointment, onClose, onSave }) {
  const isEdit = Boolean(appointment?._id);
  const [form, setForm] = useState({
    patient: appointment?.patient?._id || appointment?.patient || '',
    doctor: appointment?.doctor?._id || appointment?.doctor?.user?._id || '',
    date: appointment?.date ? format(new Date(appointment.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: appointment?.startTime || '09:00',
    type: appointment?.type || 'consultation',
    status: appointment?.status || 'scheduled',
    chiefComplaint: appointment?.chiefComplaint || '',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/patients', { params: { limit: 200 } }).then(r => setPatients(r.data.patients));
    api.get('/doctors').then(r => setDoctors(r.data));
  }, []);

  // when editing, pre-select doctor by matching doctor._id
  useEffect(() => {
    if (isEdit && appointment?.doctor?._id && !form.doctor) {
      setForm(f => ({ ...f, doctor: appointment.doctor._id }));
    }
  }, [doctors, appointment, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/appointments/${appointment._id}`, form);
      } else {
        await api.post('/appointments', form);
      }
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
            {isEdit ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button onClick={onClose}><X size={18} className="text-[#94A3B8]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Patient', key: 'patient', options: patients.map(p => ({ v: p._id, l: `${p.firstName} ${p.lastName}` })) },
            { label: 'Doctor', key: 'doctor', options: doctors.map(d => ({ v: d._id, l: d.user?.name || d._id })) },
            { label: 'Type', key: 'type', options: ['consultation','follow-up','emergency','routine'].map(v => ({ v, l: v.charAt(0).toUpperCase() + v.slice(1) })) },
          ].map(({ label, key, options }) => (
            <div key={key}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
              <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20">
                <option value="">Select…</option>
                {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none" />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none" />
            </div>
          </div>
          {isEdit && (
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20">
                {Object.entries(STATUS_COLORS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Chief Complaint</label>
            <textarea value={form.chiefComplaint} onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })} rows={2}
              style={{ fontFamily: 'var(--font-body)' }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#64748B]"
              style={{ fontFamily: 'var(--font-body)' }}>Cancel</button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)', fontFamily: 'var(--font-body)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Book Appointment'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function RowMenu({ appt, onEdit, onCancel }) {
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 z-20 mt-1 w-40 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <button onClick={() => { setOpen(false); onEdit(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#F8FAFC] transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                <Pencil size={13} /> Edit
              </button>
              {appt.status !== 'cancelled' && (
                <button onClick={() => { setOpen(false); onCancel(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors text-red-500"
                  style={{ fontFamily: 'var(--font-body)' }}>
                  <Trash2 size={13} /> Cancel
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | appointment object

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments', {
        params: { date: format(selectedDate, 'yyyy-MM-dd'), status: statusFilter || undefined, limit: 50 }
      });
      setAppointments(data.appointments);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [selectedDate, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (id) => {
    await api.delete(`/appointments/${id}`);
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Appointments</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {total} for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ fontFamily: 'var(--font-body)' }}
            className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none">
            <option value="">All statuses</option>
            {Object.entries(STATUS_COLORS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModal('new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(5,150,105,0.25)' }}>
            <Plus size={16} /> Book
          </motion.button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setSelectedDate(d => subDays(d, 1))}
          className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC]"><ChevronLeft size={16} /></button>
        <div className="flex-1 text-center">
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        <button onClick={() => setSelectedDate(d => addDays(d, 1))}
          className="p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC]"><ChevronRight size={16} /></button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div>
        ) : appointments.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}>No appointments for this day</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
            {appointments.map((appt) => {
              const sc = STATUS_COLORS[appt.status] || STATUS_COLORS.scheduled;
              return (
                <motion.div key={appt._id}
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                  className="flex items-center gap-4 px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                  <div className="w-16 text-center flex-shrink-0">
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#059669', fontSize: '1rem' }}>{appt.startTime}</span>
                  </div>
                  <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: sc.color }} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>
                      {appt.patient?.firstName} {appt.patient?.lastName}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {appt.doctor?.user?.name} · {appt.type}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)' }}>
                    {sc.label}
                  </span>
                  <RowMenu
                    appt={appt}
                    onEdit={() => setModal(appt)}
                    onCancel={() => handleCancel(appt._id)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <AppointmentModal
            appointment={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
