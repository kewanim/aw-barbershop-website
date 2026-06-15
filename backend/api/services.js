// ---------------------------------------------------------------------------
// Services API — list services and their prices.
//
// Routes (mounted at /api/services):
//   GET    /                -> list all services (optional ?category= filter)
//   GET    /:id             -> get one service
//   POST   /                -> add a new service
//   PUT    /:id             -> update a service (e.g. change price)
//   DELETE /:id             -> remove a service
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

let services = [...require("../data/services.json")];

function newId() {
  return `svc-${String(services.length + 1).padStart(3, "0")}`;
}

// READ: list services, optionally filtered by ?category=Hair.
router.get("/", (req, res) => {
  const { category } = req.query;
  const result = category
    ? services.filter((s) => s.category.toLowerCase() === category.toLowerCase())
    : services;
  res.json({ count: result.length, data: result });
});

// READ: a single service by id.
router.get("/:id", (req, res) => {
  const service = services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ data: service });
});

// CREATE: add a new service.
router.post("/", (req, res) => {
  const { name, price, durationMinutes } = req.body;
  if (!name || price == null || durationMinutes == null) {
    return res.status(400).json({
      error: "Missing required fields: name, price, durationMinutes",
    });
  }

  const service = {
    id: newId(),
    category: "General",
    popular: false,
    description: "",
    ...req.body,
  };

  services.push(service);
  res.status(201).json({ data: service });
});

// UPDATE: edit a service.
router.put("/:id", (req, res) => {
  const index = services.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Service not found" });

  services[index] = { ...services[index], ...req.body, id: services[index].id };
  res.json({ data: services[index] });
});

// DELETE: remove a service.
router.delete("/:id", (req, res) => {
  const index = services.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Service not found" });

  const [removed] = services.splice(index, 1);
  res.json({ data: removed, message: "Service removed" });
});

module.exports = router;
