import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Mail, Phone, MapPin, Twitter, Linkedin, Github, Shield, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Patients', to: '/patients' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Invoices', to: '/invoices' },
];

const features = [
  'Patient Management', 'Doctor Scheduling', 'Appointment Booking',
  'Medical Records', 'Invoice & Billing', 'Analytics',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden mt-20" style={{ background: 'linear-gradient(160deg, #0A201C 0%, #0A2E26 60%, #064E3B 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #059669, #14B8A6)' }}>
                <Stethoscope size={18} className="text-white" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
                Clinio
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-5" style={{ fontFamily: 'var(--font-body)' }}>
              The calm operations layer for independent clinics — bookings, records, billing, and the day's queue in one organized place.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 600 }} className="text-sm mb-5 tracking-wide">
              NAVIGATION
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/55 hover:text-[#14B8A6] text-sm transition-colors flex items-center gap-2 group"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#059669] group-hover:bg-[#14B8A6] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 600 }} className="text-sm mb-5 tracking-wide">
              FEATURES
            </h4>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="text-white/55 text-sm flex items-center gap-2" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="w-1 h-1 rounded-full bg-[#14B8A6]" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 600 }} className="text-sm mb-5 tracking-wide">
              CONTACT
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: 'care@clinio.health' },
                { icon: Phone, text: '+1 (800) 555-0144' },
                { icon: MapPin, text: '210 Wellness Way, Suite 4\nAustin, TX 78704' },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(5,150,105,0.18)' }}>
                    <Icon size={13} className="text-[#34D399]" />
                  </div>
                  <span className="text-white/55 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-body)' }}>{text}</span>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-6 flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/55"
                style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)' }}>
                <Shield size={11} className="text-[#14B8A6]" /> HIPAA Compliant
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            © {new Date().getFullYear()} Clinio. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/35 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            Built with <Heart size={11} className="text-red-400 fill-red-400 mx-0.5" /> for clinic teams everywhere
          </div>
          <div className="flex gap-5">
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['HIPAA Notice', '/hipaa']].map(([l, href]) => (
              <a key={l} href={href} className="text-white/35 hover:text-white/70 text-xs transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
