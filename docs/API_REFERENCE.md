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
| PUT    | `/api/appointments/:id`  | Update a booking — confirm/cancel (`{status}`) or reschedule (`{date, time}`). |
| DELETE | `/api/appointments/:id`  | Delete a booking.                    |

Rescheduling (sending a new `date`/`time`) re-checks the barber's availability
on the server, ignoring the booking being moved, and returns **409** if the new
slot conflicts with another appointment.

The availability endpoint accepts an optional `&exclude=<bookingId>` so the
reschedule UI can list slots without counting the booking against itself.

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

## Auth — `/api/auth`

Staff authentication for the admin dashboard. Passwords are hashed with scrypt;
sessions are signed (HMAC) and stored in an httpOnly cookie. Set `AUTH_SECRET`
in production to sign cookies (a dev fallback is used locally).

| Method | Path               | Description                                       |
| ------ | ------------------ | ------------------------------------------------- |
| POST   | `/api/auth/login`  | Log in with `{ username, password }`; sets cookie. |
| POST   | `/api/auth/logout` | Clears the session cookie.                         |
| GET    | `/api/auth/me`     | Returns the signed-in staff member, or 401.        |

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "username": "admin", "password": "admin123" }' -c cookies.txt
```

**Demo staff logins** (seeded, change before production):
`admin / admin123` (owner) · `marcus / marcus123` (manager).

### Protected endpoints

These require a valid **staff** session cookie and return **401** otherwise:

- `GET /api/appointments` (lists customer details)
- `GET|PUT|DELETE /api/appointments/:id`

---

## Customer accounts — `/api/customer`

Customers can optionally create an account to save their details and view their
booking + payment history. Customers use a **separate** session cookie from
staff (`aw_customer`), so the two never mix.

| Method | Path                     | Description                                  |
| ------ | ------------------------ | -------------------------------------------- |
| POST   | `/api/customer/register` | Create an account (`name`, `email`, `password`) and sign in. |
| POST   | `/api/customer/login`    | Log in (`email`, `password`).                |
| POST   | `/api/customer/logout`   | Clear the customer cookie.                    |
| GET    | `/api/customer/me`       | The signed-in customer, or 401.               |
| GET    | `/api/customer/bookings` | The signed-in customer's history (their bookings). |

**Demo customer:** `monica@example.com / password123`.

When a customer is signed in, `POST /api/appointments` automatically links the
new booking to their account (`customerId`). Guests can still book with no account.

### Payment fields on a booking

Each booking carries payment tracking (charge-at-salon model):

| Field           | Meaning                                   |
| --------------- | ----------------------------------------- |
| `paymentStatus` | `unpaid` \| `paid`                        |
| `amountPaid`    | amount recorded as paid                   |
| `paymentMethod` | e.g. `in-person`, `card`                  |
| `paidAt`        | ISO timestamp when marked paid            |

Staff record a payment via `PUT /api/appointments/:id` (the admin "Mark paid"
button). **Phase 4b** will replace this with a real Stripe charge + saved cards.

The booking **create** endpoint (`POST /api/appointments`) and all reference
data (`/api/services`, `/api/barbers`, `/api/availability`) stay **public** so
customers can book without an account. The `/admin` page itself is gated
server-side and redirects to `/login` when not authenticated.
