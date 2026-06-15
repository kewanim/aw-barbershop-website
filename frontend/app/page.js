import Link from "next/link";
import services from "@/data/services.json";
import barbers from "@/data/barbers.json";
import TibebBorder from "@/components/TibebBorder";
import Reveal from "@/components/Reveal";
import Carousel from "@/components/Carousel";

// Homepage — a clean, white, Apple-style layout: a centered hero, a smooth
// gallery carousel, then sections that fade up as you scroll. Ethiopian tibeb
// accents are kept as thin trim so the brand identity stays.

// Gallery images (placeholder stock — swap for the salon's real photos later).
const gallery = [
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1400&q=80", alt: "Barber giving a precision fade", caption: "Precision fades & classic cuts" },
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80", alt: "Stylist styling a client's hair", caption: "Women's cuts, styling & color" },
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80", alt: "Bright, modern salon interior", caption: "A clean, welcoming space" },
  { src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=1400&q=80", alt: "Beard grooming and trim", caption: "Beard trims & hot-towel shaves" },
  { src: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?auto=format&fit=crop&w=1400&q=80", alt: "A fresh, finished haircut", caption: "Looking sharp in Silver Spring" },
];

const highlights = [
  { stat: "Men & Women", label: "All hair types welcome" },
  { stat: "Walk-ins", label: "Welcome, subject to availability" },
  { stat: "Silver Spring", label: "908 Thayer Ave, MD" },
  { stat: "Book Online", label: "Reserve in seconds" },
];

export default function HomePage() {
  const featured = services.filter((s) => s.popular).slice(0, 3);

  return (
    <div className="bg-white dark:bg-brand-charcoal">
      {/* ---------------- Hero (white, centered) ---------------- */}
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-12 text-center sm:px-6">
        <p className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-brand-goldDark">
          <span className="inline-flex gap-1" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-gold" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-red" />
          </span>
          <span>እንኳን ደህና መጡ · Silver Spring, MD</span>
        </p>
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl dark:text-white">
          Where hair dreams
          <br />
          become reality
          <span className="mt-2 block text-brand-gold">for men &amp; women.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300">
          Step into a world of luxury and style in the heart of Silver Spring — a
          destination dedicated to perfecting your hair with precision, passion,
          and personalized care.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/booking" className="btn-primary">Book an Appointment</Link>
          <Link href="/services" className="btn-outline">View Services</Link>
        </div>
      </section>

      {/* ---------------- Gallery carousel ---------------- */}
      <Reveal className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <Carousel slides={gallery} />
      </Reveal>

      {/* ---------------- Highlights strip ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <Reveal key={item.label} delay={i * 80} className="text-center">
              <div className="text-xl font-bold text-brand-goldDark sm:text-2xl">{item.stat}</div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Featured Services ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="section-title">Most Popular Services</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            A few client favorites — see the full menu for everything we offer.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => (
            <Reveal key={service.id} delay={i * 100}>
              <div className="card flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-sm font-bold text-brand-goldDark">
                    ${service.price}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">⏱ {service.durationMinutes} min</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/services" className="btn-outline">See All Services & Pricing</Link>
        </Reveal>
      </section>

      {/* ---------------- Meet the Team (framed with tibeb) ---------------- */}
      <TibebBorder />
      <section className="bg-gray-50 py-16 dark:bg-brand-slate/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <h2 className="section-title">Meet the Team</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">The hands behind every great cut.</p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber, i) => (
              <Reveal key={barber.id} delay={i * 100}>
                <div className="card h-full text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={barber.photoUrl} alt={barber.name} className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-brand-gold/30" />
                  <h3 className="mt-4 text-lg font-semibold">{barber.name}</h3>
                  <p className="text-sm font-medium text-brand-goldDark">{barber.title}</p>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{barber.bio}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {barber.specialties.map((s) => (
                      <span key={s} className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-brand-charcoal dark:text-gray-200">{s}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <TibebBorder />

      {/* ---------------- Testimonials ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-12 text-center">
          <h2 className="section-title">What Clients Say</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Loved by the Silver Spring community.</p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { quote: "I love this place! The staff is incredible, and Joseph is an amazing hair stylist. Prices are affordable — one of the best places to get your hair done in the Silver Spring community.", name: "Monica B.", source: "Google Reviews" },
            { quote: "Excellent barbershop. Asmamaw is a great barber who takes his time, pays close attention to details. One of the best in Silver Spring!", name: "Christopher Harris", source: "Google Reviews" },
          ].map((review, i) => (
            <Reveal key={review.name} delay={i * 100}>
              <figure className="card flex h-full flex-col">
                <div className="text-brand-gold" aria-hidden="true">★★★★★</div>
                <blockquote className="mt-3 flex-1 text-gray-700 dark:text-gray-200">&ldquo;{review.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">
                  {review.name}
                  <span className="ml-2 font-normal text-gray-400">· {review.source}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Closing CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 text-center sm:px-6">
        <Reveal>
          <h2 className="section-title">Ready for a fresh look?</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-300">
            Pick your service, choose your stylist, and lock in a time that works for you.
          </p>
          <div className="mt-8">
            <Link href="/booking" className="btn-primary">Book Now</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
