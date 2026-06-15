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
import staffSeed from "@/data/staff.json";
import customersSeed from "@/data/customers.json";
import { hashPassword, verifyPassword } from "@/lib/auth";

// Where runtime data lives. Git-ignored; seeded on first use.
const DATA_DIR = path.join(process.cwd(), ".data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const STAFF_FILE = path.join(DATA_DIR, "staff.json");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");

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
//
// `excludeBookingId` lets a reschedule ignore the booking being moved, so its
// own current slot doesn't count as "busy" against itself.
export async function getAvailability(barberId, date, serviceId, excludeBookingId = null) {
  const duration = serviceDuration(serviceId);
  const bookings = await readBookings();

  // Build busy intervals [start, end) from that barber's bookings that day.
  const busy = bookings
    .filter(
      (b) =>
        b.barberId === barberId &&
        b.date === date &&
        b.status !== "cancelled" &&
        b.id !== excludeBookingId
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
    // Link to a customer account when one is signed in (null for guests).
    customerId: input.customerId || null,
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
    // Payment is recorded later (charge-at-salon model). Tracks amount + method.
    paymentStatus: "unpaid",
    amountPaid: 0,
    paymentMethod: null,
    paidAt: null,
  };

  const bookings = await readBookings();
  bookings.push(booking);
  await writeBookings(bookings);
  return { data: booking };
}

// Update an existing booking (partial). Used by admin to confirm/cancel and to
// reschedule. When the date or time changes, the new slot is re-checked against
// the barber's other bookings (excluding this one) to prevent double-booking.
// Returns { data } or { error, status }.
export async function updateBooking(id, patch) {
  const bookings = await readBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return { error: "Booking not found", status: 404 };

  const current = bookings[index];

  // Reschedule guard: only when actually moving the date/time.
  const movingTo =
    (patch.date && patch.date !== current.date) ||
    (patch.time && patch.time !== current.time);
  if (movingTo) {
    const date = patch.date || current.date;
    const time = patch.time || current.time;
    const barberId = patch.barberId || current.barberId;
    const serviceId = patch.serviceId || current.serviceId;
    const open = await getAvailability(barberId, date, serviceId, id);
    if (!open.includes(time)) {
      return {
        error: "That slot isn't available. Please pick another time.",
        status: 409,
      };
    }
  }

  // Never allow the id to be overwritten.
  bookings[index] = { ...current, ...patch, id: current.id };
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

/* -------------------------------- staff ---------------------------------- */
// Staff accounts for the admin dashboard. Seeded from data/staff.json, but the
// plain seed passwords are hashed (scrypt) before they're written to disk, so
// the runtime store (.data/staff.json) never contains plain-text passwords.

async function readStaff() {
  try {
    const raw = await fs.readFile(STAFF_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    const seeded = staffSeed.map((s) => ({
      id: s.id,
      username: s.username,
      name: s.name,
      role: s.role,
      passwordHash: hashPassword(s.password),
    }));
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STAFF_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

// List staff without exposing password hashes.
export async function listStaff() {
  const staff = await readStaff();
  return staff.map(({ passwordHash, ...rest }) => rest);
}

// Verify a username/password. Returns the safe staff object or null.
export async function verifyStaffCredentials(username, password) {
  const staff = await readStaff();
  const found = staff.find(
    (s) => s.username.toLowerCase() === String(username || "").toLowerCase()
  );
  if (!found) return null;
  if (!verifyPassword(password, found.passwordHash)) return null;
  const { passwordHash, ...safe } = found;
  return safe;
}

/* ------------------------------ customers -------------------------------- */
// Customer accounts let people save details, view their booking/payment
// history, and (in Phase 4b) save a card on file. Passwords are scrypt-hashed,
// same as staff. The `stripeCustomerId` is populated later when Stripe is wired.

async function readCustomers() {
  try {
    const raw = await fs.readFile(CUSTOMERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    const seeded = customersSeed.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      passwordHash: hashPassword(c.password),
      stripeCustomerId: c.stripeCustomerId || null,
    }));
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

async function writeCustomers(list) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(list, null, 2));
}

// Strip the password hash before returning a customer to callers.
function safeCustomer(c) {
  const { passwordHash, ...rest } = c;
  return rest;
}

// Register a new customer. Returns { data } or { error, status }.
export async function createCustomer({ name, email, password }) {
  if (!name || !email || !password) {
    return { error: "Name, email and password are required", status: 400 };
  }
  const customers = await readCustomers();
  if (customers.some((c) => c.email.toLowerCase() === String(email).toLowerCase())) {
    return { error: "An account with that email already exists", status: 409 };
  }
  const customer = {
    id: `cust-${Date.now().toString(36)}`,
    name,
    email,
    passwordHash: hashPassword(password),
    stripeCustomerId: null,
  };
  customers.push(customer);
  await writeCustomers(customers);
  return { data: safeCustomer(customer) };
}

// Verify customer login. Returns the safe customer or null.
export async function verifyCustomerCredentials(email, password) {
  const customers = await readCustomers();
  const found = customers.find(
    (c) => c.email.toLowerCase() === String(email || "").toLowerCase()
  );
  if (!found) return null;
  if (!verifyPassword(password, found.passwordHash)) return null;
  return safeCustomer(found);
}

export async function getCustomerById(id) {
  const customers = await readCustomers();
  const found = customers.find((c) => c.id === id);
  return found ? safeCustomer(found) : null;
}

// All bookings belonging to a customer, newest first — their history.
export async function listBookingsByCustomer(customerId) {
  const bookings = await readBookings();
  return bookings
    .filter((b) => b.customerId === customerId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
