import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Plus, X, MoreHorizontal, Clock } from 'lucide-react';
import api from '../lib/api.js';

function DoctorModal({ doctor, onClose, onSave }) {
  const isEdit = Boolean(doctor?._id);
  const [form, setForm] = useState({
    user: doctor?.user?._id || doctor?.user || '',
    specialization: doctor?.specialization || '',
    licenseNumber: doctor?.licenseNumber || '',
    consultationFee: doctor?.consultationFee || '',
    bio: doctor?.bio || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) { await api.put(`/doctors/${doctor._id}`, form); }
      else { await api.post('/doctors', form); }
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
            {isEdit ? 'Edit Doctor' : 'Add Doctor'}
          </h2>
          <button onClick={onClose}><X size={18} className="text-[#94A3B8]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Specialization', key: 'specialization' },
            { label: 'License Number', key: 'licenseNumber' },
            { label: 'Consultation Fee ($)', key: 'consultationFee', type: 'number' },
          ].map(({ label, key, type = 'text' }) => (
            <div key={key}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={{ fontFamily: 'var(--font-body)' }}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6]" />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
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
              {saving ? 'Saving…' : isEdit ? 'Save' : 'Add Doctor'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/doctors'); setDoctors(data); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Doctors</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{doctors.length} active physicians</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(0,119,182,0.25)' }}>
          <Plus size={16} /> Add Doctor
        </motion.button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc, i) => (
            <motion.div key={doc._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card-3d rounded-2xl p-5 cursor-default"
              style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)' }}>
                    {doc.user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text)', fontSize: '0.93rem' }}>
                      {doc.user?.name || 'Dr. —'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: '#0077B6' }}>{doc.specialization}</p>
                  </div>
                </div>
                <button onClick={() => setModal(doc)} className="p-1.5 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: 'var(--muted)' }}>License</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', fontWeight: 600, color: 'var(--text)' }}>{doc.licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: 'var(--muted)' }}>Consultation Fee</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, color: '#06B6A0' }}>${doc.consultationFee}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]" style={{ fontFamily: 'var(--font-body)' }}>
                <Clock size={11} />
                {doc.workingHours?.start} – {doc.workingHours?.end} · {(doc.availableDays || []).join(', ')}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <DoctorModal doctor={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
