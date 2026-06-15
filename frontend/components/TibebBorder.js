// TibebBorder — a decorative band inspired by Ethiopian "tibeb" (ጥበብ): the
// colorful woven geometric trim found on traditional habesha clothing.
//
// It renders a full-width, repeating SVG pattern strip used as a section
// divider and accent throughout the site. Colors echo the Ethiopian flag
// (green, gold, red). This is a plain (server-friendly) component — no hooks —
// so it can be dropped into any page or layout.
export default function TibebBorder({ className = "" }) {
  return (
    <svg
      className={`block w-full ${className}`}
      height="22"
      role="presentation"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* One repeating tile: a green ground with gold diamonds, red centers,
            red edge stripes, and small gold accents — a stylized tibeb motif. */}
        <pattern id="tibeb-pattern" width="40" height="22" patternUnits="userSpaceOnUse">
          <rect width="40" height="22" fill="#0a7b3e" />
          <rect width="40" height="3" fill="#c9111c" />
          <rect y="19" width="40" height="3" fill="#c9111c" />
          <path d="M10 4 L18 11 L10 18 L2 11 Z" fill="#f5c518" />
          <path d="M30 4 L38 11 L30 18 L22 11 Z" fill="#f5c518" />
          <path d="M10 7 L14 11 L10 15 L6 11 Z" fill="#c9111c" />
          <path d="M30 7 L34 11 L30 15 L26 11 Z" fill="#c9111c" />
          <rect x="19" y="10" width="2" height="2" fill="#f5c518" />
          <rect x="-1" y="10" width="2" height="2" fill="#f5c518" />
          <rect x="39" y="10" width="2" height="2" fill="#f5c518" />
        </pattern>
      </defs>
      <rect width="100%" height="22" fill="url(#tibeb-pattern)" />
    </svg>
  );
}
