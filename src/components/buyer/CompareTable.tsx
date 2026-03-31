import React, { useMemo } from "react";
import {
  MapPin,
  Ruler,
  BedDouble,
  Bath,
  Car,
  IndianRupee,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { removeFromCompare } from "../../features/buyer/buyerSlice";
import { Button } from "@/components/common";

type ComparableMetricKey = "price" | "size" | "address" | "beds" | "baths" | "parking";

type MetricConfig = {
  key: ComparableMetricKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const CompareTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { compareList } = useAppSelector((state) => state.buyer);

  const metrics = useMemo<MetricConfig[]>(
    () => [
      { key: "price", label: "Price", icon: IndianRupee },
      { key: "size", label: "Land Size", icon: Ruler },
      { key: "address", label: "Location", icon: MapPin },
      { key: "beds", label: "Bedrooms", icon: BedDouble },
      { key: "baths", label: "Bathrooms", icon: Bath },
      { key: "parking", label: "Parking", icon: Car },
    ],
    []
  );

  const getMetricValue = (
    property: (typeof compareList)[number],
    key: ComparableMetricKey
  ): React.ReactNode => {
    switch (key) {
      case "price":
        return property.price != null
          ? `₹ ${property.price.toLocaleString("en-IN")}`
          : "-";
      case "size":
        return property.size != null
          ? `${property.size.toLocaleString()} sq.ft`
          : "-";
      case "address":
        return property.address ?? "-";
      case "beds":
        return property.beds ?? "-";
      case "baths":
        return property.baths ?? "-";
      case "parking":
        return property.parking ?? "-";
      default:
        return "-";
    }
  };

  if (compareList.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-[var(--b2-soft)] bg-gradient-to-b from-white to-[var(--b2-soft)]/15 px-6 py-14 text-center shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:px-8 sm:py-16">
        <h2 className="text-lg font-semibold text-[var(--b1)] sm:text-xl">
          No properties selected for comparison
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          From any property card, use the compare action to build a side-by-side
          view of price, size, amenities and ROI potential.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[var(--b2-soft)] bg-gradient-to-r from-[var(--b2-soft)]/70 via-[var(--b2-soft)]/35 to-white px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--b1)] sm:text-base">
            Property comparison
          </h2>
          <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--b1-mid)] ring-1 ring-[var(--b2-soft)]">
            {compareList.length} selected
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
          Evaluate price, scale and livability across your shortlisted options.
        </p>
      </div>

      <div className="space-y-3 p-3 sm:p-4 lg:hidden">
        {compareList.map((property) => (
          <article
            key={property._id}
            className="overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-white shadow-sm"
          >
            <header className="border-b border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--b1)] line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--muted)] line-clamp-1">
                    {property.address}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => dispatch(removeFromCompare(property._id))}
                  variant="ghost"
                  className="rounded-full px-2.5 py-1 text-[10px] text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
                >
                  Remove
                </Button>
              </div>
            </header>

            <div className="divide-y divide-[var(--b2-soft)]">
              {metrics.map(({ key, label, icon: Icon }) => (
                <div key={key} className="grid grid-cols-[auto,1fr] items-start gap-2 p-3">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--b1)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--b2-soft)] text-[var(--b1-mid)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{label}</span>
                  </div>
                  <p className="text-right text-xs font-medium text-[var(--b1)]">
                    {getMetricValue(property, key)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full text-left text-xs text-[var(--b1)]">
          <thead>
            <tr>
              <th className="w-44 border-b border-r border-[var(--b2-soft)] bg-[var(--b2-soft)]/55 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                Metric
              </th>

              {compareList.map((property) => (
                <th
                  key={property._id}
                  className="min-w-[240px] border-b border-r border-[var(--b2-soft)] bg-[var(--b2-soft)]/55 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--b1)] line-clamp-2">
                        {property.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)] line-clamp-1">
                        {property.address}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => dispatch(removeFromCompare(property._id))}
                      variant="ghost"
                      className="rounded-full px-2.5 py-1 text-[10px] text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
                    >
                      Remove
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {metrics.map(({ key, label, icon: Icon }) => (
              <tr
                key={key}
                className="border-t border-[var(--b2-soft)] bg-[var(--white)]"
              >
                <td className="sticky left-0 z-10 border-r border-[var(--b2-soft)] bg-[var(--b2-soft)]/45 px-4 py-3 align-top">
                  <div className="flex items-center gap-2 text-xs font-medium text-[var(--b1)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[var(--b1-mid)] ring-1 ring-[var(--b2-soft)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{label}</span>
                  </div>
                </td>

                {compareList.map((property) => (
                  <td
                    key={property._id}
                    className="border-r border-[var(--b2-soft)] px-4 py-3 align-top text-sm text-[var(--b1)]"
                  >
                    {getMetricValue(property, key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;