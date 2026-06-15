import Link from "next/link";

// Site footer with contact details, hours, and quick links.
// Rendered on every page via the root layout.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-brand-slate">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        {/* Brand + tagline */}
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-brand-gold">✂</span>
            <span>AW Barbershop</span>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Sharp cuts and classic service. Walk in for a trim, or book online in
            seconds.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li><Link href="/services" className="hover:text-brand-gold">Services & Pricing</Link></li>
            <li><Link href="/booking" className="hover:text-brand-gold">Book an Appointment</Link></li>
            <li><Link href="/admin" className="hover:text-brand-gold">Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact + hours */}
        <div>
          <h3 className="font-semibold">Visit Us</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>123 Main Street, Downtown</li>
            <li>(555) 123-4567</li>
            <li>Mon–Sat: 9:00 AM – 7:00 PM</li>
            <li>Sun: Closed</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 dark:border-gray-700">
        © {year} AW Barbershop. All rights reserved.
      </div>
    </footer>
  );
}
