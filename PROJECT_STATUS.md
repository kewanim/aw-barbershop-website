# 📊 Project Status — AW Barbershop Website

_Last updated: 2026-06-15_

## Quick Summary

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Client   | AW Barbershop                                 |
| Budget   | _TBD — confirm with client_                   |
| Deadline | _TBD — confirm with client_                   |
| Phase    | **Phase 1 — MVP scaffold complete**           |
| Stack    | Next.js (UI + API) · Tailwind · Firebase (planned) |

---

## ✅ What's Done

- Full folder structure (frontend / database / docs / config).
- **Frontend (Next.js + Tailwind):**
  - Homepage with hero, featured services, barber team, CTA.
  - Automatic dark/light mode (time-of-day) + manual toggle with persistence.
  - Services menu page grouped by category with pricing.
  - Working booking form with validation + confirmation screen.
  - Admin dashboard with stats, filterable bookings table, barber/service lists.
  - Responsive navbar (with mobile menu) and footer.
- **Sample data:** 3 barbers, 7 services, 5 bookings.
- **Database:** Firebase config template, Firestore schema, seed data, setup guide.
- **Docs:** Architecture, API reference, setup/deploy, tech stack.
- README, .gitignore, .env templates, Next.js config.

### ✅ Feature 1 — Real booking + availability (done)
- **Next.js API routes** (`frontend/app/api/…`) now serve services, barbers,
  availability, and full CRUD for appointments — the standalone Express backend
  has been retired in favor of one consolidated Next.js app.
- **Swappable data layer** (`frontend/lib/store.js`) persists bookings to a
  local JSON file (`.data/bookings.json`, git-ignored). Built so a Firestore
  adapter can drop in later with no changes to the rest of the app.
- **Availability engine** computes open time slots per barber/date/service,
  honoring service duration and shop hours — no double-booking.
- **Booking form** fetches live open times and saves real bookings (with a
  server-side re-check that returns 409 if a slot was just taken).
- **Admin dashboard** now reads live bookings from the API with a refresh button.

---

## 🚧 In Progress

- **Feature 2 — Admin login** (next up): protect the `/admin` dashboard behind
  staff authentication.

---

## ⏭ What's Coming Next (agreed order)

1. ✅ Real booking + availability — **done**
2. ⏭ Admin login & protected dashboard — **next**
3. ⏭ Booking management (confirm/cancel/reschedule from admin)
4. ⏭ Payments / deposits at booking (Stripe)

Later / supporting:
- Wire up Firebase Firestore + Auth (see `database/SETUP.md`) — swap the local
  store adapter for Firestore.
- Email/SMS booking confirmations.
- Real barber photography + finalized content from the client.
- Deploy the Next.js app to Vercel.

---

## 🧱 Tech Stack

- **Frontend + Backend:** Next.js 16 (App Router) — UI **and** API routes in one app
- **Data layer:** local JSON file store now (`frontend/lib/store.js`), Firebase Firestore-ready
- **Auth/DB (planned):** Firebase Firestore + Auth
- **Hosting:** Vercel (single app)
- **Tooling:** Git/GitHub

---

## 📂 File Locations

| What                | Where                                  |
| ------------------- | -------------------------------------- |
| Pages               | `frontend/app/`                        |
| UI components       | `frontend/components/`                 |
| Theme logic         | `frontend/components/ThemeProvider.js` |
| Seed / reference data| `frontend/data/`                      |
| API routes          | `frontend/app/api/`                     |
| Data layer + booking logic | `frontend/lib/store.js`          |
| Runtime booking store| `frontend/.data/bookings.json` (git-ignored) |
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
- ✅ Decided: single Next.js app (UI + API routes), Firestore later. Express retired.
- ✅ GitHub repo live: https://github.com/kewanim/aw-barbershop-website
- **Next:** Feature 2 — admin login + protected `/admin` route.
- Bookings persist to a local file in dev; swap `lib/store.js` to Firestore
  before any production deploy (Vercel FS is ephemeral).
