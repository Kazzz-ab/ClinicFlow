// Clinio brand tokens and UI copy.
export const brand = {
  name: 'Clinio',
  tagline: 'Clinic care, organized',
  // Tailwind color tokens (must exist in tailwind.config.js)
  primary: 'emerald',
  accent: 'teal',
};

export const copy = {
  // Primary entity
  entity: { singular: 'Patient', plural: 'Patients' },
  // Provider entity
  provider: { singular: 'Doctor', plural: 'Doctors' },
  // Work unit
  workUnit: { singular: 'Appointment', plural: 'Appointments' },
  // Billing
  billing: { singular: 'Invoice', plural: 'Invoices' },
  // Nav labels
  nav: {
    dashboard: 'Dashboard',
    entities: 'Patients',
    providers: 'Doctors',
    workUnits: 'Appointments',
    billing: 'Invoices',
    settings: 'Settings',
  },
  // Status labels for work units
  statuses: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
  // Provider specialization label
  specializationLabel: 'Specialization',
  // Provider license label
  licenseLabel: 'License No.',
  // Provider rate label
  rateLabel: 'Consultation Fee',
};
