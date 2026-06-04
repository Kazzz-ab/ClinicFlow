import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-[#0077B6] hover:underline mb-8 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0077B6,#06B6A0)' }}>
              <Shield size={18} className="text-white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
              Privacy Policy
            </h1>
          </div>
          <div className="rounded-2xl p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.85rem' }}>Last updated: June 2026</p>
            {[
              { title: '1. Information We Collect', body: 'ClinicFlow collects patient demographic information, appointment records, medical billing data, and staff login credentials necessary for clinic operations. All data is stored securely in encrypted databases hosted on Supabase (PostgreSQL).' },
              { title: '2. How We Use Your Information', body: 'Patient data is used solely to facilitate clinic operations including appointment scheduling, medical billing, and patient care coordination. We do not sell, rent, or share patient data with third parties except as required by law or for direct care purposes.' },
              { title: '3. Data Security', body: 'All data is encrypted in transit (TLS 1.3) and at rest. Access is controlled through role-based authentication (JWT). Passwords are hashed using bcrypt with a cost factor of 12. We conduct regular security audits and vulnerability assessments.' },
              { title: '4. HIPAA Compliance', body: 'ClinicFlow operates in compliance with the Health Insurance Portability and Accountability Act (HIPAA). We implement required administrative, physical, and technical safeguards to protect Protected Health Information (PHI).' },
              { title: '5. Data Retention', body: 'Patient records are retained for a minimum of 7 years as required by applicable healthcare regulations. Staff account data is retained for the duration of employment plus 2 years for audit purposes.' },
              { title: '6. Your Rights', body: 'Patients have the right to access, correct, or request deletion of their personal information. Submit requests to your clinic administrator. We will respond within 30 days.' },
              { title: '7. Contact', body: 'For privacy-related inquiries, contact your clinic administrator or email the system administrator listed in your deployment configuration.' },
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
