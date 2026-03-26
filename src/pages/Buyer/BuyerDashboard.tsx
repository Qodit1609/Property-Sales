import React, { useMemo, useState } from "react";
import { Search, TrendingUp, Sparkles } from "lucide-react";
import { useAppSelector } from "../../hooks/reduxHooks";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import PropertyCard from "../../components/Cards/PropertyCard";
import { Input, Button } from "@/components/common";

const trendingLocations = [
  "Indore Bypass",
  "Mhow Cantonment",
  "Rau Corridor",
  "Ujjain Road",
  "Airport Road",
];

const BuyerDashboard: React.FC = () => {
  const { data, loading } = useAppSelector((state) => state.properties);
  const [query, setQuery] = useState("");

  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const filtered = useMemo(() => {
    return data.filter((p) => {
      if (p.status !== "approved") return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.address.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (maxPrice != null && p.price > maxPrice) return false;
      return true;
    });
  }, [data, query, maxPrice]);

  const shimmerCards = Array.from({ length: 6 });

  return (
    <BuyerLayout>
      <div className="space-y-6">
        <section className="rounded-3xl border border-[var(--b2)] bg-[var(--b2-soft)]/70 p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-1 rounded-full bg-[var(--white)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--b1-mid)] ring-1 ring-[var(--b2)]">
                <Sparkles className="h-3 w-3" />
                Curated inventory
              </p>
              <h1 className="mt-3 text-xl font-semibold text-[var(--b1)] md:text-2xl">
                Discover verified land, farmhouse & agri resort deals
              </h1>
              <p className="mt-1 text-[11px] text-[var(--muted)] md:text-xs">
                Search like Amazon, experience like Airbnb. Filters, wishlist,
                compare and cart built for serious buyers.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2.3fr)_minmax(0,1.2fr)]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--b1-mid)]" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by village, highway, landmark or project name"
                className="w-full rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-9 py-2.5 text-xs text-[var(--b1)] placeholder:text-[var(--muted)]/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                  Budget ceiling
                </p>
                <Input
                  type="range"
                  min={1000000}
                  max={100000000}
                  step={500000}
                  value={maxPrice ?? 100000000}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-1 w-full accent-emerald-400"
                />
                <p className="mt-0.5 text-[11px] text-[var(--b1-mid)]">
                  Up to ₹{" "}
                  {(maxPrice ?? 100000000).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-[var(--white)] px-2.5 py-1 text-[10px] text-[var(--b1-mid)] ring-1 ring-[var(--b2)]">
              <TrendingUp className="h-3 w-3" />
              Trending corridors:
            </div>
            {trendingLocations.map((loc) => (
              <Button
                key={loc}
                type="button"
                onClick={() => setQuery(loc)}
                className="rounded-full bg-[var(--b1)] px-2.5 py-1 text-[10px] text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)] hover:text-[var(--b1)] "
              >
                {loc}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              Matching properties
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              {filtered.length} of {data.length} listings shown
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shimmerCards.map((_, idx) => (
                <div
                  key={idx}
                  className="h-[320px] animate-pulse rounded-2xl bg-[var(--b2-soft)]"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </section>
      </div>
    </BuyerLayout>
  );
};

export default BuyerDashboard;