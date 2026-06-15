"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import barbers from "@/data/barbers.json";
import services from "@/data/services.json";

// Basic admin dashboard. Shows summary stats and a filterable table of all
// bookings, fetched live from the API (/api/appointments) — so bookings made on
// the booking page show up here.
export default function AdminPage() {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Derived summary statistics for the stat cards.
  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const pending = bookings.filter((b) => b.status === "pending");
    // Only count revenue from bookings that aren't cancelled.
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

  // Apply the status filter to the bookings table.
  const visibleBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Overview of appointments, barbers, and services.
          </p>
        </div>
        <button onClick={loadBookings} className="btn-outline px-4 py-2 text-sm">
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
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

        {/* Horizontal scroll on small screens keeps the table readable. */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-brand-slate dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Barber</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
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
                </tr>
              ))}
              {!loading && visibleBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No {filter} bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Barbers + Services summary ---------------- */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold">Barbers ({barbers.length})</h2>
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
    </div>
  );
}

/* ---------- Helpers ---------- */

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
