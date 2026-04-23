import React, { useMemo } from "react";
import { LayoutList } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  clearCompare,
  removeFromCompare,
  setCompareHighlightDiff,
} from "../../features/buyer/buyerSlice";
import { useBuyerResolvedProperties } from "../../hooks/useBuyerResolvedProperties";
import { Button } from "@/components/common";
import type { Property } from "../../features/properties/propertyType";
import {
  COMPARE_DISPLAY_ROWS_FLAT,
  COMPARE_DISPLAY_SECTIONS,
  resolveCompareRowValue,
} from "../../utils/compareDisplayFields";
import {
  diffHighlightMask,
  flattenPropertySpecs,
} from "../../utils/comparePropertySpecs";

const CompareTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const compareIds = useAppSelector((s) => s.buyer.compareIds);
  const highlightDiff = useAppSelector((s) => s.buyer.compareHighlightDiff);
  const { properties: compareList, loading } =
    useBuyerResolvedProperties(compareIds);

  const flats = useMemo(
    () => compareList.map((p: Property) => flattenPropertySpecs(p)),
    [compareList]
  );

  const highlightMasks = useMemo(() => {
    const out: Record<string, boolean[]> = {};
    if (!highlightDiff || flats.length < 2) {
      return out;
    }
    for (const row of COMPARE_DISPLAY_ROWS_FLAT) {
      const vals = compareList.map((property, i) =>
        resolveCompareRowValue(row, property, flats[i])
      );
      out[row.key] = diffHighlightMask(vals);
    }
    return out;
  }, [flats, compareList, highlightDiff]);

  if (compareIds.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-[var(--b2-soft)] bg-gradient-to-b from-white to-[var(--b2-soft)]/15 px-6 py-14 text-center shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:px-8 sm:py-16">
        <h2 className="text-lg font-semibold text-[var(--b1)] sm:text-xl">
          No properties selected for comparison
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          From any property card, use the compare action to build a side-by-side
          view of price, location, type, size, and more.
        </p>
        <Link
          to="/buyer/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--b1)] px-5 py-2 text-sm font-medium text-[var(--fg)] transition hover:opacity-95"
        >
          Browse properties
        </Link>
      </div>
    );
  }

  if (loading && compareList.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-8 text-center text-sm text-[var(--muted)]">
        Loading comparison…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[var(--b2-soft)] bg-gradient-to-r from-[var(--b2-soft)]/70 via-[var(--b2-soft)]/35 to-white px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-[var(--b1)] sm:text-base">
            Property comparison
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--b1-mid)] ring-1 ring-[var(--b2-soft)]">
              {compareList.length} / 3
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => dispatch(setCompareHighlightDiff(!highlightDiff))}
              className="rounded-full text-[11px]"
            >
              {highlightDiff ? "Show all equal" : "Highlight differences"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearCompare())}
              className="rounded-full text-[11px] text-[var(--error)]"
            >
              Clear all
            </Button>
          </div>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
          Selected fields are compared side by side. Toggle highlighting to
          emphasize values that differ.
        </p>
      </div>

      <div className="space-y-3 p-3 sm:p-4 lg:hidden">
        {compareList.map((property, pi) => (
          <article
            key={property._id}
            className="overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <header className="border-b border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-snug text-[var(--b1)] line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--muted)] line-clamp-1">
                    {property.locationText || property.address || "\u2014"}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => dispatch(removeFromCompare(property._id))}
                  variant="ghost"
                  className="shrink-0 rounded-full px-2.5 py-1 text-[10px] text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
                >
                  Remove
                </Button>
              </div>
            </header>

            <div className="divide-y divide-[var(--b2-soft)]">
              {COMPARE_DISPLAY_SECTIONS.map((section) => (
                <div key={section.title}>
                  <div className="bg-[var(--b2-soft)]/35 px-3 py-2">
                    <p className="text-[11px] font-semibold tracking-tight text-[var(--b1)]">
                      {section.title}
                    </p>
                  </div>
                  {section.rows.map((row) => {
                    const flat = flats[pi];
                    const val = resolveCompareRowValue(row, property, flat);
                    const mask = highlightMasks[row.key];
                    const cellHighlight =
                      highlightDiff && mask ? mask[pi] : false;

                    return (
                      <div
                        key={row.key}
                        className="grid min-h-[3rem] grid-cols-[auto,1fr] items-center gap-2 px-3 py-3 transition-colors hover:bg-[var(--b2-soft)]/25"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--b1)]">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--b2-soft)] text-[var(--b1-mid)]">
                            <LayoutList className="h-3.5 w-3.5" />
                          </span>
                          <span className="leading-tight">{row.label}</span>
                        </div>
                        <p
                          className={`text-right text-xs font-medium leading-relaxed text-[var(--b1)] ${
                            cellHighlight
                              ? "rounded-md bg-amber-50 px-1.5 py-0.5 ring-1 ring-amber-200/80"
                              : ""
                          }`}
                        >
                          {val}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full table-fixed border-collapse text-left text-xs text-[var(--b1)]">
          <thead>
            <tr className="border-b border-[var(--b2-soft)]">
              <th className="sticky left-0 z-30 w-[13rem] min-w-[13rem] max-w-[15rem] border-r border-[var(--b2-soft)] bg-[var(--b2-soft)]/70 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)] shadow-[4px_0_12px_-4px_rgba(0,0,0,0.08)]">
                Specification
              </th>

              {compareList.map((property) => (
                <th
                  key={property._id}
                  className="min-w-[220px] max-w-[280px] border-r border-[var(--b2-soft)] bg-[var(--b2-soft)]/55 px-4 py-3.5 align-top last:border-r-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-[var(--b1)] line-clamp-2">
                        {property.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)] line-clamp-2">
                        {property.locationText || property.address || "\u2014"}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => dispatch(removeFromCompare(property._id))}
                      variant="ghost"
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] text-[var(--muted)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
                    >
                      Remove
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {COMPARE_DISPLAY_SECTIONS.map((section) => (
              <React.Fragment key={section.title}>
                <tr className="border-t border-[var(--b2-soft)] bg-[var(--b2-soft)]/40">
                  <td
                    colSpan={compareList.length + 1}
                    className="px-4 py-2.5 text-[11px] font-semibold tracking-tight text-[var(--b1)]"
                  >
                    {section.title}
                  </td>
                </tr>
                {section.rows.map((row) => {
                  const mask = highlightMasks[row.key];

                  return (
                    <tr
                      key={row.key}
                      className="group border-t border-[var(--b2-soft)] bg-[var(--white)] transition-colors hover:bg-[var(--b2-soft)]/20"
                    >
                      <td className="sticky left-0 z-20 w-[13rem] min-w-[13rem] max-w-[15rem] border-r border-[var(--b2-soft)] bg-[var(--b2-soft)]/50 px-4 py-3.5 align-middle shadow-[4px_0_12px_-4px_rgba(0,0,0,0.06)] transition-colors group-hover:bg-[var(--b2-soft)]/65">
                        <div className="flex min-h-[2.75rem] items-center gap-2 text-xs font-medium leading-snug text-[var(--b1)]">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[var(--b1-mid)] ring-1 ring-[var(--b2-soft)]">
                            <LayoutList className="h-3.5 w-3.5" />
                          </span>
                          <span>{row.label}</span>
                        </div>
                      </td>

                      {compareList.map((property, colIdx) => {
                        const flat = flats[colIdx];
                        const val = resolveCompareRowValue(
                          row,
                          property,
                          flat
                        );
                        const cellHighlight =
                          highlightDiff && mask ? mask[colIdx] : false;

                        return (
                          <td
                            key={property._id}
                            className={`border-r border-[var(--b2-soft)] px-4 py-3.5 align-middle text-sm leading-relaxed text-[var(--b1)] transition-colors last:border-r-0 ${
                              cellHighlight
                                ? "bg-amber-50/95 ring-1 ring-inset ring-amber-100/90"
                                : ""
                            }`}
                          >
                            <div className="flex min-h-[2.75rem] items-center justify-end text-right">
                              {val}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;
