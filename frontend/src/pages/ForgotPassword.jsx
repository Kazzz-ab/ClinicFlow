import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../lib/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Forgot Password
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Enter your email and we'll send a reset link
          </p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 20px 60px rgba(5,150,105,0.12)' }}>
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-[#14B8A6]" />
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                Check your inbox
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                If <strong>{email}</strong> is registered, a reset link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="you@clinic.com"
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]" />
                </div>
              </div>
              {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </motion.button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-[#059669] hover:underline"
              style={{ fontFamily: 'var(--font-body)' }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
