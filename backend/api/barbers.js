// ---------------------------------------------------------------------------
// Barbers API — list and manage the barber team.
//
// Routes (mounted at /api/barbers):
//   GET    /                -> list all barbers (optional ?available=true)
//   GET    /:id             -> get one barber
//   POST   /                -> add a new barber
//   PUT    /:id             -> update a barber
//   DELETE /:id             -> remove a barber
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

// Seed data cloned from the sample JSON.
let barbers = [...require("../data/barbers.json")];

function newId() {
  return `barber-${String(barbers.length + 1).padStart(3, "0")}`;
}

// READ: list barbers, optionally only those available (?available=true).
router.get("/", (req, res) => {
  const { available } = req.query;
  const result =
    available === "true" ? barbers.filter((b) => b.available) : barbers;
  res.json({ count: result.length, data: result });
});

// READ: a single barber by id.
router.get("/:id", (req, res) => {
  const barber = barbers.find((b) => b.id === req.params.id);
  if (!barber) return res.status(404).json({ error: "Barber not found" });
  res.json({ data: barber });
});

// CREATE: add a new barber to the team.
router.post("/", (req, res) => {
  const { name, title } = req.body;
  if (!name || !title) {
    return res.status(400).json({ error: "Missing required fields: name, title" });
  }

  const barber = {
    id: newId(),
    available: true,
    specialties: [],
    rating: 0,
    ...req.body,
  };

  barbers.push(barber);
  res.status(201).json({ data: barber });
});

// UPDATE: edit a barber (e.g. toggle availability).
router.put("/:id", (req, res) => {
  const index = barbers.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Barber not found" });

  barbers[index] = { ...barbers[index], ...req.body, id: barbers[index].id };
  res.json({ data: barbers[index] });
});

// DELETE: remove a barber.
router.delete("/:id", (req, res) => {
  const index = barbers.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Barber not found" });

  const [removed] = barbers.splice(index, 1);
  res.json({ data: removed, message: "Barber removed" });
});

module.exports = router;
