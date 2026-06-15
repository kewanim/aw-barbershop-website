# Setup & Deployment Instructions

## Prerequisites
- **Node.js 18.17+** (Node 20 LTS recommended)
- **npm** (comes with Node)
- A code editor (VS Code recommended)

---

## Run the frontend locally

```bash
cd barbershop-website/frontend
npm install
npm run dev
```

Open <http://localhost:3000>. UI and API run from the same app — no separate
server needed. The API lives at `/api/*` (e.g. `curl http://localhost:3000/api/services`).
Bookings you create persist to `frontend/.data/bookings.json` (git-ignored).

---

## Deploy (Vercel — recommended)

Because the UI and API are one Next.js app, there's a single deploy.

1. Push this repo to GitHub.
2. Go to <https://vercel.com> → **New Project** → import the repo.
3. Set the **Root Directory** to `frontend`.
4. Add any `NEXT_PUBLIC_*` env vars from `frontend/.env.example`.
5. Click **Deploy**. Vercel auto-detects Next.js.

> **Before deploying to production**, connect Firestore (next step). Vercel's
> filesystem is read-only/ephemeral, so the local `.data/` file store is for
> development only — the Firestore adapter replaces it for production.

## Connect a real database

Follow [`database/SETUP.md`](../database/SETUP.md) to set up Firebase Firestore
and seed it with `database/sample-data/`. Then reimplement the functions in
`frontend/lib/store.js` with Firestore calls — nothing else changes.

---

## Common issues

| Problem                              | Fix                                              |
| ------------------------------------ | ------------------------------------------------ |
| `next: command not found`            | Run `npm install` inside `frontend/` first.      |
| Port 3000 already in use             | `npm run dev -- -p 3001` to use another port.     |
| Styles not applying                  | Confirm `globals.css` is imported in `app/layout.js`. |
| Bookings not persisting              | Check `frontend/.data/` is writable; delete it to reseed. |
