# Architecture

How the pieces of the AW Beauty Salon project fit together.

## High-level overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│   Next.js app (React + Tailwind)  →  localhost:3000          │
│   Pages: / , /services , /booking , /admin                   │
└───────────────┬─────────────────────────────────────────────┘
                │  fetch (same-origin /api)
                ▼
┌─────────────────────────────────────────────────────────────┐
│        Next.js API routes  (frontend/app/api/…)             │
│   /api/appointments  /api/availability  /api/barbers         │
│   /api/services      (/api/auth — Feature 2)                 │
└───────────────┬─────────────────────────────────────────────┘
                │  frontend/lib/store.js  (repository interface)
                ▼
┌─────────────────────────────────────────────────────────────┐
│              Data layer                                      │
│   Local JSON file (.data/bookings.json)  →  Firebase Firestore │
└─────────────────────────────────────────────────────────────┘
```

The UI and the API live in a **single Next.js app** — no separate backend
server to run or deploy.

## Folder map

| Folder       | Responsibility                                              |
| ------------ | ----------------------------------------------------------- |
| `frontend/`  | The Next.js app — UI **and** API routes (`app/api/`) + data layer (`lib/`). |
| `database/`  | Firebase config template, schema, and seed data.            |
| `docs/`      | Project documentation (this folder).                        |
| `config/`    | Shared environment variable templates.                      |

## Frontend

- **App Router** (Next.js 16) — each route is a folder under `frontend/app/`.
- **`ThemeProvider`** (`components/ThemeProvider.js`) holds the light/dark state.
  On first load it picks dark mode in the evening (6 PM–6 AM) and light during
  the day, then remembers any manual toggle in `localStorage`.
- **Styling:** Tailwind CSS with a small set of reusable component classes
  (`.btn-primary`, `.card`, etc.) defined in `app/globals.css`.

## API & data layer

- **API routes** live in `frontend/app/api/` as Next.js route handlers — they
  run server-side as part of the same app (same-origin, no CORS, nothing extra
  to deploy).
- All data access goes through **`frontend/lib/store.js`**, a small repository
  with functions like `listBookings`, `createBooking`, `getAvailability`. Today
  it persists to a local JSON file (`.data/bookings.json`); swapping to Firestore
  means reimplementing just those functions — the API routes and UI don't change.
- **Availability** is computed server-side from shop hours minus existing
  bookings (respecting each service's duration), and re-checked on create to
  prevent double-booking.

## Data flow: creating a booking

1. Customer fills the form on `/booking`.
2. As they pick a barber, date, and service, the form calls `/api/availability`
   and shows only open start times.
3. The form validates input, then `POST`s to `/api/appointments`.
4. The API re-checks availability, saves the booking via `lib/store.js`, and
   returns it (or **409** if the slot was just taken).
5. The new booking appears live in the `/admin` dashboard.

## Where to go next

- Connect Firestore — see [`database/SETUP.md`](../database/SETUP.md).
- API contract — see [`API_REFERENCE.md`](API_REFERENCE.md).
- Deployment — see [`SETUP_INSTRUCTIONS.md`](SETUP_INSTRUCTIONS.md).
