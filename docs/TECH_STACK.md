# Tech Stack

The tools used in this project and why.

## Frontend

| Tool             | Version | Why                                                        |
| ---------------- | ------- | ---------------------------------------------------------- |
| **Next.js**      | 16.x    | React framework with the App Router, file-based routing, and great DX. |
| **React**        | 19.x    | Component-based UI library.                                |
| **Tailwind CSS** | 3.x     | Utility-first styling — fast, consistent, responsive.      |
| **PostCSS / Autoprefixer** | — | Build pipeline for Tailwind + vendor prefixes.   |

## Backend / API

| Tool                     | Why                                                       |
| ------------------------ | --------------------------------------------------------- |
| **Next.js API routes**   | The API lives in the same app as the UI (`app/api/`) — same-origin, no CORS, one thing to deploy. |
| **Local file store**     | `frontend/lib/store.js` persists data to JSON on disk for dev; a Firestore adapter drops in later. |

> The project originally included a separate Express server. It was retired in
> favor of consolidated Next.js API routes (simpler hosting and one codebase).

## Database

| Tool                  | Why                                                   |
| --------------------- | ----------------------------------------------------- |
| **Firebase Firestore** | Managed NoSQL database — realtime, scalable, easy to start. |
| **Firebase Auth**      | Drop-in authentication for the admin/staff login.     |

> The app currently runs on **local JSON sample data** so there's nothing to set
> up to see it working. Firestore is the planned production data store.

## Tooling & Hosting

| Tool        | Role                                  |
| ----------- | ------------------------------------- |
| **Git / GitHub** | Version control & collaboration. |
| **Vercel**  | One-step hosting for the whole Next.js app (UI + API). |

## Language

- **JavaScript (ES2020+)** throughout — React components and Next.js API route
  handlers share one language across the stack.
