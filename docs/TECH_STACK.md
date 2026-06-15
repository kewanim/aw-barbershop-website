# Tech Stack

The tools used in this project and why.

## Frontend

| Tool             | Version | Why                                                        |
| ---------------- | ------- | ---------------------------------------------------------- |
| **Next.js**      | 16.x    | React framework with the App Router, file-based routing, and great DX. |
| **React**        | 19.x    | Component-based UI library.                                |
| **Tailwind CSS** | 3.x     | Utility-first styling — fast, consistent, responsive.      |
| **PostCSS / Autoprefixer** | — | Build pipeline for Tailwind + vendor prefixes.   |

## Backend

| Tool        | Version | Why                                              |
| ----------- | ------- | ------------------------------------------------ |
| **Node.js** | 18+     | JavaScript runtime.                              |
| **Express** | 4.x     | Minimal, well-known web framework for the REST API. |
| **CORS**    | 2.x     | Lets the frontend call the API from another origin. |

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
| **Vercel**  | Recommended hosting for the Next.js frontend. |
| **Render / Railway / Fly.io** | Options for hosting the Express backend. |

## Language

- **JavaScript (ES2020+)** throughout, for both the React frontend and the
  Express backend, to keep one language across the stack.
