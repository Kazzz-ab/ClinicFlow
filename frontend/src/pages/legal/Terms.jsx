import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-[#0077B6] hover:underline mb-8 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0077B6,#06B6A0)' }}>
              <FileText size={18} className="text-white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
              Terms of Service
            </h1>
          </div>
          <div className="rounded-2xl p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.85rem' }}>Last updated: June 2026</p>
            {[
              { title: '1. Acceptance of Terms', body: 'By accessing ClinicFlow, you agree to these Terms of Service. If you do not agree, do not use the system. These terms apply to all staff members, administrators, and authorized users.' },
              { title: '2. Authorized Use', body: 'ClinicFlow is for authorized clinic personnel only. Access credentials are personal and non-transferable. Users are responsible for all activity under their account. Sharing login credentials is strictly prohibited.' },
              { title: '3. Data Accuracy', body: 'Users are responsible for the accuracy of data entered into the system. Patient information must be recorded truthfully and kept up to date. Falsifying medical or billing records is a violation of law and these terms.' },
              { title: '4. Prohibited Activities', body: 'Users may not attempt to circumvent security measures, access records beyond their authorized role, export bulk patient data without authorization, or use the system for any purpose other than legitimate clinic operations.' },
              { title: '5. System Availability', body: 'ClinicFlow aims for 99.9% uptime but does not guarantee uninterrupted access. Scheduled maintenance will be communicated in advance. We are not liable for data loss resulting from system outages beyond reasonable backup procedures.' },
              { title: '6. Modifications', body: 'These terms may be updated at any time. Continued use of ClinicFlow after changes constitutes acceptance of the revised terms.' },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{title}</h2>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
