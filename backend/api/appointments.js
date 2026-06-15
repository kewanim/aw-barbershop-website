// ---------------------------------------------------------------------------
// Appointments API — full CRUD for bookings.
//
// Routes (mounted at /api/appointments in index.js):
//   GET    /                -> list all appointments (optional ?status= filter)
//   GET    /:id             -> get one appointment
//   POST   /                -> create a new appointment
//   PUT    /:id             -> update an existing appointment
//   DELETE /:id             -> delete an appointment
//
// Data is held in memory and seeded from ../data/bookings.json. In production
// replace the array operations with Firestore calls (see database/SETUP.md).
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

// Seed data — cloned so we don't mutate the imported JSON module.
let bookings = [...require("../data/bookings.json")];

// Generate a simple unique-ish booking id (e.g. "bk-4821").
function newId() {
  return `bk-${Math.floor(1000 + Math.random() * 9000)}`;
}

// READ: list all appointments, optionally filtered by ?status=confirmed.
router.get("/", (req, res) => {
  const { status } = req.query;
  const result = status
    ? bookings.filter((b) => b.status === status)
    : bookings;
  res.json({ count: result.length, data: result });
});

// READ: a single appointment by id.
router.get("/:id", (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Appointment not found" });
  res.json({ data: booking });
});

// CREATE: add a new appointment.
router.post("/", (req, res) => {
  const { customerName, customerEmail, serviceId, barberId, date, time } = req.body;

  // Validate the required fields are present.
  if (!customerName || !customerEmail || !serviceId || !barberId || !date || !time) {
    return res.status(400).json({
      error: "Missing required fields: customerName, customerEmail, serviceId, barberId, date, time",
    });
  }

  const booking = {
    id: newId(),
    status: "pending",
    notes: "",
    ...req.body,
  };

  bookings.push(booking);
  res.status(201).json({ data: booking });
});

// UPDATE: modify an existing appointment (partial updates allowed).
router.put("/:id", (req, res) => {
  const index = bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Appointment not found" });

  // Merge incoming fields, but never let the id be overwritten.
  bookings[index] = { ...bookings[index], ...req.body, id: bookings[index].id };
  res.json({ data: bookings[index] });
});

// DELETE: remove an appointment.
router.delete("/:id", (req, res) => {
  const index = bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Appointment not found" });

  const [removed] = bookings.splice(index, 1);
  res.json({ data: removed, message: "Appointment deleted" });
});

module.exports = router;
