import Link from "next/link";
import services from "@/data/services.json";
import barbers from "@/data/barbers.json";

// Homepage: a hero section, a few featured services, the barber team, and a
// closing call-to-action. All content is fully responsive and theme-aware.
export default function HomePage() {
  // Show only the "popular" services as the featured highlights.
  const featured = services.filter((s) => s.popular).slice(0, 3);

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-brand-charcoal text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="mb-3 font-semibold uppercase tracking-widest text-brand-gold">
              Est. 2024 · Downtown
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Sharp Cuts.
              <br />
              <span className="text-brand-gold">Classic Service.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-gray-300">
              Master barbers, modern style, and a clean chair waiting for you.
              Book your next cut online in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary">Book an Appointment</Link>
              <Link href="/services" className="btn-outline">View Services</Link>
            </div>
          </div>

          {/* Decorative stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "15+", label: "Years Experience" },
              { stat: "3", label: "Master Barbers" },
              { stat: "4.9★", label: "Average Rating" },
              { stat: "10k+", label: "Cuts & Counting" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-brand-slate p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-brand-gold">{item.stat}</div>
                <div className="mt-1 text-sm text-gray-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Featured Services ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="section-title">Most Popular Services</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            A few client favorites — see the full menu for everything we offer.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <div key={service.id} className="card flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-sm font-bold text-brand-goldDark">
                  ${service.price}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-300">
                {service.description}
              </p>
              <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                ⏱ {service.durationMinutes} min
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="btn-outline">See All Services & Pricing</Link>
        </div>
      </section>

      {/* ---------------- Meet the Barbers ---------------- */}
      <section className="bg-gray-50 py-16 dark:bg-brand-slate/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="section-title">Meet the Team</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              The hands behind every great cut.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <div key={barber.id} className="card text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={barber.photoUrl}
                  alt={barber.name}
                  className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-brand-gold/30"
                />
                <h3 className="mt-4 text-lg font-semibold">{barber.name}</h3>
                <p className="text-sm font-medium text-brand-goldDark">{barber.title}</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{barber.bio}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {barber.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-brand-charcoal dark:text-gray-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="section-title">Ready for a fresh look?</h2>
        <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-300">
          Pick your service, choose your barber, and lock in a time that works
          for you.
        </p>
        <div className="mt-8">
          <Link href="/booking" className="btn-primary">Book Now</Link>
        </div>
      </section>
    </div>
  );
}
