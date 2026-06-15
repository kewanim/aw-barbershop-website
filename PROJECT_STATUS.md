# 📊 Project Status — AW Beauty Salon Website

_Last updated: 2026-06-15_

## Quick Summary

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Client   | AW Beauty Salon (Silver Spring, MD) — unisex hair & barber studio |
| Budget   | _TBD — confirm with client_                   |
| Deadline | _TBD — confirm with client_                   |
| Phase    | **Phase 2 — feature build + real-content rebrand** |
| Stack    | Next.js (UI + API) · Tailwind · Firebase (planned) |
| Live site (current) | https://www.awbeautysalon.com — source of real content |

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

### ✅ Feature 2 — Admin login (done)
- **Multiple staff accounts** with scrypt-hashed passwords (`frontend/data/staff.json`
  seed → hashed into `.data/staff.json` at runtime; no plain-text passwords stored).
- **Session auth** via signed (HMAC) httpOnly cookie — no external service.
  Helpers in `frontend/lib/auth.js`; `AUTH_SECRET` env var for production.
- **`/api/auth/login`, `/logout`, `/me`** endpoints.
- **`/admin` is gated server-side** (`app/admin/layout.js`) and redirects to
  `/login` when not authenticated; dashboard shows the signed-in user + log out.
- **Booking-detail endpoints protected** (401 without a session); public
  booking creation stays open so customers don't need an account.
- Demo logins: `admin / admin123`, `marcus / marcus123` (change before launch).

---

## 🚧 In Progress

- **Feature 3 — Booking management** (next up): confirm / cancel / reschedule
  appointments directly from the admin dashboard (wired to the PUT/DELETE API).

---

## ⏭ What's Coming Next (agreed order)

1. ✅ Real booking + availability — **done**
2. ✅ Admin login & protected dashboard — **done**
3. ⏭ Booking management (confirm/cancel/reschedule from admin) — **next**
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

## 🎨 Content & Branding (rebranded to AW Beauty Salon)

Real content pulled from the live site (awbeautysalon.com) and applied:
- ✅ Name, tagline, about copy, address, phone, Instagram/Facebook links
- ✅ Real team: **Asmamaw** (Barber), **Joseph** (Hair Stylist)
- ✅ Two real Google testimonials (Monica B., Christopher Harris)
- ✅ Unisex service menu (men's hair, beard & shave, women's hair)

**Still placeholder / needed from client:**
- ⛳ **Service prices** — not on live site; current numbers are placeholders.
- ⛳ **Business hours** — not listed; footer says "please call to confirm".
- ⛳ **Real staff photos** — using stock placeholders (`photoDescription` flags this).
- ⛳ **Email address** — live site obfuscates it; need the real one.
- ⛳ Confirm full team roster (site only named two staff).

## 🗒 Notes for Next Session

- Confirm **budget and deadline** with the client and fill them in above.
- Collect the placeholders above (prices, hours, photos, email).
- Remove the demo-login hint on `/login` and set real staff passwords + `AUTH_SECRET` before launch.
- ✅ Decided: single Next.js app (UI + API routes), Firestore later. Express retired.
- ✅ GitHub repo live: https://github.com/kewanim/aw-barbershop-website
- **Next feature:** Feature 3 — booking management (confirm/cancel/reschedule).
- Bookings persist to a local file in dev; swap `lib/store.js` to Firestore
  before any production deploy (Vercel FS is ephemeral).
