import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* Left — Illustration panel */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(150deg, #0D1B2A 0%, #013B5E 50%, #005F8E 100%)' }}>

        {/* Floating orbs */}
        <motion.div animate={{ y: [-12, 12, -12], rotate: [0, 180, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 right-16 w-40 h-40 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06B6A0, transparent)' }} />
        <motion.div animate={{ y: [12, -12, 12] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 left-8 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0077B6, transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)' }}>
            <Activity size={20} className="text-white" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>
            ClinicFlow
          </span>
        </div>

        {/* Main pitch */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.2rem' }}>
              Modern care.<br />
              <span style={{ background: 'linear-gradient(135deg, #00B4D8, #06B6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Seamless management.
              </span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '360px' }}>
              Everything your clinic needs — patient records, scheduling, billing, and analytics — unified in one elegant platform.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex gap-8 mt-10">
            {[['1,200+', 'Patients managed'], ['99.9%', 'Uptime SLA'], ['HIPAA', 'Compliant']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#06B6A0' }}>{v}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.15rem' }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }} className="relative z-10">
          © {new Date().getFullYear()} ClinicFlow. All rights reserved.
        </p>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)' }}>
              <Activity size={18} className="text-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }} className="gradient-text">
              ClinicFlow
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Sign in to your clinic
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Enter your credentials to access the dashboard.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(234,88,12,0.08)', color: '#EA580C', border: '1px solid rgba(234,88,12,0.15)', fontFamily: 'var(--font-body)' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="doctor@clinic.com"
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/25 focus:border-[#0077B6] transition-all placeholder:text-[#CBD5E1]"
                />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#E2E8F0] bg-white text-[#0D1B2A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6]/25 focus:border-[#0077B6] transition-all placeholder:text-[#CBD5E1]"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px rgba(0,119,182,0.3)' }}
            >
              {loading ? 'Signing in…' : (<>Sign in <ArrowRight size={16} /></>)}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
