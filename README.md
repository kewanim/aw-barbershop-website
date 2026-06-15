# ✂️ AW Barbershop Website

A complete, production-ready barbershop website: a modern **Next.js + Tailwind
CSS** frontend, an **Express** REST API, and a **Firebase**-ready data layer.
It ships with realistic sample data so everything works the moment you run it.

![Tech](https://img.shields.io/badge/Next.js-14-black) ![Tech](https://img.shields.io/badge/React-18-blue) ![Tech](https://img.shields.io/badge/Tailwind-3-38bdf8) ![Tech](https://img.shields.io/badge/Express-4-green)

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
- **Express API** with full CRUD for appointments, barbers, and services, plus
  basic auth.

---

## 🚀 Quick Start

```bash
cd barbershop-website/frontend
npm install
npm run dev
```

Then open **<http://localhost:3000>**. That's it — the site runs on bundled
sample data with no backend or database required.

### Optional: run the API

```bash
cd barbershop-website/backend
npm install
npm start          # http://localhost:4000
```

---

## 🛠 Tech Stack

| Layer     | Tools                                      |
| --------- | ------------------------------------------ |
| Frontend  | Next.js 14 (App Router), React 18, Tailwind CSS 3 |
| Backend   | Node.js, Express 4, CORS                    |
| Database  | Firebase Firestore (template provided)      |
| Hosting   | Vercel (frontend), Render/Railway (backend) |

Full details in [`docs/TECH_STACK.md`](docs/TECH_STACK.md).

---

## 📁 Project Structure

```
barbershop-website/
├── frontend/            # Next.js app (the website users see)
│   ├── app/             # Pages: home, services, booking, admin
│   ├── components/      # Navbar, Footer, ThemeProvider, ThemeToggle
│   └── data/            # Sample JSON the UI reads
├── backend/             # Express REST API
│   ├── api/             # appointments, barbers, services, auth routes
│   └── data/            # Sample JSON the API serves
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
