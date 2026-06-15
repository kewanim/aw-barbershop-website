# Architecture

How the pieces of the AW Barbershop project fit together.

## High-level overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│   Next.js frontend (React + Tailwind)  →  localhost:3000     │
│   Pages: / , /services , /booking , /admin                   │
└───────────────┬─────────────────────────────────────────────┘
                │  HTTP (fetch / JSON)
                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                       │
│   localhost:4000                                             │
│   /api/appointments  /api/barbers  /api/services  /api/auth  │
└───────────────┬─────────────────────────────────────────────┘
                │  (today: in-memory JSON  →  later: Firestore)
                ▼
┌─────────────────────────────────────────────────────────────┐
│              Data layer                                      │
│   Sample JSON (database/sample-data) → Firebase Firestore    │
└─────────────────────────────────────────────────────────────┘
```

## Folder map

| Folder       | Responsibility                                              |
| ------------ | ----------------------------------------------------------- |
| `frontend/`  | The Next.js app users interact with (UI, pages, components). |
| `backend/`   | Express REST API with CRUD route modules.                   |
| `database/`  | Firebase config template, schema, and seed data.            |
| `docs/`      | Project documentation (this folder).                        |
| `config/`    | Shared environment variable templates.                      |

## Frontend

- **App Router** (Next.js 16) — each route is a folder under `frontend/app/`.
- **`ThemeProvider`** (`components/ThemeProvider.js`) holds the light/dark state.
  On first load it picks dark mode in the evening (6 PM–6 AM) and light during
  the day, then remembers any manual toggle in `localStorage`.
- **Data today:** pages import the JSON in `frontend/data/` directly, so the UI
  works with no backend running. The booking form builds a real booking object
  and (in production) would `POST` it to `/api/appointments`.
- **Styling:** Tailwind CSS with a small set of reusable component classes
  (`.btn-primary`, `.card`, etc.) defined in `app/globals.css`.

## Backend

- A thin **Express** server (`backend/index.js`) mounts four routers.
- Each router (`backend/api/*.js`) owns one resource and exposes CRUD endpoints.
- Data is seeded from `backend/data/*.json` and kept in memory. Swapping to
  Firestore means replacing the array operations inside each route — the HTTP
  contract stays the same.

## Data flow: creating a booking

1. Customer fills the form on `/booking`.
2. The form validates input client-side.
3. It assembles a booking object (matching the `appointments` schema).
4. In production it `POST`s to `/api/appointments`, which validates and stores it.
5. The new booking appears in the `/admin` dashboard.

## Where to go next

- Connect Firestore — see [`database/SETUP.md`](../database/SETUP.md).
- API contract — see [`API_REFERENCE.md`](API_REFERENCE.md).
- Deployment — see [`SETUP_INSTRUCTIONS.md`](SETUP_INSTRUCTIONS.md).
