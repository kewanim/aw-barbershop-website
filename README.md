# ✂️ AW Barbershop Website

A complete, production-ready barbershop website built as a single **Next.js +
Tailwind CSS** app — UI **and** API routes together — with a **Firebase**-ready
data layer. It ships with realistic sample data so everything works the moment
you run it.

![Tech](https://img.shields.io/badge/Next.js-16-black) ![Tech](https://img.shields.io/badge/React-19-blue) ![Tech](https://img.shields.io/badge/Tailwind-3-38bdf8) ![Tech](https://img.shields.io/badge/API-routes-orange)

---

## ✨ Features

- **Homepage** with a polished hero, featured services, and the barber team.
- **Automatic dark / light mode** — dark in the evening, light during the day,
  plus a manual toggle that remembers your choice.
- **Services menu** grouped by category with transparent pricing.
- **Working booking form** with validation and a live confirmation screen.
- **Admin dashboard** showing real stats, a filterable bookings table, and the
  barber & service roster.
- **100% mobile responsive** and accessible.
- **Real booking + availability** — Next.js API routes serve live open time
  slots per barber, persist bookings, and prevent double-booking.
- **Live admin dashboard** reading bookings from the API.

---

## 🚀 Quick Start

```bash
cd barbershop-website/frontend
npm install
npm run dev
```

Then open **<http://localhost:3000>**. That's it — UI, API routes, and the local
data store all run from this one app. No separate server or external database
required; bookings persist to a local file (`.data/`) as you create them.

---

## 🛠 Tech Stack

| Layer     | Tools                                      |
| --------- | ------------------------------------------ |
| UI        | Next.js 16 (App Router), React 19, Tailwind CSS 3 |
| API       | Next.js route handlers (`app/api/`)         |
| Data      | Local JSON file store (`lib/store.js`), Firebase Firestore-ready |
| Hosting   | Vercel (single app)                         |

Full details in [`docs/TECH_STACK.md`](docs/TECH_STACK.md).

---

## 📁 Project Structure

```
barbershop-website/
├── frontend/            # The Next.js app (UI + API)
│   ├── app/             # Pages (home, services, booking, admin)
│   │   └── api/         # API routes: appointments, availability, barbers, services
│   ├── components/      # Navbar, Footer, ThemeProvider, ThemeToggle
│   ├── lib/             # store.js — data layer + booking/availability logic
│   └── data/            # Seed JSON (services, barbers, bookings)
├── database/            # Firebase config template, schema, seed data
├── docs/                # Architecture, API reference, setup, tech stack
├── config/              # Shared .env template
├── PROJECT_STATUS.md    # Living project tracker
└── README.md            # You are here
```

---

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — how it all connects
- [API Reference](docs/API_REFERENCE.md) — every endpoint
- [Setup & Deployment](docs/SETUP_INSTRUCTIONS.md) — run & ship it
- [Tech Stack](docs/TECH_STACK.md) — tools and why
- [Database Setup](database/SETUP.md) — connect Firebase
- [Project Status](PROJECT_STATUS.md) — current progress

---

## 📝 License

Proprietary — built for the AW Barbershop client. All rights reserved.
