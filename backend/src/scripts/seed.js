import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const hash = (p) => bcrypt.hash(p, 12);

const daysAgo      = (n) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(0,0,0,0); return d; };
const daysFromNow  = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0,0,0,0); return d; };
const monthsAgo    = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); d.setDate(15); d.setHours(0,0,0,0); return d; };
const atTime       = (base, h, m = 0) => { const d = new Date(base); d.setHours(h, m, 0, 0); return d; };

async function main() {
  console.log('🌱  Seeding ClinicFlow...');

  // clear in dependency order
  await prisma.auditLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // ── USERS ──────────────────────────────────────────────────────────────────
  const adminUser  = await prisma.user.create({ data: { name: 'Admin User',        email: 'admin@clinicflow.io',       password: await hash('Admin1234!'),  role: 'admin' } });
  const uChen      = await prisma.user.create({ data: { name: 'Dr. Chen Wei',      email: 'chen.wei@clinicflow.io',    password: await hash('Doctor1234!'), role: 'doctor' } });
  const uPriya     = await prisma.user.create({ data: { name: 'Dr. Priya Nair',    email: 'priya.nair@clinicflow.io',  password: await hash('Doctor1234!'), role: 'doctor' } });
  const uMarcus    = await prisma.user.create({ data: { name: 'Dr. Marcus Hill',   email: 'marcus.hill@clinicflow.io', password: await hash('Doctor1234!'), role: 'doctor' } });
  const uLeila     = await prisma.user.create({ data: { name: 'Dr. Leila Hassan',  email: 'leila.hassan@clinicflow.io',password: await hash('Doctor1234!'), role: 'doctor' } });
  await             prisma.user.create({ data: { name: 'Maya Torres',       email: 'reception@clinicflow.io',   password: await hash('Recept123!'),  role: 'receptionist' } });

  // ── DOCTORS ────────────────────────────────────────────────────────────────
  const doc1 = await prisma.doctor.create({ data: { userId: uChen.id,   specialization: 'General Practice', licenseNumber: 'MD-10021', qualifications: ['MBBS','MD'],                  consultationFee: 150, availableDays: ['Mon','Tue','Wed','Thu','Fri'], bio: 'Board-certified GP with 12 years in primary care.' } });
  const doc2 = await prisma.doctor.create({ data: { userId: uPriya.id,  specialization: 'Cardiology',        licenseNumber: 'MD-10022', qualifications: ['MBBS','DM Cardiology'],       consultationFee: 280, availableDays: ['Mon','Wed','Fri'],               bio: 'Interventional cardiologist, preventive heart care.' } });
  const doc3 = await prisma.doctor.create({ data: { userId: uMarcus.id, specialization: 'Orthopedics',       licenseNumber: 'MD-10023', qualifications: ['MBBS','MS Ortho'],            consultationFee: 220, availableDays: ['Tue','Thu'],                     bio: 'Sports medicine & joint replacement specialist.' } });
  const doc4 = await prisma.doctor.create({ data: { userId: uLeila.id,  specialization: 'Pediatrics',        licenseNumber: 'MD-10024', qualifications: ['MBBS','DCH','MD Pediatrics'], consultationFee: 180, availableDays: ['Mon','Tue','Wed','Thu'],          bio: "Children's health from infancy through adolescence." } });
  const docs = [doc1, doc2, doc3, doc4];

  // ── PATIENTS ───────────────────────────────────────────────────────────────
  const patientDefs = [
    { firstName:'Sarah',     lastName:'Mitchell',  dob:'1985-03-12', gender:'female', email:'sarah.mitchell@email.com',  phone:'+1-555-0101', blood:'A+',  insurance:'BlueCross',  allergies:['Penicillin'] },
    { firstName:'James',     lastName:'Okafor',    dob:'1978-07-24', gender:'male',   email:'james.okafor@email.com',    phone:'+1-555-0102', blood:'O+',  insurance:'Aetna',      allergies:[] },
    { firstName:'Elena',     lastName:'Vasquez',   dob:'1992-11-05', gender:'female', email:'elena.v@email.com',         phone:'+1-555-0103', blood:'B-',  insurance:'',           allergies:['Aspirin','Sulfa'] },
    { firstName:'David',     lastName:'Kim',       dob:'1965-01-30', gender:'male',   email:'david.kim@email.com',       phone:'+1-555-0104', blood:'AB+', insurance:'United',     allergies:[] },
    { firstName:'Amara',     lastName:'Osei',      dob:'2001-09-18', gender:'female', email:'amara.osei@email.com',      phone:'+1-555-0105', blood:'O-',  insurance:'',           allergies:[] },
    { firstName:'Liam',      lastName:'Chen',      dob:'1990-04-22', gender:'male',   email:'liam.chen@email.com',       phone:'+1-555-0106', blood:'A-',  insurance:'Cigna',      allergies:['Latex'] },
    { firstName:'Fatima',    lastName:'Al-Rashid', dob:'1983-08-14', gender:'female', email:'fatima.alr@email.com',      phone:'+1-555-0107', blood:'B+',  insurance:'BlueCross',  allergies:[] },
    { firstName:'Marcus',    lastName:'Brown',     dob:'1970-12-03', gender:'male',   email:'m.brown@email.com',         phone:'+1-555-0108', blood:'O+',  insurance:'Humana',     allergies:['Ibuprofen'] },
    { firstName:'Yuki',      lastName:'Tanaka',    dob:'1995-06-29', gender:'female', email:'yuki.tanaka@email.com',     phone:'+1-555-0109', blood:'AB-', insurance:'Kaiser',     allergies:[] },
    { firstName:'Carlos',    lastName:'Mendez',    dob:'1988-02-17', gender:'male',   email:'carlos.m@email.com',        phone:'+1-555-0110', blood:'A+',  insurance:'Aetna',      allergies:[] },
    { firstName:'Priscilla', lastName:'Nguyen',    dob:'1976-10-08', gender:'female', email:'p.nguyen@email.com',        phone:'+1-555-0111', blood:'O+',  insurance:'United',     allergies:['Codeine'] },
    { firstName:'Ahmed',     lastName:'Ibrahim',   dob:'1999-03-25', gender:'male',   email:'ahmed.i@email.com',         phone:'+1-555-0112', blood:'B+',  insurance:'',           allergies:[] },
    { firstName:'Grace',     lastName:'Adeyemi',   dob:'2012-07-11', gender:'female', email:'grace.a@email.com',         phone:'+1-555-0113', blood:'O+',  insurance:'BlueCross',  allergies:[] },
    { firstName:'Robert',    lastName:'Sullivan',  dob:'1955-11-30', gender:'male',   email:'r.sullivan@email.com',      phone:'+1-555-0114', blood:'A+',  insurance:'Medicare',   allergies:['Warfarin'] },
    { firstName:'Aisha',     lastName:'Patel',     dob:'2005-05-19', gender:'female', email:'aisha.p@email.com',         phone:'+1-555-0115', blood:'B+',  insurance:'Cigna',      allergies:[] },
    { firstName:'Noah',      lastName:'Williams',  dob:'1993-09-07', gender:'male',   email:'noah.w@email.com',          phone:'+1-555-0116', blood:'O-',  insurance:'Humana',     allergies:[] },
    { firstName:'Mei',       lastName:'Zhang',     dob:'1981-01-14', gender:'female', email:'mei.zhang@email.com',       phone:'+1-555-0117', blood:'A-',  insurance:'Kaiser',     allergies:['Penicillin'] },
    { firstName:'Kwame',     lastName:'Asante',    dob:'1968-06-26', gender:'male',   email:'kwame.a@email.com',         phone:'+1-555-0118', blood:'AB+', insurance:'United',     allergies:[] },
    { firstName:'Isabella',  lastName:'Rossi',     dob:'1997-04-03', gender:'female', email:'i.rossi@email.com',         phone:'+1-555-0119', blood:'O+',  insurance:'Aetna',      allergies:[] },
    { firstName:'Daniel',    lastName:'Park',      dob:'1960-08-20', gender:'male',   email:'d.park@email.com',          phone:'+1-555-0120', blood:'B-',  insurance:'Medicare',   allergies:['Aspirin'] },
  ];

  const patients = [];
  for (const p of patientDefs) {
    const created = await prisma.patient.create({
      data: { firstName: p.firstName, lastName: p.lastName, dateOfBirth: new Date(p.dob), gender: p.gender, email: p.email, phone: p.phone, bloodGroup: p.blood, insuranceProvider: p.insurance || null, allergies: p.allergies },
    });
    patients.push(created);
  }
  console.log(`  ✓ ${patients.length} patients`);

  // ── APPOINTMENTS ───────────────────────────────────────────────────────────
  // past (history for analytics) + today + upcoming (for notification bell)
  const now = new Date();
  const apptDefs = [
    // 4 weeks history
    { p:0,  d:0, dOff:-28, h:9,  type:'consultation', status:'completed' },
    { p:1,  d:1, dOff:-27, h:10, type:'follow-up',    status:'completed' },
    { p:2,  d:2, dOff:-26, h:11, type:'routine',      status:'completed' },
    { p:3,  d:3, dOff:-25, h:14, type:'consultation', status:'completed' },
    { p:4,  d:0, dOff:-24, h:15, type:'follow-up',    status:'completed' },
    { p:5,  d:1, dOff:-21, h:9,  type:'consultation', status:'completed' },
    { p:6,  d:2, dOff:-20, h:10, type:'emergency',    status:'completed' },
    { p:7,  d:3, dOff:-19, h:11, type:'routine',      status:'completed' },
    { p:8,  d:0, dOff:-18, h:9,  type:'consultation', status:'completed' },
    { p:9,  d:1, dOff:-17, h:14, type:'follow-up',    status:'completed' },
    { p:10, d:2, dOff:-14, h:10, type:'consultation', status:'completed' },
    { p:11, d:3, dOff:-13, h:15, type:'routine',      status:'no-show'   },
    { p:12, d:0, dOff:-12, h:9,  type:'consultation', status:'completed' },
    { p:13, d:1, dOff:-11, h:11, type:'follow-up',    status:'completed' },
    { p:14, d:2, dOff:-10, h:14, type:'routine',      status:'completed' },
    { p:15, d:3, dOff: -7, h:9,  type:'consultation', status:'completed' },
    { p:16, d:0, dOff: -6, h:10, type:'emergency',    status:'completed' },
    { p:17, d:1, dOff: -5, h:11, type:'follow-up',    status:'cancelled' },
    { p:18, d:2, dOff: -4, h:9,  type:'consultation', status:'completed' },
    { p:19, d:3, dOff: -3, h:14, type:'routine',      status:'completed' },
    { p:0,  d:0, dOff: -2, h:10, type:'follow-up',    status:'completed' },
    { p:1,  d:1, dOff: -1, h:11, type:'consultation', status:'completed' },
    // Today
    { p:2,  d:0, dOff:0, h:9,  type:'consultation', status:'confirmed' },
    { p:3,  d:1, dOff:0, h:10, type:'follow-up',    status:'confirmed' },
    { p:4,  d:2, dOff:0, h:11, type:'routine',      status:'scheduled' },
    { p:5,  d:3, dOff:0, h:14, type:'consultation', status:'scheduled' },
    { p:6,  d:0, dOff:0, h:15, type:'emergency',    status:'confirmed' },
    // Within 2 hours from NOW — these fire the notification bell
    { p:7,  d:1, dOff:0, h: now.getHours()+1, type:'consultation', status:'confirmed' },
    { p:8,  d:2, dOff:0, h: now.getHours()+1, m:30, type:'follow-up', status:'scheduled' },
    // Future
    { p:9,  d:0, dOff:1, h:9,  type:'consultation', status:'scheduled' },
    { p:10, d:1, dOff:2, h:10, type:'routine',      status:'scheduled' },
    { p:11, d:2, dOff:3, h:11, type:'follow-up',    status:'scheduled' },
    { p:12, d:3, dOff:4, h:14, type:'consultation', status:'scheduled' },
    { p:13, d:0, dOff:5, h:15, type:'routine',      status:'scheduled' },
    { p:14, d:1, dOff:6, h:10, type:'consultation', status:'scheduled' },
    { p:15, d:2, dOff:7, h:9,  type:'follow-up',    status:'scheduled' },
  ];

  for (const a of apptDefs) {
    const base = daysAgo(-a.dOff);
    const date = atTime(base, Math.min(a.h, 23), a.m || 0);
    const hh = String(Math.min(a.h, 23)).padStart(2,'0');
    const mm = String(a.m || 0).padStart(2,'0');
    await prisma.appointment.create({
      data: { patientId: patients[a.p].id, doctorId: docs[a.d].id, date, startTime: `${hh}:${mm}`, type: a.type, status: a.status },
    });
  }
  console.log(`  ✓ ${apptDefs.length} appointments`);

  // ── INVOICES ───────────────────────────────────────────────────────────────
  // 6 months of paid invoices → revenue line chart; current month mix for status pie
  const invoiceDefs = [
    { p:0,  d:0, mAgo:5, desc:'General Consultation',      fee:150,  status:'paid'    },
    { p:1,  d:1, mAgo:5, desc:'Cardiac Evaluation',        fee:280,  status:'paid'    },
    { p:2,  d:2, mAgo:5, desc:'Orthopedic Assessment',     fee:220,  status:'paid'    },
    { p:3,  d:3, mAgo:5, desc:'Pediatric Check-up',        fee:180,  status:'paid'    },
    { p:4,  d:0, mAgo:4, desc:'Follow-up Consultation',    fee:100,  status:'paid'    },
    { p:5,  d:1, mAgo:4, desc:'ECG + Consultation',        fee:380,  status:'paid'    },
    { p:6,  d:2, mAgo:4, desc:'X-Ray + Assessment',        fee:320,  status:'paid'    },
    { p:7,  d:3, mAgo:4, desc:'Child Wellness Exam',       fee:180,  status:'paid'    },
    { p:8,  d:0, mAgo:3, desc:'Annual Physical',           fee:200,  status:'paid'    },
    { p:9,  d:1, mAgo:3, desc:'Stress Test + Review',      fee:450,  status:'paid'    },
    { p:10, d:2, mAgo:3, desc:'Joint Injection',           fee:350,  status:'paid'    },
    { p:11, d:3, mAgo:3, desc:'Vaccination + Consult',     fee:150,  status:'paid'    },
    { p:12, d:0, mAgo:2, desc:'Urgent Care Visit',         fee:250,  status:'paid'    },
    { p:13, d:1, mAgo:2, desc:'Echo + Consultation',       fee:520,  status:'paid'    },
    { p:14, d:2, mAgo:2, desc:'Physical Therapy Eval',     fee:190,  status:'paid'    },
    { p:15, d:3, mAgo:2, desc:'Growth Monitoring',         fee:150,  status:'paid'    },
    { p:16, d:0, mAgo:1, desc:'Routine Check',             fee:150,  status:'paid'    },
    { p:17, d:1, mAgo:1, desc:'Holter Monitor Review',     fee:340,  status:'paid'    },
    { p:18, d:2, mAgo:1, desc:'Post-op Follow-up',         fee:180,  status:'paid'    },
    { p:19, d:3, mAgo:1, desc:'Well-child Visit',          fee:160,  status:'paid'    },
    { p:0,  d:0, mAgo:0, desc:'Consultation + Blood Work', fee:310,  status:'sent'    },
    { p:1,  d:1, mAgo:0, desc:'Cardiac Monitoring',        fee:480,  status:'sent'    },
    { p:2,  d:2, mAgo:0, desc:'MRI Referral + Consult',    fee:250,  status:'draft'   },
    { p:3,  d:3, mAgo:0, desc:'Specialist Referral',       fee:180,  status:'draft'   },
    { p:4,  d:0, mAgo:0, desc:'Emergency Consultation',    fee:420,  status:'overdue', dOvr:12 },
    { p:5,  d:1, mAgo:0, desc:'Cardiology Follow-up',      fee:280,  status:'overdue', dOvr:7  },
  ];

  for (let i = 0; i < invoiceDefs.length; i++) {
    const t = invoiceDefs[i];
    const num = String(i + 1).padStart(5, '0');
    const createdAt = t.status === 'overdue' ? daysAgo((t.dOvr || 0) + 30) : monthsAgo(t.mAgo);
    const dueDate   = t.status === 'overdue' ? daysAgo(t.dOvr || 0)        : daysFromNow(30);
    await prisma.invoice.create({
      data: {
        patientId: patients[t.p].id,
        invoiceNumber: `INV-CF-${num}`,
        lineItems: [{ description: t.desc, quantity: 1, unitPrice: t.fee }],
        subtotal: t.fee, total: t.fee,
        status: t.status,
        dueDate,
        paidAt: t.status === 'paid' ? createdAt : null,
        createdAt,
      },
    });
  }
  console.log(`  ✓ ${invoiceDefs.length} invoices`);

  console.log('\n✅  ClinicFlow seeded!');
  console.log('──────────────────────────────────────────────────');
  console.log('  admin@clinicflow.io      →  Admin1234!   (admin)');
  console.log('  chen.wei@clinicflow.io   →  Doctor1234!  (doctor)');
  console.log('  priya.nair@clinicflow.io →  Doctor1234!  (doctor)');
  console.log('  reception@clinicflow.io  →  Recept123!   (receptionist)');
  console.log('──────────────────────────────────────────────────\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
