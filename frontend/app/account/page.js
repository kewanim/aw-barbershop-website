"use client";

import { useCallback, useEffect, useState } from "react";

// Customer "My Account" page.
// - Logged out: shows a combined Login / Register card.
// - Logged in: shows the customer's booking & payment history, plus a
//   placeholder for saved payment methods (wired up in Phase 4b with Stripe).
export default function AccountPage() {
  const [customer, setCustomer] = useState(null);
  const [checking, setChecking] = useState(true);

  // Check whether the customer is already signed in.
  const refreshMe = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/customer/me");
      setCustomer(res.ok ? (await res.json()).data : null);
    } catch {
      setCustomer(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  if (checking) {
    return <div className="py-20 text-center text-gray-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {customer ? (
        <Dashboard customer={customer} onLogout={refreshMe} />
      ) : (
        <AuthCard onAuthed={refreshMe} />
      )}
    </div>
  );
}

/* --------------------------- Logged-in dashboard -------------------------- */

function Dashboard({ customer, onLogout }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/bookings")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setHistory(json.data || []))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/customer/logout", { method: "POST" });
    onLogout();
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">My Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome back, {customer.name.split(" ")[0]} · {customer.email}
          </p>
        </div>
        <button onClick={logout} className="btn-outline px-4 py-2 text-sm">Log out</button>
      </div>

      {/* Booking & payment history */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">Visit & Payment History</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-brand-slate dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">With</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading…</td></tr>
              )}
              {!loading && history.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 font-medium">{b.serviceName}</td>
                  <td className="px-4 py-3">{b.barberName}</td>
                  <td className="px-4 py-3">{b.date}</td>
                  <td className="px-4 py-3">{b.time}</td>
                  <td className="px-4 py-3">${b.price}</td>
                  <td className="px-4 py-3">
                    {b.paymentStatus === "paid" ? (
                      <span className="text-green-600 dark:text-green-400">
                        Paid ${b.amountPaid}{b.paymentMethod ? ` · ${b.paymentMethod}` : ""}
                      </span>
                    ) : (
                      <span className="text-gray-400">Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">{b.status}</td>
                </tr>
              ))}
              {!loading && history.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No visits yet — book your first appointment!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Saved payment methods — comes alive in Phase 4b (Stripe) */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">Saved Payment Methods</h2>
        <div className="card text-sm text-gray-500 dark:text-gray-400">
          💳 Saving a card on file is coming soon. Once enabled, you&apos;ll be able
          to securely store a card here so checkout is one tap next time.
        </div>
      </section>
    </div>
  );
}

/* ------------------------- Logged-out auth card --------------------------- */

function AuthCard({ onAuthed }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/api/customer/login" : "/api/customer/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
        return;
      }
      onAuthed(); // re-checks /me and flips to the dashboard
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <h1 className="section-title">My Account</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {mode === "login"
            ? "Sign in to see your visit history and save your details."
            : "Create an account to track your visits and save your details."}
        </p>
      </div>

      {/* Login / Register toggle */}
      <div className="mt-6 flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
        {["login", "register"].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(""); }}
            className={[
              "flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition",
              mode === m ? "bg-brand-gold text-brand-charcoal" : "text-gray-600 dark:text-gray-300",
            ].join(" ")}
          >
            {m === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="card mt-4 space-y-5" noValidate>
        {mode === "register" && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Full Name</span>
            <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Monica Bell" className={input} />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className={input} />
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      {mode === "login" && (
        <p className="mt-4 text-center text-xs text-gray-400">
          Demo account: <code>monica@example.com / password123</code>
        </p>
      )}
    </div>
  );
}

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40 dark:border-gray-600 dark:bg-brand-charcoal dark:text-gray-100";
