import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, FileText, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

const STATUS_COLORS = {
  confirmed: { label: 'Confirmed', color: '#0077B6', bg: 'rgba(0,119,182,0.1)' },
  completed: { label: 'Completed', color: '#06B6A0', bg: 'rgba(6,182,160,0.1)' },
  scheduled: { label: 'Scheduled', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  cancelled: { label: 'Cancelled', color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
  'no-show': { label: 'No-show', color: '#EA580C', bg: 'rgba(234,88,12,0.1)' },
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } } };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    Promise.all([
      api.get('/stats'),
      api.get('/appointments', { params: { date: today, limit: 5 } }),
    ]).then(([s, a]) => {
      setStats(s.data);
      setTodayAppts(a.data.appointments || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), change: 'registered', icon: Users, color: '#0077B6', bg: 'rgba(0,119,182,0.08)', trend: 'up' },
    { label: 'Active Doctors', value: stats.activeDoctors, change: 'on staff', icon: Stethoscope, color: '#06B6A0', bg: 'rgba(6,182,160,0.08)', trend: 'up' },
    { label: "Today's Appointments", value: stats.todayAppointments, change: `${stats.appointmentBreakdown?.scheduled || 0} pending`, icon: Calendar, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', trend: 'neutral' },
    { label: 'Overdue Invoices', value: stats.overdueInvoices, change: `${stats.pendingInvoices} pending`, icon: FileText, color: '#EA580C', bg: 'rgba(234,88,12,0.08)', trend: stats.overdueInvoices > 0 ? 'down' : 'up' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
          Good morning, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Doctor'}</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.4rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — Here's your clinic at a glance.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', height: 120 }} />
          ))}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((stat) => (
            <motion.div key={stat.label} variants={item}
              className="card-3d rounded-2xl p-5 cursor-default"
              style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center float-anim" style={{ background: stat.bg }}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: stat.trend === 'up' ? 'rgba(6,182,160,0.1)' : stat.trend === 'down' ? 'rgba(234,88,12,0.1)' : 'rgba(124,58,237,0.1)',
                    color: stat.trend === 'up' ? '#06B6A0' : stat.trend === 'down' ? '#EA580C' : '#7C3AED',
                    fontFamily: 'var(--font-body)',
                  }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Today's Appointments</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)' }}>
                {stats?.todayAppointments ?? '—'} scheduled
              </p>
            </div>
            <Clock size={16} className="text-[#64748B]" />
          </div>
          <div className="divide-y divide-[#F8FAFC]">
            {loading ? (
              <div className="py-10 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div>
            ) : todayAppts.length === 0 ? (
              <div className="py-10 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)' }}>No appointments today</div>
            ) : todayAppts.map((appt, i) => {
              const sc = STATUS_COLORS[appt.status] || STATUS_COLORS.scheduled;
              return (
                <motion.div key={appt._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.07 }}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-[#F8FAFC] transition-colors">
                  <div className="w-14 text-center flex-shrink-0">
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#0077B6', fontSize: '0.95rem' }}>
                      {appt.startTime}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }} className="truncate">
                      {appt.patient?.firstName} {appt.patient?.lastName}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)' }}>
                      {appt.doctor?.user?.name} · {appt.type}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)' }}>
                    {sc.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4">
          <div className="rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #0077B6, #06B6A0)', boxShadow: '0 8px 32px rgba(0,119,182,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-white/80" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500 }} className="text-white/80">
                Completion Rate
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              {loading ? '—' : `${stats?.completionRate ?? 0}%`}
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.completionRate ?? 0}%` }}
                transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>

          <div className="rounded-2xl p-5"
            style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1rem' }}>
              Status Overview
            </h3>
            {[
              { label: 'Completed', key: 'completed', icon: CheckCircle2, color: '#06B6A0' },
              { label: 'Confirmed', key: 'confirmed', icon: Calendar, color: '#0077B6' },
              { label: 'No-shows', key: 'no-show', icon: AlertCircle, color: '#EA580C' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 mb-3 last:mb-0">
                <s.icon size={15} style={{ color: s.color }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', flex: 1 }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>
                  {loading ? '—' : (stats?.appointmentBreakdown?.[s.key] || 0)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
