// ---------------------------------------------------------------------------
// AW Barbershop — Backend API server
//
// A small Express server that wires together the four route modules. It uses
// in-memory sample data (loaded from ../backend/data/*.json by each module) so
// the API works out of the box. Swap the data layer for Firebase later — see
// database/SETUP.md and docs/ARCHITECTURE.md.
//
// Run it with:  cd backend && npm install && npm start
// ---------------------------------------------------------------------------

const express = require("express");
const cors = require("cors");

const appointments = require("./api/appointments");
const barbers = require("./api/barbers");
const services = require("./api/services");
const auth = require("./api/auth");

const app = express();
const PORT = process.env.PORT || 4000;

// --- Global middleware ---
app.use(cors());           // Allow the Next.js frontend to call this API.
app.use(express.json());   // Parse JSON request bodies.

// --- Health check ---
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "AW Barbershop API", version: "1.0.0" });
});

// --- Mount routers ---
app.use("/api/appointments", appointments);
app.use("/api/barbers", barbers);
app.use("/api/services", services);
app.use("/api/auth", auth);

// --- 404 fallback ---
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`AW Barbershop API running at http://localhost:${PORT}`);
});

module.exports = app;
