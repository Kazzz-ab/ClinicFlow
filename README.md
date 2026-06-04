<div align="center">

# 🏥 ClinicFlow

**Intelligent clinic management — from first appointment to final invoice.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://prisma.io)

</div>

---

## Overview

ClinicFlow is a full-stack healthcare management platform built for modern clinics. It streamlines the complete patient journey — from registration and appointment scheduling through billing and analytics — in a beautiful, HIPAA-aware interface.

<table>
<tr>
<td width="50%">

**For Clinic Administrators**
- Full user + role management
- Analytics dashboard with revenue trends
- Audit log of every system change
- Bulk invoice status updates

</td>
<td width="50%">

**For Doctors & Receptionists**
- Real-time notification alerts
- One-click PDF invoice export
- Patient medical history at a glance
- Appointment management with status tracking

</td>
</tr>
</table>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Access** | Three roles: Admin, Doctor, Receptionist — each with scoped permissions |
| 🔔 **Live Notifications** | Bell dropdown with upcoming appointments & overdue invoices |
| 📄 **PDF Invoices** | One-click branded invoice export via jsPDF |
| 🌙 **Dark Mode** | System-aware theme with manual toggle, persisted to localStorage |
| 📊 **Analytics** | Bar charts, line graphs, and pie charts powered by Recharts |
| ☑️ **Bulk Actions** | Multi-select invoices → bulk status update in one click |
| 🛡️ **Admin Panel** | Create users, change roles, remove team members |
| 📋 **Audit Log** | Every write operation captured — who, what, when, from where |
| 🔑 **Password Reset** | Email-based reset flow via Resend |
| 📜 **Legal Pages** | Privacy Policy, Terms of Service, HIPAA Notice |

---

## 🏗️ Tech Stack

### Backend
```
Express.js (ESM)  ·  Prisma ORM  ·  PostgreSQL
JWT Auth  ·  bcryptjs  ·  Helmet  ·  CORS  ·  Rate Limiting
Resend (email)  ·  Morgan (logging)
```

### Frontend
```
React 18  ·  Vite  ·  Tailwind CSS  ·  Framer Motion
Recharts  ·  Lucide Icons  ·  jsPDF  ·  date-fns  ·  Zustand
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Supabase connection)
- A [Resend](https://resend.com) API key (optional — password reset emails)

### 1. Clone & install

```bash
git clone https://github.com/yourorg/clinicflow.git
cd clinicflow

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/clinicflow"
JWT_SECRET="your-strong-jwt-secret-min-32-chars"
CLIENT_ORIGIN="http://localhost:5173"
RESEND_API_KEY="re_..."          # optional
PORT=4000
NODE_ENV=development
```

### 3. Set up the database

```bash
cd backend
npx prisma db push        # push schema to your database
npx prisma db seed        # seed with sample data (optional)
```

### 4. Run development servers

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Default seed credentials:
| Email | Password | Role |
|---|---|---|
| `admin@clinicflow.io` | `Admin1234!` | Admin |
| `dr.smith@clinicflow.io` | `Doctor123!` | Doctor |
| `reception@clinicflow.io` | `Recept123!` | Receptionist |

---

## 📁 Project Structure

```
clinicflow/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── index.js             # Express app entry point
│       ├── middleware/
│       │   ├── auth.js          # JWT + role guards
│       │   ├── audit.js         # Write-operation audit capture
│       │   └── errorHandler.js  # Central error handler
│       ├── routes/
│       │   ├── auth.js          # Login, register, password reset
│       │   ├── patients.js      # Patient CRUD
│       │   ├── doctors.js       # Doctor CRUD
│       │   ├── appointments.js  # Appointment management
│       │   ├── invoices.js      # Billing + bulk-status
│       │   ├── analytics.js     # Chart data
│       │   ├── notifications.js # Notification feed
│       │   ├── stats.js         # Dashboard KPIs
│       │   └── admin.js         # User mgmt + audit log
│       └── lib/
│           ├── prisma.js        # Prisma client
│           └── email.js         # Resend email helper
│
└── frontend/
    └── src/
        ├── App.jsx              # Route definitions
        ├── theme.js             # Brand tokens (colors, fonts, copy)
        ├── components/
        │   └── layout/
        │       ├── Header.jsx
        │       ├── Footer.jsx
        │       └── NotificationBell.jsx
        ├── hooks/
        │   ├── useAuth.js
        │   └── useDarkMode.js
        ├── lib/
        │   ├── api.js           # Axios instance
        │   └── exportPDF.js     # Invoice PDF generator
        └── pages/
            ├── Dashboard.jsx
            ├── Patients.jsx
            ├── Doctors.jsx
            ├── Appointments.jsx
            ├── Invoices.jsx     # + Bulk actions
            ├── Analytics.jsx
            ├── AdminUsers.jsx   # Admin only
            ├── AuditLog.jsx     # Admin only
            └── legal/
                ├── Privacy.jsx
                ├── Terms.jsx
                └── Hipaa.jsx
```

---

## 🔐 Security

- JWT tokens validated on every protected request
- Role-based access control on all write endpoints
- Passwords hashed with bcrypt (cost factor 12)
- Helmet HTTP security headers
- Rate limiting: 100 req/15 min global, 20 req/15 min on auth routes
- CORS restricted to `CLIENT_ORIGIN` environment variable
- Audit middleware strips sensitive fields (passwords, medical records) before logging
- Input validation with search query length caps

---

## 🗺️ API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user |
| `POST` | `/api/auth/register` | Public | Create account |
| `GET` | `/api/patients` | Auth | List patients (paginated, searchable) |
| `POST` | `/api/patients` | Admin/Doctor/Reception | Create patient |
| `GET` | `/api/appointments` | Auth | List appointments |
| `GET` | `/api/invoices` | Auth | List invoices |
| `PATCH` | `/api/invoices/bulk-status` | Admin/Reception | Bulk status update |
| `GET` | `/api/analytics` | Auth | Chart data |
| `GET` | `/api/notifications` | Auth | Notification feed |
| `GET` | `/api/admin/users` | Admin | List users |
| `PUT` | `/api/admin/users/:id/role` | Admin | Change user role |
| `GET` | `/api/admin/audit` | Admin | Paginated audit log |

---

## 🎨 Design System

ClinicFlow uses a consistent design language throughout:

- **Primary**: Ocean Blue `#0077B6`
- **Accent**: Teal `#06B6A0`
- **Headings**: Plus Jakarta Sans
- **Body**: DM Sans
- **Radius**: 12–16px (xl/2xl)
- **Motion**: Framer Motion with spring physics
- **Dark mode**: CSS custom properties (`var(--bg)`, `var(--surface)`, `var(--text)`, `var(--muted)`)

---

## 📜 License

MIT © ClinicFlow. Built with care for healthcare professionals.
