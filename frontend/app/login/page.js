"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Staff login page. Posts credentials to /api/auth/login, which sets the
// session cookie on success. We then send the user to the admin dashboard.
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login failed.");
        return;
      }
      // Session cookie is set; go to the dashboard and refresh server state.
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-20 sm:px-6">
      <div className="text-center">
        <h1 className="section-title">Staff Login</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Sign in to manage appointments.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5" noValidate>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Username</span>
          <input
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="admin"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Demo credentials hint — remove this block before going live. */}
      <p className="mt-4 text-center text-xs text-gray-400">
        Demo logins: <code>admin / admin123</code> · <code>marcus / marcus123</code>
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/40 dark:border-gray-600 dark:bg-brand-charcoal dark:text-gray-100";
