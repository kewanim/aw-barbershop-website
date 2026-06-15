"use client";

import { useEffect, useState } from "react";

// Carousel — a smooth, auto-advancing image gallery with the Apple-style
// easing (cubic-bezier(0.16, 1, 0.3, 1)). Slides translate horizontally with a
// long, gentle transition. Auto-advances, pauses on hover, and offers arrows
// and dot indicators. Fully keyboard- and screen-reader-labelled.
//
// Props:
//   slides   — [{ src, alt, caption }]
//   interval — ms between auto-advances (default 5000)
export default function Carousel({ slides, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = (i) => setIndex((i + count) % count);

  // Auto-advance unless paused or there's only one slide.
  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((p) => (p + 1) % count), interval);
    return () => clearInterval(timer);
  }, [paused, count, interval]);

  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm dark:bg-brand-slate"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Salon gallery"
    >
      {/* Sliding track */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative aspect-[16/9] w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
            {slide.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-6 pb-14 pt-16">
                <p className="text-lg font-medium text-white sm:text-xl">{slide.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows — always visible on touch, hover-revealed on larger screens */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
