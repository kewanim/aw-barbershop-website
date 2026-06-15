// ---------------------------------------------------------------------------
// Data store + booking logic (server-side only).
//
// This is the single place the app reads/writes data. Today it persists
// bookings to a local JSON file (.data/bookings.json) so everything works on
// localhost with zero external setup. The functions below are the "repository"
// interface — to move to Firebase later, reimplement these same functions with
// Firestore calls and nothing else in the app has to change.
//
// Reference data (services, barbers) is read from the seed JSON in /data and is
// treated as read-only for now.
// ---------------------------------------------------------------------------

import path from "path";
import { promises as fs } from "fs";

import servicesSeed from "@/data/services.json";
import barbersSeed from "@/data/barbers.json";
import bookingsSeed from "@/data/bookings.json";

// Where runtime booking data lives. Git-ignored; seeded on first use.
const DATA_DIR = path.join(process.cwd(), ".data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

// Shop opening hours, in minutes since midnight (09:00–18:00) and slot size.
const OPEN_MIN = 9 * 60; // 09:00
const CLOSE_MIN = 18 * 60; // 18:00
const SLOT_STEP = 30; // minutes between bookable start times

/* ----------------------------- time helpers ----------------------------- */

// "09:30" -> 570
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// 570 -> "09:30"
function toHHMM(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

// Duration (minutes) for a given service id; falls back to 30 if unknown.
function serviceDuration(serviceId) {
  const svc = servicesSeed.find((s) => s.id === serviceId);
  return svc ? svc.durationMinutes : SLOT_STEP;
}

/* --------------------------- low-level storage --------------------------- */

// Read all bookings from disk, seeding the file from the sample data the first
// time it's accessed.
async function readBookings() {
  try {
    const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookingsSeed, null, 2));
    return [...bookingsSeed];
  }
}

// Persist the full bookings array back to disk.
async function writeBookings(bookings) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// Simple unique-ish id, e.g. "bk-4821".
function newId() {
  return `bk-${Math.floor(1000 + Math.random() * 9000)}`;
}

/* ------------------------------ reference data --------------------------- */

export function listServices({ category } = {}) {
  return category
    ? servicesSeed.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase()
      )
    : servicesSeed;
}

export function listBarbers({ available } = {}) {
  return available ? barbersSeed.filter((b) => b.available) : barbersSeed;
}

/* ------------------------------- bookings -------------------------------- */

export async function listBookings({ status } = {}) {
  const bookings = await readBookings();
  return status ? bookings.filter((b) => b.status === status) : bookings;
}

export async function getBooking(id) {
  const bookings = await readBookings();
  return bookings.find((b) => b.id === id) || null;
}

// Compute the available start times for a barber on a date for a given service.
// A slot is available when the service fits within opening hours AND doesn't
// overlap any existing (non-cancelled) booking for that barber that day.
export async function getAvailability(barberId, date, serviceId) {
  const duration = serviceDuration(serviceId);
  const bookings = await readBookings();

  // Build busy intervals [start, end) from that barber's bookings that day.
  const busy = bookings
    .filter(
      (b) =>
        b.barberId === barberId &&
        b.date === date &&
        b.status !== "cancelled"
    )
    .map((b) => {
      const start = toMinutes(b.time);
      return [start, start + serviceDuration(b.serviceId)];
    });

  const slots = [];
  for (let t = OPEN_MIN; t + duration <= CLOSE_MIN; t += SLOT_STEP) {
    const overlaps = busy.some(([s, e]) => t < e && t + duration > s);
    if (!overlaps) slots.push(toHHMM(t));
  }
  return slots;
}

// Create a booking after validating input and re-checking availability on the
// server (so two people can't grab the same slot). Returns either { data } or
// { error, status }.
export async function createBooking(input) {
  const required = [
    "customerName",
    "customerEmail",
    "customerPhone",
    "serviceId",
    "barberId",
    "date",
    "time",
  ];
  const missing = required.filter((f) => !input[f]);
  if (missing.length) {
    return { error: `Missing required fields: ${missing.join(", ")}`, status: 400 };
  }

  const service = servicesSeed.find((s) => s.id === input.serviceId);
  const barber = barbersSeed.find((b) => b.id === input.barberId);
  if (!service) return { error: "Unknown service", status: 400 };
  if (!barber) return { error: "Unknown barber", status: 400 };

  // Re-check the slot is still free (guards against double-booking).
  const open = await getAvailability(input.barberId, input.date, input.serviceId);
  if (!open.includes(input.time)) {
    return {
      error: "That time was just booked. Please pick another slot.",
      status: 409,
    };
  }

  const booking = {
    id: newId(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    serviceId: service.id,
    serviceName: service.name,
    barberId: barber.id,
    barberName: barber.name,
    date: input.date,
    time: input.time,
    price: service.price,
    status: "pending",
    notes: input.notes || "",
  };

  const bookings = await readBookings();
  bookings.push(booking);
  await writeBookings(bookings);
  return { data: booking };
}

// Update an existing booking (partial). Returns { data } or { error, status }.
export async function updateBooking(id, patch) {
  const bookings = await readBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return { error: "Booking not found", status: 404 };

  // Never allow the id to be overwritten.
  bookings[index] = { ...bookings[index], ...patch, id: bookings[index].id };
  await writeBookings(bookings);
  return { data: bookings[index] };
}

// Delete a booking. Returns { data } or { error, status }.
export async function deleteBooking(id) {
  const bookings = await readBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return { error: "Booking not found", status: 404 };

  const [removed] = bookings.splice(index, 1);
  await writeBookings(bookings);
  return { data: removed };
}
