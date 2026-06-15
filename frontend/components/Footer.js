import Link from "next/link";
import TibebBorder from "@/components/TibebBorder";

// Site footer with contact details, hours, and quick links.
// Rendered on every page via the root layout.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-brand-slate">
      {/* Tibeb trim along the top edge of the footer. */}
      <TibebBorder />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        {/* Brand + tagline */}
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-brand-gold">✂</span>
            <span>AW Beauty Salon</span>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Where hair dreams become reality for both men and women. Walk in, or
            book online in seconds.
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <a href="https://instagram.com/aw_beauty_salon" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-gold dark:text-gray-300">
              Instagram
            </a>
            <a href="https://www.facebook.com/share/WoEkSNfq1nLyyyM9/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-gold dark:text-gray-300">
              Facebook
            </a>
          </div>
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
            <li>908 Thayer Ave, Silver Spring, MD</li>
            <li>
              <a href="tel:+13015888882" className="hover:text-brand-gold">(301) 588-8882</a>
            </li>
            {/* TODO: confirm real business hours with the client */}
            <li className="text-gray-400">Hours: please call to confirm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 dark:border-gray-700">
        © {year} AW Beauty Salon · Silver Spring, MD. All rights reserved.
      </div>
    </footer>
  );
}
