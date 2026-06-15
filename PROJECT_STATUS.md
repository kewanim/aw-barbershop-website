# 📊 Project Status — AW Barbershop Website

_Last updated: 2026-06-15_

## Quick Summary

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Client   | AW Barbershop                                 |
| Budget   | _TBD — confirm with client_                   |
| Deadline | _TBD — confirm with client_                   |
| Phase    | **Phase 1 — MVP scaffold complete**           |
| Stack    | Next.js · Tailwind · Express · Firebase (planned) |

---

## ✅ What's Done

- Full folder structure (frontend / backend / database / docs / config).
- **Frontend (Next.js + Tailwind):**
  - Homepage with hero, featured services, barber team, CTA.
  - Automatic dark/light mode (time-of-day) + manual toggle with persistence.
  - Services menu page grouped by category with pricing.
  - Working booking form with validation + confirmation screen.
  - Admin dashboard with stats, filterable bookings table, barber/service lists.
  - Responsive navbar (with mobile menu) and footer.
- **Backend (Express):** CRUD APIs for appointments, barbers, services + basic auth.
- **Sample data:** 3 barbers, 7 services, 5 bookings (shared across app & API).
- **Database:** Firebase config template, Firestore schema, seed data, setup guide.
- **Docs:** Architecture, API reference, setup/deploy, tech stack.
- README, .gitignore, .env templates, Next.js config.

---

## 🚧 In Progress

- _Nothing actively in progress — awaiting client review of the MVP._

---

## ⏭ What's Coming Next

- Connect the frontend to the live Express API (replace direct JSON imports).
- Wire up Firebase Firestore + Auth (see `database/SETUP.md`).
- Real admin authentication + protected dashboard routes.
- Booking availability logic (prevent double-booking a barber/time slot).
- Email/SMS booking confirmations.
- Real barber photography from the client.
- Deploy frontend to Vercel and backend to Render.

---

## 🧱 Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS 3
- **Backend:** Node.js, Express 4, CORS
- **Database:** Firebase Firestore + Auth (planned)
- **Hosting:** Vercel (frontend), Render/Railway (backend)
- **Tooling:** Git/GitHub

---

## 📂 File Locations

| What                | Where                                  |
| ------------------- | -------------------------------------- |
| Pages               | `frontend/app/`                        |
| UI components       | `frontend/components/`                 |
| Theme logic         | `frontend/components/ThemeProvider.js` |
| Frontend sample data| `frontend/data/`                       |
| API routes          | `backend/api/`                         |
| API server          | `backend/index.js`                     |
| DB schema & seed    | `database/`                            |
| Docs                | `docs/`                                |

---

## 🧠 Important Decisions

- **Sample data first:** the UI reads local JSON so the site demos with zero
  setup. The API mirrors the same data shapes for an easy switch later.
- **App Router (not Pages Router):** modern Next.js default; layouts simplify
  the shared navbar/footer/theme.
- **JavaScript (not TypeScript):** keeps the project approachable; can migrate
  to TS later if the client wants stricter typing.
- **Time-of-day theme:** dark mode 6 PM–6 AM, light otherwise, with a manual
  override saved to localStorage.
- **Denormalized booking fields:** `serviceName`/`barberName` are copied onto
  each appointment so tables render without extra lookups.

---

## 🗒 Notes for Next Session

- Confirm **budget and deadline** with the client and fill them in above.
- Get **real barber photos** + accurate service prices from the client.
- Decide whether to keep the standalone Express API or use Next.js API routes /
  Firebase directly.
- Set up the GitHub repo and CI before the next milestone.
- The booking form currently simulates the save (no persistence) — hook it to
  the API or Firestore next.
