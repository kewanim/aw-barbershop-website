// ---------------------------------------------------------------------------
// Auth API — basic customer authentication (demo / educational).
//
// Routes (mounted at /api/auth):
//   POST   /register        -> create a customer account
//   POST   /login           -> log in, returns a demo token
//   GET    /me              -> return the current user for a given token
//
// IMPORTANT: This is a simplified, in-memory demo. Passwords are NOT securely
// hashed and the "token" is not a real JWT. For production, use Firebase
// Authentication (see database/SETUP.md) or hash passwords with bcrypt and
// issue signed JWTs. Do not ship this as-is.
// ---------------------------------------------------------------------------

const express = require("express");
const crypto = require("crypto");
const router = express.Router();

// In-memory user store. Each user: { id, name, email, password, token }.
const users = [];

// Create a demo token. (A real app would sign a JWT with a secret.)
function makeToken(email) {
  return crypto.createHash("sha256").update(email + Date.now()).digest("hex");
}

// Very light password "hash" so we don't store plain text in memory.
// NOT secure — replace with bcrypt/Firebase in production.
function weakHash(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// REGISTER: create a new customer account.
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields: name, email, password" });
  }

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }

  const user = {
    id: `user-${users.length + 1}`,
    name,
    email,
    password: weakHash(password),
    token: makeToken(email),
  };
  users.push(user);

  // Never return the password back to the client.
  res.status(201).json({
    data: { id: user.id, name: user.name, email: user.email },
    token: user.token,
  });
});

// LOGIN: verify credentials and return a token.
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields: email, password" });
  }

  const user = users.find(
    (u) => u.email === email && u.password === weakHash(password)
  );
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  // Issue a fresh token on each login.
  user.token = makeToken(email);
  res.json({
    data: { id: user.id, name: user.name, email: user.email },
    token: user.token,
  });
});

// ME: return the user associated with a token (sent as `Authorization: Bearer <token>`).
router.get("/me", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  const user = users.find((u) => u.token === token);
  if (!user) return res.status(401).json({ error: "Invalid or missing token" });

  res.json({ data: { id: user.id, name: user.name, email: user.email } });
});

module.exports = router;
