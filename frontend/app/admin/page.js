"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import barbers from "@/data/barbers.json";
import services from "@/data/services.json";

// Admin dashboard. Shows summary stats and a filterable table of all bookings
// (fetched live from the API), plus per-booking management: confirm, cancel,
// reschedule, and delete — all wired to the protected /api/appointments routes.
export default function AdminPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [staff, setStaff] = useState(null); // the signed-in staff member
  const [rescheduleFor, setRescheduleFor] = useState(null); // booking being moved

  // Load all bookings from the API.
  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments");
      const json = await res.json();
      setBookings(json.data || []);
    } catch {
      setError("Could not load bookings. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Greet the signed-in staff member.
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => json && setStaff(json.data))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  // Update a booking's status (confirm / cancel).
  async function patchBooking(id, patch) {
    setError("");
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Update failed.");
      return;
    }
    loadBookings();
  }

  // Record a payment (charge-at-salon model): marks the booking paid for its
  // full price. In Phase 4b this is where a real Stripe charge would happen.
  async function markPaid(booking) {
    await patchBooking(booking.id, {
      paymentStatus: "paid",
      amountPaid: booking.price,
      paymentMethod: "in-person",
      paidAt: new Date().toISOString(),
    });
  }

  // Permanently delete a booking (used for cancelled rows).
  async function removeBooking(id) {
    if (!window.confirm("Delete this booking permanently?")) return;
    setError("");
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Delete failed.");
      return;
    }
    loadBookings();
  }

  // Derived summary statistics for the stat cards.
  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const pending = bookings.filter((b) => b.status === "pending");
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.price, 0);
    return {
      total: bookings.length,
      confirmed: confirmed.length,
      pending: pending.length,
      revenue,
    };
  }, [bookings]);

  const visibleBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {staff ? `Signed in as ${staff.name} (${staff.role})` : "Overview of appointments, team, and services."}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadBookings} className="btn-outline px-4 py-2 text-sm">
            {loading ? "Refreshing…" : "↻ Refresh"}
          </button>
          <button onClick={handleLogout} className="btn-primary px-4 py-2 text-sm">
            Log out
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* ---------------- Stat cards ---------------- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={stats.total} />
        <StatCard label="Confirmed" value={stats.confirmed} accent="green" />
        <StatCard label="Pending" value={stats.pending} accent="yellow" />
        <StatCard label="Revenue (active)" value={`$${stats.revenue}`} accent="gold" />
      </div>

      {/* ---------------- Bookings table ---------------- */}
      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold">Appointments</h2>
          <div className="ml-auto flex gap-2">
            {["all", "confirmed", "pending", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={[
                  "rounded-full px-3 py-1 text-sm font-medium capitalize transition",
                  filter === status
                    ? "bg-brand-gold text-brand-charcoal"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-brand-slate dark:text-gray-300",
                ].join(" ")}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-brand-slate dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">With</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    Loading bookings…
                  </td>
                </tr>
              )}
              {!loading && visibleBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-brand-slate/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-xs text-gray-500">{b.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3">{b.serviceName}</td>
                  <td className="px-4 py-3">{b.barberName}</td>
                  <td className="px-4 py-3">{b.date}</td>
                  <td className="px-4 py-3">{b.time}</td>
                  <td className="px-4 py-3 font-medium">${b.price}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    {b.paymentStatus === "paid" ? (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Paid ${b.amountPaid}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Unpaid</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {b.status === "pending" && (
                        <button onClick={() => patchBooking(b.id, { status: "confirmed" })} className={actionBtn("green")}>
                          Confirm
                        </button>
                      )}
                      {b.status !== "cancelled" && b.paymentStatus !== "paid" && (
                        <button onClick={() => markPaid(b)} className={actionBtn("green")}>
                          Mark paid
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <>
                          <button onClick={() => setRescheduleFor(b)} className={actionBtn("gold")}>
                            Reschedule
                          </button>
                          <button onClick={() => patchBooking(b.id, { status: "cancelled" })} className={actionBtn("red")}>
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status === "cancelled" && (
                        <button onClick={() => removeBooking(b.id)} className={actionBtn("gray")}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && visibleBookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No {filter} bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Team + Services summary ---------------- */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold">Team ({barbers.length})</h2>
          <ul className="space-y-3">
            {barbers.map((b) => (
              <li key={b.id} className="card flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.photoUrl} alt={b.name} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-gray-500">{b.title} · ⭐ {b.rating}</div>
                </div>
                <span className={[
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  b.available
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                ].join(" ")}>
                  {b.available ? "Available" : "Off"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Services ({services.length})</h2>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.id} className="card flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.category} · {s.durationMinutes} min</div>
                </div>
                <span className="font-bold text-brand-goldDark">${s.price}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Reschedule modal */}
      {rescheduleFor && (
        <RescheduleModal
          booking={rescheduleFor}
          onClose={() => setRescheduleFor(null)}
          onSaved={() => {
            setRescheduleFor(null);
            loadBookings();
          }}
        />
      )}
    </div>
  );
}

/* ---------- Reschedule modal ---------- */

// A small dialog to move a booking to a new date/time. It fetches the barber's
// open slots for the chosen date (excluding this booking) so staff can only
// pick a genuinely free time.
function RescheduleModal({ booking, onClose, onSaved }) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Refresh open slots whenever the date changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(
      `/api/availability?barberId=${booking.barberId}&date=${date}&serviceId=${booking.serviceId}&exclude=${booking.id}`
    )
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const t = j.data || [];
        setTimes(t);
        if (!t.includes(time)) setTime("");
      })
      .catch(() => !cancelled && setTimes([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function save() {
    if (!date || !time) {
      setError("Pick a date and time.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(`/api/appointments/${booking.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json.error || "Could not reschedule.");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-brand-slate">
        <h3 className="text-lg font-bold">Reschedule appointment</h3>
        <p className="mt-1 text-sm text-gray-500">
          {booking.customerName} · {booking.serviceName} · {booking.barberName}
        </p>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Date</span>
            <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={modalInput} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Time</span>
            <select value={time} onChange={(e) => setTime(e.target.value)} disabled={times.length === 0} className={modalInput}>
              <option value="">
                {loading ? "Checking…" : times.length === 0 ? "No open times" : "Choose a time…"}
              </option>
              {times.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline px-4 py-2 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const modalInput =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-brand-charcoal dark:text-gray-100";

/* ---------- Helpers ---------- */

// Compact action button styling by intent color.
function actionBtn(color) {
  const map = {
    green: "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300",
    red: "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300",
    gold: "border-brand-gold text-brand-goldDark hover:bg-brand-gold/10",
    gray: "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300",
  };
  return `rounded-md border px-2 py-1 text-xs font-medium transition ${map[color]}`;
}

// A single summary stat card with an optional accent color.
function StatCard({ label, value, accent }) {
  const accentColor = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    gold: "text-brand-goldDark",
  }[accent] || "text-gray-900 dark:text-gray-100";

  return (
    <div className="card">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${accentColor}`}>{value}</div>
    </div>
  );
}

// Colored pill showing a booking's status.
function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  }[status];

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}
