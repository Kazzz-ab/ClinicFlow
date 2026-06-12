import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ChevronDown, LogOut, Menu, Moon, Settings, Sun, User, X, ShieldCheck, ClipboardList } from 'lucide-react';
import NotificationBell from './NotificationBell.jsx';
import { useDarkMode } from '../../hooks/useDarkMode.js';
import { useAuth } from '../../hooks/useAuth.js';

const navLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Patients', to: '/patients' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Invoices', to: '/invoices' },
  { label: 'Analytics', to: '/analytics' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-emerald-900/8' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)' }}
            >
              <Stethoscope size={18} className="text-white" />
            </motion.div>
            <span
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}
              className="gradient-text tracking-tight"
            >
              Clinio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#059669]/10 text-[#059669]'
                      : 'text-[#0A201C]/70 hover:text-[#059669] hover:bg-[#059669]/5'
                  }`
                }
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setDark(d => !d)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#059669]/8 transition-colors">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>
            <NotificationBell />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#059669]/8 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)' }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-[#0A201C]" style={{ fontFamily: 'var(--font-body)' }}>
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={14} className={`text-[#64748B] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="p-1.5">
                      <button onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#0A201C]/80 hover:bg-[#059669]/8 transition-colors">
                        <User size={15} /> Profile
                      </button>
                      <button onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#0A201C]/80 hover:bg-[#059669]/8 transition-colors">
                        <Settings size={15} /> Settings
                      </button>
                      {user?.role === 'admin' && (
                        <>
                          <div className="my-1 border-t border-[#E2E8F0]" />
                          <button onClick={() => { setProfileOpen(false); navigate('/admin/users'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#7C3AED]/80 hover:bg-[#7C3AED]/8 transition-colors">
                            <ShieldCheck size={15} /> User Management
                          </button>
                          <button onClick={() => { setProfileOpen(false); navigate('/admin/audit'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#7C3AED]/80 hover:bg-[#7C3AED]/8 transition-colors">
                            <ClipboardList size={15} /> Audit Log
                          </button>
                        </>
                      )}
                      <div className="my-1 border-t border-[#E2E8F0]" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl hover:bg-[#059669]/8">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/30"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-[#059669]/10 text-[#059669]' : 'text-[#0A201C]/80'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="w-full mt-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 text-left">
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
