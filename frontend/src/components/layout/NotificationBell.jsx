import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';

const TYPE_ICON = {
  appointment: Calendar,
  invoice: FileText,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = () => {
    api.get('/notifications').then(({ data }) => {
      setNotifications(data.notifications);
      setCount(data.count);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 2 * 60 * 1000); // poll every 2 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#059669]/8 transition-colors">
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1"
            style={{ background: '#EA580C', fontFamily: 'var(--font-body)' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
            style={{ background: 'var(--surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                Notifications
              </h3>
              <button onClick={() => setOpen(false)} className="text-[#94A3B8] hover:text-[#64748B]">
                <X size={15} />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-[#CBD5E1]" />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>All clear — no alerts</p>
                </div>
              ) : notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                const color = n.type === 'invoice' ? '#EA580C' : '#059669';
                return (
                  <button key={n.id} onClick={() => { setOpen(false); navigate(n.href); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors text-left border-b border-[#F8FAFC] last:border-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}15` }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }} className="truncate">
                        {n.title}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {n.body}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
