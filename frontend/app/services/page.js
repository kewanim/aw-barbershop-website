import Link from "next/link";
import services from "@/data/services.json";
import PageHeader from "@/components/PageHeader";

// Services menu page. Groups all services by category and lists price +
// duration for each. Fully responsive grid, theme-aware styling.
export const metadata = {
  title: "Services & Pricing — AW Beauty Salon",
};

export default function ServicesPage() {
  // Group services by their category so we can render section headings.
  const categories = services.reduce((acc, service) => {
    (acc[service.category] = acc[service.category] || []).push(service);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Services & Pricing"
        subtitle="Transparent pricing, no surprises. Every service includes a wash and a clean finish."
      />

      {/* One section per category */}
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-14 sm:px-6">
        {Object.entries(categories).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-5 border-b border-gray-200 pb-2 text-2xl font-bold dark:border-gray-700">
              {category}
            </h2>
            <ul className="space-y-4">
              {items.map((service) => (
                <li
                  key={service.id}
                  className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      {service.popular && (
                        <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-xs font-bold text-brand-goldDark">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      ⏱ {service.durationMinutes} minutes
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className="text-2xl font-bold text-brand-goldDark">
                      ${service.price}
                    </span>
                    <Link
                      href={`/booking?service=${service.id}`}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Book
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
