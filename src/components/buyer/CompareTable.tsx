import React, { useMemo } from "react";
import { MapPin, Ruler, BedDouble, Bath, Car, IndianRupee } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { removeFromCompare } from "../../features/buyer/buyerSlice";

const CompareTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { compareList } = useAppSelector((state) => state.buyer);

  const metrics = useMemo(
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

  if (compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-8 py-16 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--b1)]">
          No properties selected for comparison
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          From any property card, use the compare action to build a side-by-side
          view of price, size, amenities and ROI potential.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
      <div className="border-b border-[var(--b2-soft)] bg-[var(--b2-soft)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--b1)]">
          Property comparison
        </h2>
        <p className="text-xs text-[var(--muted)]">
          Evaluate price, scale and livability across your shortlisted options.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs text-[var(--b1)]">
          <thead>
            <tr>
              <th className="w-40 border-b border-r border-[var(--b2-soft)] bg-[var(--b2-soft)] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                Metric
              </th>
              {compareList.map((p) => (
                <th
                  key={p._id}
                  className="min-w-[200px] border-b border-r border-[var(--b2-soft)] bg-[var(--b2-soft)] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[var(--b1)] line-clamp-2">
                        {p.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--muted)] line-clamp-1">
                        {p.address}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCompare(p._id))}
                      className="rounded-full bg-[var(--white)] px-2 py-1 text-[10px] text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
                    >
                      Remove
                    </button>
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
                <td className="sticky left-0 z-10 border-r border-[var(--b2-soft)] bg-[var(--b2-soft)] px-4 py-3 align-top">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--b1)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--b2-soft)] text-[var(--b1-mid)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{label}</span>
                  </div>
                </td>
                {compareList.map((p) => {
                  let value: React.ReactNode = "-";
                  if (key === "price") {
                    value =
                      p.price != null
                        ? `₹ ${p.price.toLocaleString("en-IN")}`
                        : "-";
                  } else if (key === "size") {
                    value =
                      p.size != null ? `${p.size.toLocaleString()} sq.ft` : "-";
                  } else if (key === "address") {
                    value = p.address ?? "-";
                  } else {
                    // beds, baths, parking as generic access
                    const v = (p as any)[key];
                    value = v ?? "-";
                  }

                  return (
                    <td
                      key={p._id}
                      className="border-r border-[var(--b2-soft)] px-4 py-3 align-top text-xs text-[var(--b1)]"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;

