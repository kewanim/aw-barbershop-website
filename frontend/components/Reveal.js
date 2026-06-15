"use client";

import { useEffect, useRef, useState } from "react";

// Reveal — wraps content and fades it up into view the first time it scrolls
// onto screen, using an IntersectionObserver. Lightweight (no library) and
// respects prefers-reduced-motion via the .reveal CSS in globals.css.
//
// Props:
//   delay  — ms to stagger the animation (great for grids of cards)
//   as     — the element/tag to render (default "div")
export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the browser can't observe (very old) just show it.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target); // reveal once, then stop watching
          }
        });
      },
      // Trigger a little before the element is fully in view.
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
