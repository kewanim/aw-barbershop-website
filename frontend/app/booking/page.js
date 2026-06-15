"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import services from "@/data/services.json";
import barbers from "@/data/barbers.json";
import PageHeader from "@/components/PageHeader";

// The form is wrapped in <Suspense> because it uses useSearchParams(),
// which Next.js requires to be inside a Suspense boundary.
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading…</div>}>
      <BookingForm />
    </Suspense>
  );
}

function BookingForm() {
  // If the user arrived from the services page (e.g. /booking?service=svc-002),
  // pre-select that service in the dropdown.
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  // Controlled form state.
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: preselectedService,
    barberId: "",
    date: "",
    time: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null); // booking returned by the API
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Live availability for the chosen barber/date/service.
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Only barbers marked available can be chosen.
  const availableBarbers = useMemo(() => barbers.filter((b) => b.available), []);
  const selectedService = services.find((s) => s.id === form.serviceId);

  // Today's date in YYYY-MM-DD, used as the minimum selectable date.
  const today = new Date().toISOString().split("T")[0];

  // Whenever the barber, date, or service changes, ask the API which start
  // times are still open. This is what prevents double-booking.
  useEffect(() => {
    const { barberId, date, serviceId } = form;
    if (!barberId || !date || !serviceId) {
      setAvailableTimes([]);
      return;
    }

    let cancelled = false;
    setLoadingTimes(true);
    fetch(`/api/availability?barberId=${barberId}&date=${date}&serviceId=${serviceId}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const times = json.data || [];
        setAvailableTimes(times);
        // If the currently picked time is no longer open, clear it.
        setForm((prev) =>
          prev.time && !times.includes(prev.time) ? { ...prev, time: "" } : prev
        );
      })
      .catch(() => !cancelled && setAvailableTimes([]))
      .finally(() => !cancelled && setLoadingTimes(false));

    return () => {
      cancelled = true;
    };
  }, [form.barberId, form.date, form.serviceId]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Basic client-side validation — every required field must be filled.
  function validate() {
    const next = {};
    if (!form.customerName.trim()) next.customerName = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail))
      next.customerEmail = "Please enter a valid email.";
    if (!form.customerPhone.trim()) next.customerPhone = "Please enter a phone number.";
    if (!form.serviceId) next.serviceId = "Please choose a service.";
    if (!form.barberId) next.barberId = "Please choose a stylist or barber.";
    if (!form.date) next.date = "Please pick a date.";
    if (!form.time) next.time = "Please pick a time.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Submit the booking to the API. On success we show the confirmation screen
  // with the server-assigned confirmation number. On a 409 (slot just taken)
  // we refresh the open times so the user can pick again.
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || "Something went wrong. Please try again.");
        // If the slot was taken, refresh availability for the current selection.
        if (res.status === 409) {
          const r = await fetch(
            `/api/availability?barberId=${form.barberId}&date=${form.date}&serviceId=${form.serviceId}`
          );
          const a = await r.json();
          setAvailableTimes(a.data || []);
          setForm((prev) => ({ ...prev, time: "" }));
        }
        return;
      }

      setConfirmed(json.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError("Network error. Is the dev server running?");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Confirmation screen (shown after a successful booking) ----
  if (confirmed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="card text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-bold">Booking Confirmed!</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Thanks, {confirmed.customerName.split(" ")[0]} — we&apos;ll see you soon.
          </p>

          <dl className="mt-6 space-y-2 rounded-xl bg-gray-50 p-5 text-left text-sm dark:bg-brand-charcoal">
            <Row label="Confirmation #" value={confirmed.id} />
            <Row label="Service" value={confirmed.serviceName} />
            <Row label="Barber" value={confirmed.barberName} />
            <Row label="Date" value={confirmed.date} />
            <Row label="Time" value={confirmed.time} />
            <Row label="Price" value={`$${confirmed.price}`} />
            <Row label="Status" value={confirmed.status} />
          </dl>

          <button
            onClick={() => {
              setConfirmed(null);
              setForm((p) => ({ ...p, time: "", date: "" }));
            }}
            className="btn-outline mt-6"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // Helper text for the time dropdown depending on what's selected.
  const timeHint = !form.serviceId || !form.barberId || !form.date
    ? "Pick a service, barber, and date to see open times"
    : loadingTimes
    ? "Checking availability…"
    : availableTimes.length === 0
    ? "No open times that day — try another date"
    : null;

  // ---- Booking form ----
  return (
    <div>
      <PageHeader
        title="Book an Appointment"
        subtitle="Fill in your details and we'll lock in your spot."
      />
      <div className="mx-auto max-w-2xl px-4 pb-14 pt-8 sm:px-6">

      {/* Server-side error banner (e.g. the slot was just taken) */}
      {serverError && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card mt-6 space-y-6" noValidate>
        {/* Name */}
        <Field label="Full Name" error={errors.customerName}>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            placeholder="Jordan Smith"
            className={inputClass(errors.customerName)}
          />
        </Field>

        {/* Email + Phone side by side on larger screens */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Email" error={errors.customerEmail}>
            <input
              type="email"
              value={form.customerEmail}
              onChange={(e) => updateField("customerEmail", e.target.value)}
              placeholder="you@example.com"
              className={inputClass(errors.customerEmail)}
            />
          </Field>
          <Field label="Phone" error={errors.customerPhone}>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={(e) => updateField("customerPhone", e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass(errors.customerPhone)}
            />
          </Field>
        </div>

        {/* Service */}
        <Field label="Service" error={errors.serviceId}>
          <select
            value={form.serviceId}
            onChange={(e) => updateField("serviceId", e.target.value)}
            className={inputClass(errors.serviceId)}
          >
            <option value="">Choose a service…</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ${s.price} ({s.durationMinutes} min)
              </option>
            ))}
          </select>
        </Field>

        {/* Stylist / Barber */}
        <Field label="Stylist / Barber" error={errors.barberId}>
          <select
            value={form.barberId}
            onChange={(e) => updateField("barberId", e.target.value)}
            className={inputClass(errors.barberId)}
          >
            <option value="">Choose a stylist or barber…</option>
            {availableBarbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.title}
              </option>
            ))}
          </select>
        </Field>

        {/* Date + Time */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Date" error={errors.date}>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              className={inputClass(errors.date)}
            />
          </Field>
          <Field label="Time" error={errors.time}>
            <select
              value={form.time}
              onChange={(e) => updateField("time", e.target.value)}
              disabled={availableTimes.length === 0}
              className={inputClass(errors.time)}
            >
              <option value="">
                {timeHint ? timeHint : "Choose a time…"}
              </option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Notes (optional) */}
        <Field label="Notes (optional)">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Anything we should know?"
            className={inputClass()}
          />
        </Field>

        {/* Live price summary */}
        {selectedService && (
          <div className="rounded-xl bg-brand-gold/10 p-4 text-sm font-medium text-brand-goldDark">
            {selectedService.name} · ${selectedService.price} ·{" "}
            {selectedService.durationMinutes} min
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Booking…" : "Confirm Booking"}
        </button>
      </form>
      </div>
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

// A labeled form field with an optional error message below it.
function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-500">{error}</span>}
    </label>
  );
}

// One row in the confirmation summary.
function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}

// Shared input styling; turns the border red when there's a validation error.
function inputClass(error) {
  return [
    "w-full rounded-lg border bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition",
    "focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "dark:bg-brand-charcoal dark:text-gray-100",
    error ? "border-red-400" : "border-gray-300 dark:border-gray-600",
  ].join(" ");
}
