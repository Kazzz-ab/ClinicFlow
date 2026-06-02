import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ClinicFlow...');

  await prisma.invoice.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  const hash = (p) => bcrypt.hash(p, 12);

  const adminUser = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@clinicflow.com', password: await hash('Admin1234!'), role: 'admin' } });
  const drChen = await prisma.user.create({ data: { name: 'Dr. Chen Wei', email: 'chen.wei@clinicflow.com', password: await hash('Doctor1234!'), role: 'doctor' } });
  const drPriya = await prisma.user.create({ data: { name: 'Dr. Priya Nair', email: 'priya.nair@clinicflow.com', password: await hash('Doctor1234!'), role: 'doctor' } });
  const drMarcus = await prisma.user.create({ data: { name: 'Dr. Marcus Hill', email: 'marcus.hill@clinicflow.com', password: await hash('Doctor1234!'), role: 'doctor' } });

  const doc1 = await prisma.doctor.create({ data: { userId: drChen.id, specialization: 'General Practice', licenseNumber: 'MD-10021', consultationFee: 150, availableDays: ['Mon','Tue','Wed','Thu','Fri'] } });
  const doc2 = await prisma.doctor.create({ data: { userId: drPriya.id, specialization: 'Cardiology', licenseNumber: 'MD-10022', consultationFee: 250, availableDays: ['Mon','Wed','Fri'] } });
  const doc3 = await prisma.doctor.create({ data: { userId: drMarcus.id, specialization: 'Orthopedics', licenseNumber: 'MD-10023', consultationFee: 200, availableDays: ['Tue','Thu'] } });

  const patients = await Promise.all([
    prisma.patient.create({ data: { firstName: 'Sarah', lastName: 'Mitchell', dateOfBirth: new Date('1985-03-12'), gender: 'female', email: 'sarah.mitchell@email.com', phone: '+1-555-0101', bloodGroup: 'A+', insuranceProvider: 'BlueCross' } }),
    prisma.patient.create({ data: { firstName: 'James', lastName: 'Okafor', dateOfBirth: new Date('1978-07-24'), gender: 'male', email: 'james.okafor@email.com', phone: '+1-555-0102', bloodGroup: 'O+', insuranceProvider: 'Aetna' } }),
    prisma.patient.create({ data: { firstName: 'Elena', lastName: 'Vasquez', dateOfBirth: new Date('1992-11-05'), gender: 'female', email: 'elena.v@email.com', phone: '+1-555-0103', bloodGroup: 'B-' } }),
    prisma.patient.create({ data: { firstName: 'David', lastName: 'Kim', dateOfBirth: new Date('1965-01-30'), gender: 'male', email: 'david.kim@email.com', phone: '+1-555-0104', bloodGroup: 'AB+', insuranceProvider: 'United' } }),
    prisma.patient.create({ data: { firstName: 'Amara', lastName: 'Osei', dateOfBirth: new Date('2001-09-18'), gender: 'female', email: 'amara.osei@email.com', phone: '+1-555-0105', bloodGroup: 'O-' } }),
  ]);

  const today = new Date(); today.setHours(9, 0, 0, 0);
  await Promise.all([
    prisma.appointment.create({ data: { patientId: patients[0].id, doctorId: doc1.id, date: today, startTime: '09:00', type: 'consultation', status: 'confirmed' } }),
    prisma.appointment.create({ data: { patientId: patients[1].id, doctorId: doc2.id, date: today, startTime: '10:30', type: 'follow-up', status: 'completed' } }),
    prisma.appointment.create({ data: { patientId: patients[2].id, doctorId: doc3.id, date: today, startTime: '11:00', type: 'emergency', status: 'scheduled' } }),
    prisma.appointment.create({ data: { patientId: patients[3].id, doctorId: doc1.id, date: today, startTime: '14:15', type: 'routine', status: 'confirmed' } }),
    prisma.appointment.create({ data: { patientId: patients[4].id, doctorId: doc2.id, date: today, startTime: '15:30', type: 'follow-up', status: 'scheduled' } }),
  ]);

  await Promise.all([
    prisma.invoice.create({ data: { patientId: patients[0].id, invoiceNumber: 'INV-CF-00001', lineItems: [{ description: 'Consultation', quantity: 1, unitPrice: 150 }], subtotal: 150, total: 150, status: 'paid', paidAt: new Date(), dueDate: new Date(Date.now() + 7*86400000) } }),
    prisma.invoice.create({ data: { patientId: patients[1].id, invoiceNumber: 'INV-CF-00002', lineItems: [{ description: 'Cardiology Review', quantity: 1, unitPrice: 250 }], subtotal: 250, total: 250, status: 'sent', dueDate: new Date(Date.now() + 14*86400000) } }),
    prisma.invoice.create({ data: { patientId: patients[2].id, invoiceNumber: 'INV-CF-00003', lineItems: [{ description: 'Emergency Visit', quantity: 1, unitPrice: 400 }], subtotal: 400, total: 400, status: 'overdue', dueDate: new Date(Date.now() - 5*86400000) } }),
    prisma.invoice.create({ data: { patientId: patients[3].id, invoiceNumber: 'INV-CF-00004', lineItems: [{ description: 'Routine Check', quantity: 1, unitPrice: 120 }], subtotal: 120, total: 120, status: 'draft', dueDate: new Date(Date.now() + 30*86400000) } }),
  ]);

  console.log('\nClinicFlow seeded! Login: admin@clinicflow.com / Admin1234!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
