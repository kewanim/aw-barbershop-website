# API Reference

The API is built with **Next.js App Router route handlers** (`frontend/app/api/`)
and runs as part of the main app — no separate server.

Base URL (local): `http://localhost:3000`

All responses are JSON. List endpoints return `{ count, data }`; single-item
endpoints return `{ data }`; errors return `{ error }` with an appropriate HTTP
status code. Data is read/written through `frontend/lib/store.js` (a local JSON
file store today, Firestore-ready for later).

---

## Appointments — `/api/appointments`

Full CRUD for bookings.

| Method | Path     | Description                          |
| ------ | -------- | ------------------------------------ |
| GET    | `/api/appointments`      | List bookings. Optional `?status=confirmed\|pending\|cancelled`. |
| POST   | `/api/appointments`      | Create a booking (validates input + re-checks availability). |
| GET    | `/api/appointments/:id`  | Get one booking.                     |
| PUT    | `/api/appointments/:id`  | Update a booking (partial allowed).  |
| DELETE | `/api/appointments/:id`  | Delete a booking.                    |

**Create example**

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jordan Smith",
    "customerEmail": "jordan@example.com",
    "customerPhone": "(555) 222-1111",
    "serviceId": "svc-002",
    "barberId": "barber-001",
    "date": "2026-06-20",
    "time": "11:00"
  }'
```

Required fields: `customerName`, `customerEmail`, `customerPhone`, `serviceId`,
`barberId`, `date`, `time`. New bookings start with `status: "pending"`. The
server re-checks availability and returns **409** if the slot was just taken.

---

## Availability — `/api/availability`

| Method | Path                | Description                                        |
| ------ | ------------------- | ------------------------------------------------- |
| GET    | `/api/availability` | Open start times for a barber/date/service.       |

Required query params: `barberId`, `date` (YYYY-MM-DD), `serviceId`.

```bash
curl "http://localhost:3000/api/availability?barberId=barber-001&date=2026-06-20&serviceId=svc-002"
# -> { "count": 14, "data": ["09:00", "11:00", "11:30", ...] }
```

Slots are computed from shop hours (09:00–18:00, 30-min steps) minus any
existing non-cancelled bookings for that barber that day, accounting for each
service's duration so longer services don't overlap.

---

## Barbers — `/api/barbers`

| Method | Path           | Description                                |
| ------ | -------------- | ------------------------------------------ |
| GET    | `/api/barbers` | List barbers. Optional `?available=true`.  |

## Services — `/api/services`

| Method | Path            | Description                               |
| ------ | --------------- | ----------------------------------------- |
| GET    | `/api/services` | List services. Optional `?category=Hair`. |

> Barbers and services are reference data (read-only for now). When Firestore is
> connected they'll gain create/update/delete plus admin management.

---

## Auth — _coming in Feature 2_

Admin authentication (protecting `/admin`) is the next feature. It will add
login endpoints under `/api/auth` and route protection for the dashboard.
