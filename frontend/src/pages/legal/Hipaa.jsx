import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';

export default function Hipaa() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-[#0077B6] hover:underline mb-8 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0077B6,#06B6A0)' }}>
              <Heart size={18} className="text-white" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
              HIPAA Notice of Privacy Practices
            </h1>
          </div>
          <div className="rounded-2xl p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.85rem' }}>Effective Date: June 2026</p>
            {[
              { title: 'YOUR RIGHTS', body: 'You have the right to: get a copy of your paper or electronic medical record; correct your paper or electronic medical record; request confidential communication; ask us to limit the information we share; get a list of those with whom we\'ve shared your information; get a copy of this privacy notice; choose someone to act for you; and file a complaint if you believe your privacy rights have been violated.' },
              { title: 'YOUR CHOICES', body: 'You have both the right and choice to tell us to: share information with your family, close friends, or others involved in your care; share information in a disaster relief situation; and include your information in a hospital directory. If you are not able to tell us your preference, we may go ahead and share your information if we believe it is in your best interest.' },
              { title: 'OUR USES AND DISCLOSURES', body: 'We typically use or share your health information in the following ways: treat you; run our organization; bill for your services; help with public health and safety issues; do research; comply with the law; and address workers\' compensation, law enforcement, and other government requests.' },
              { title: 'HOW WE PROTECT YOUR INFORMATION', body: 'ClinicFlow uses administrative safeguards (policies and training), physical safeguards (secure facilities and access controls), and technical safeguards (encryption, audit logs, role-based access) to protect your health information.' },
              { title: 'FILING A COMPLAINT', body: 'If you feel we have violated your rights, you may file a complaint with your clinic administrator or with the U.S. Department of Health and Human Services Office for Civil Rights at hhs.gov/ocr/privacy. We will not retaliate against you for filing a complaint.' },
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
