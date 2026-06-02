import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../lib/api.js';

function PasswordSection() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match'); return; }
    if (form.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMessage('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally { setSaving(false); }
  };

  const inputClass = "w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6]";
  const labelStyle = { fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
        { key: 'newPassword', label: 'New Password', showKey: 'next' },
        { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
      ].map(({ key, label, showKey }) => (
        <div key={key}>
          <label className="block mb-1.5" style={labelStyle}>{label}</label>
          <div className="relative">
            <input
              type={show[showKey] ? 'text' : 'password'}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
              style={{ fontFamily: 'var(--font-body)' }}
              className={inputClass}
            />
            <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
              {show[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      ))}

      {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)' }}>
          <Lock size={14} /> {saving ? 'Updating…' : 'Update Password'}
        </motion.button>
        {message && (
          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-sm text-[#06B6A0]" style={{ fontFamily: 'var(--font-body)' }}>
            <CheckCircle2 size={14} /> {message}
          </motion.span>
        )}
      </div>
    </form>
  );
}

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>
          Settings
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.25rem', fontSize: '0.88rem' }}>
          Manage your account security and preferences.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,119,182,0.1)' }}>
            <Lock size={15} style={{ color: '#0077B6' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
            Change Password
          </h2>
        </div>
        <PasswordSection />
      </motion.div>
    </div>
  );
}
