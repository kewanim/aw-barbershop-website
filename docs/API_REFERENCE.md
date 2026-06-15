# API Reference

Base URL (local): `http://localhost:4000`

All responses are JSON. List endpoints return `{ count, data }`; single-item
endpoints return `{ data }`; errors return `{ error }` with an appropriate HTTP
status code.

---

## Appointments — `/api/appointments`

Full CRUD for bookings.

| Method | Path     | Description                          |
| ------ | -------- | ------------------------------------ |
| GET    | `/`      | List all appointments. Optional `?status=confirmed\|pending\|cancelled`. |
| GET    | `/:id`   | Get one appointment.                 |
| POST   | `/`      | Create a booking.                    |
| PUT    | `/:id`   | Update a booking (partial allowed).  |
| DELETE | `/:id`   | Delete a booking.                    |

**Create example**

```bash
curl -X POST http://localhost:4000/api/appointments \
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

Required fields: `customerName`, `customerEmail`, `serviceId`, `barberId`,
`date`, `time`. New bookings start with `status: "pending"`.

---

## Barbers — `/api/barbers`

| Method | Path   | Description                                   |
| ------ | ------ | --------------------------------------------- |
| GET    | `/`    | List barbers. Optional `?available=true`.     |
| GET    | `/:id` | Get one barber.                               |
| POST   | `/`    | Add a barber (requires `name`, `title`).      |
| PUT    | `/:id` | Update a barber (e.g. toggle `available`).    |
| DELETE | `/:id` | Remove a barber.                              |

---

## Services — `/api/services`

| Method | Path   | Description                                              |
| ------ | ------ | ------------------------------------------------------- |
| GET    | `/`    | List services. Optional `?category=Hair`.               |
| GET    | `/:id` | Get one service.                                        |
| POST   | `/`    | Add a service (requires `name`, `price`, `durationMinutes`). |
| PUT    | `/:id` | Update a service (e.g. change `price`).                 |
| DELETE | `/:id` | Remove a service.                                       |

---

## Auth — `/api/auth`

Basic customer auth. **Demo only** — see the warning in `backend/api/auth.js`.

| Method | Path        | Description                                       |
| ------ | ----------- | ------------------------------------------------- |
| POST   | `/register` | Create an account (`name`, `email`, `password`).  |
| POST   | `/login`    | Log in (`email`, `password`); returns a token.    |
| GET    | `/me`       | Current user — send `Authorization: Bearer <token>`. |

**Login example**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "jordan@example.com", "password": "secret123" }'
```

Returns:

```json
{ "data": { "id": "user-1", "name": "Jordan", "email": "jordan@example.com" }, "token": "..." }
```
