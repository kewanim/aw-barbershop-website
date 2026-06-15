import TibebBorder from "@/components/TibebBorder";

// A full-width page header on a warm cream (habesha) band, finished with the
// Ethiopian tibeb trim along the bottom edge. The TOP frame is provided by the
// site-wide tibeb strip that already sits directly under the navbar (see
// app/layout.js), so the cream header ends up framed top and bottom.
export default function PageHeader({ title, subtitle }) {
  return (
    <header>
      <div className="bg-brand-cream py-10 text-center dark:bg-brand-slate/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="section-title">{title}</h1>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <TibebBorder />
    </header>
  );
}
