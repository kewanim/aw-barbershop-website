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

Open <http://localhost:3000>. The site works fully with the bundled sample data
— no backend or database required.

## Run the backend API locally (optional)

```bash
cd barbershop-website/backend
npm install
npm start
```

The API runs at <http://localhost:4000>. Try `curl http://localhost:4000/api/services`.

> To have the frontend call the API instead of reading JSON directly, set
> `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` in `frontend/.env.local`
> and swap the data imports for `fetch` calls (see `docs/ARCHITECTURE.md`).

---

## Deploy the frontend (Vercel — recommended)

1. Push this repo to GitHub.
2. Go to <https://vercel.com> → **New Project** → import the repo.
3. Set the **Root Directory** to `frontend`.
4. Add any `NEXT_PUBLIC_*` env vars from `frontend/.env.example`.
5. Click **Deploy**. Vercel auto-detects Next.js.

## Deploy the backend (Render / Railway / Fly.io)

1. Create a new **Web Service** pointing at the `backend` folder.
2. Build command: `npm install` · Start command: `npm start`.
3. Set `PORT` if the host requires it (the server reads `process.env.PORT`).
4. After deploy, update `NEXT_PUBLIC_API_BASE_URL` in the frontend to the new URL.

## Connect a real database

Follow [`database/SETUP.md`](../database/SETUP.md) to set up Firebase Firestore
and seed it with `database/sample-data/`.

---

## Common issues

| Problem                              | Fix                                              |
| ------------------------------------ | ------------------------------------------------ |
| `next: command not found`            | Run `npm install` inside `frontend/` first.      |
| Port 3000 already in use             | `npm run dev -- -p 3001` to use another port.     |
| Styles not applying                  | Confirm `globals.css` is imported in `app/layout.js`. |
| API CORS error                       | The backend enables CORS; check the API base URL. |
