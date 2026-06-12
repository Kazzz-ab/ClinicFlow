import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../lib/api.js';

export default function Profile() {
  const { user: authUser, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      setForm({ name: data.name, email: data.email });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/auth/me', form);
      if (setUser) setUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]";

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>
          My Profile
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.25rem', fontSize: '0.88rem' }}>
          Update your display name and email address.
        </p>
      </motion.div>

      {loading ? (
        <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F1F5F9]">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)' }}>
              {form.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{form.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield size={13} style={{ color: '#059669' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#059669', textTransform: 'capitalize' }}>
                  {authUser?.role || 'staff'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>
                <User size={13} /> Full Name
              </label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                style={{ fontFamily: 'var(--font-body)' }} className={inputClass} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>
                <Mail size={13} /> Email Address
              </label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                style={{ fontFamily: 'var(--font-body)' }} className={inputClass} />
            </div>

            {error && (
              <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)', fontFamily: 'var(--font-body)' }}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
              </motion.button>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm text-[#14B8A6]" style={{ fontFamily: 'var(--font-body)' }}>
                  <CheckCircle2 size={14} /> Saved
                </motion.span>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
