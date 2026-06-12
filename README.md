# Clinio

**Clinic care, organized.** Clinio is the operations home for independent clinics — the front desk books, doctors see their day, billing goes out, and the owner sees the numbers. No enterprise bloat, no per-seat surprise pricing. Just the workflow.

---

## The workflow it serves

A clinic day has four jobs, and Clinio gives each one a clean surface:

1. **Reception** — register a patient in seconds, find any record instantly, book against real doctor availability, get reminded when the 2 PM is about to walk in.
2. **Doctors** — open the day's queue, see the patient's history, allergies, and insurance before they sit down, mark the visit done.
3. **Billing** — generate an invoice from the visit, export a branded PDF, chase overdue ones with bulk status updates.
4. **Ownership** — a dashboard of appointment volume, revenue by period, and patient growth, plus an audit log of every change anyone made.

## Feature highlights

- **Role-based access** — admin, doctor, and receptionist each see exactly their workflow, enforced by JWT middleware on every route
- **Live notification bell** — upcoming appointments and overdue invoices surface themselves
- **One-click PDF invoices** — branded export via jsPDF, line items and status included
- **Analytics** — Recharts dashboards for appointment counts, revenue trends, and patient stats
- **Audit log** — every write captured: who, what, when, from where (sensitive fields stripped before logging)
- **Dark mode** — system-aware with manual toggle, persisted locally
- **Password reset** — email flow via Resend
- **HIPAA-aware** — privacy, terms, and HIPAA notice pages built in

## Running Clinio locally

You'll need Node.js 20+ and a PostgreSQL 15+ database (a free Supabase project works fine).

```bash
git clone https://github.com/yourorg/clinio.git
cd clinio
npm run install:all
```

Create `backend/.env` (see `backend/.env.example`):

```env
DATABASE_URL="postgresql://user:password@host:5432/clinio"
JWT_SECRET="your-strong-jwt-secret-min-32-chars"
CLIENT_ORIGIN="http://localhost:5173"
RESEND_API_KEY="re_..."   # optional — password reset emails
PORT=4000
```

Push the schema, seed sample data, and start both servers:

```bash
cd backend
npx prisma db push
npx prisma db seed       # optional sample clinic

cd ..
npm run dev              # backend on :4000, frontend on :5173
```

Open [http://localhost:5173](http://localhost:5173) and sign in with a seeded account (credentials are printed by the seed script — change them immediately).

## How it's put together

The backend is a single Express (ESM) application. Prisma owns the schema — Users, Patients, Doctors, Appointments, Invoices — and generates typed queries against PostgreSQL. Auth is JWT with role guards composed as plain middleware, so the full request chain (helmet → CORS → rate limit → audit → route → error handler) is readable top to bottom in `backend/src/index.js`.

The frontend is a React 18 + Vite SPA. Pages map one-to-one to the clinic workflow (`Patients`, `Doctors`, `Appointments`, `Invoices`, `Analytics`, plus admin-only `AdminUsers` and `AuditLog`). Tailwind handles styling, Framer Motion the movement, Zustand the auth state.

```
backend/
  prisma/schema.prisma     # source of truth for the data model
  src/
    index.js               # app entry — full middleware chain
    middleware/            # auth (JWT + roles), audit, error handler
    routes/                # auth, patients, doctors, appointments,
                           # invoices, analytics, notifications, stats, admin
    lib/                   # prisma client, Resend email helper
    scripts/seed.js        # sample clinic data

frontend/
  src/
    theme.js               # Clinio brand tokens + UI copy
    pages/                 # one page per workflow surface
    components/layout/     # Header, Footer, NotificationBell
    lib/                   # axios instance, invoice PDF export
    hooks/                 # useAuth, useDarkMode
```

## Who can do what

| Capability | Receptionist | Doctor | Admin |
|---|:---:|:---:|:---:|
| Register patients, book appointments | ✓ | ✓ | ✓ |
| See own patient queue | — | ✓ | ✓ |
| Create + bulk-update invoices | ✓ | — | ✓ |
| Manage users and roles | — | — | ✓ |
| Read the audit log | — | — | ✓ |

## Security posture

JWT validation on every protected request; bcrypt (cost 12) for passwords; Helmet headers; rate limiting (100 req/15 min global, 20 req/15 min on auth); CORS pinned to `CLIENT_ORIGIN`; audit middleware strips passwords and medical fields before persisting log entries.

## Look and feel

Clinio's identity is calm and clinical: **emerald** `#059669` as the primary, **teal** `#14B8A6` as the accent, deep green-ink surfaces for contrast moments, Plus Jakarta Sans for headings and DM Sans for body text, soft 12–16px radii, and spring-physics motion. Brand tokens live in `frontend/src/theme.js`.

## License

MIT © Clinio.
