// ---------------------------------------------------------------------------
// Authentication helpers (server-side only).
//
// - Password hashing with Node's built-in scrypt (salted, no external deps).
// - Stateless sessions: a signed token (payload + HMAC-SHA256) stored in an
//   httpOnly cookie. No server-side session store needed.
//
// The signing secret comes from AUTH_SECRET (set it in production). A dev
// fallback is used locally so things work out of the box.
// ---------------------------------------------------------------------------

import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET =
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me-in-production";

export const SESSION_COOKIE = "aw_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours (seconds)

/* ------------------------------ passwords -------------------------------- */

// Hash a plain password as "salt:hash" using scrypt.
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Verify a plain password against a stored "salt:hash". Timing-safe.
export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ------------------------------- sessions -------------------------------- */

function sign(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

// Build a signed session token for a staff member.
export function createSession(staff) {
  const payload = {
    id: staff.id,
    username: staff.username,
    name: staff.name,
    role: staff.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

// Validate a token: checks the signature and expiry. Returns the payload or null.
export function verifySession(token) {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  // Constant-time-ish compare via re-signing.
  if (sign(data) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// Read the current staff member from the session cookie (server components and
// route handlers). Returns the session payload or null if not signed in.
export async function getCurrentStaff() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
