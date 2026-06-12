import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../lib/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}>Invalid reset link. <Link to="/forgot-password" className="text-[#059669]">Request a new one</Link>.</p>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #F0FDFA 0%, #D1FAE5 50%, #F0FDF4 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)' }}>
            <Activity size={26} className="text-white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>
            Reset Password
          </h1>
        </div>
        <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 20px 60px rgba(5,150,105,0.12)' }}>
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-[#14B8A6]" />
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)' }}>Password reset!</p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>Redirecting to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { key: 'newPassword', label: 'New Password', showKey: 'new' },
                { key: 'confirmPassword', label: 'Confirm Password', showKey: 'confirm' },
              ].map(({ key, label, showKey }) => (
                <div key={key}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input type={show[showKey] ? 'text' : 'password'} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} required
                      style={{ fontFamily: 'var(--font-body)' }}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20" />
                    <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      {show[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)', fontFamily: 'var(--font-body)' }}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
