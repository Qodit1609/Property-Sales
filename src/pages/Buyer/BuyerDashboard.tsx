import React, { useMemo, useState } from "react";
import { Search, TrendingUp, Sparkles, Heart, Scale, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import PropertyCard from "../../components/Cards/PropertyCard";
import RecentlyViewed from "../../components/buyer/RecentlyViewed";
import PropertyRecommendations from "../../components/buyer/PropertyRecommendations";
import { Input, Button } from "@/components/common";
import { addSavedSearch, removeSavedSearch } from "../../features/buyer/buyerSlice";

const BuyerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.properties);
  const wishlistIds = useAppSelector((s) => s.buyer.wishlistIds);
  const compareIds = useAppSelector((s) => s.buyer.compareIds);
  const cartIds = useAppSelector((s) => s.buyer.cartIds);
  const activity = useAppSelector((s) => s.buyer.activity);
  const savedSearches = useAppSelector((s) => s.buyer.savedSearches);

  const [query, setQuery] = useState("");
  const [saveLabel, setSaveLabel] = useState("");

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
      return true;
    });
  }, [data, query]);

  const shimmerCards = Array.from({ length: 6 });

  const trendingLocations = [
    "Indore Bypass",
    "Mhow Cantonment",
    "Rau Corridor",
    "Ujjain Road",
    "Airport Road",
  ];

  return (
    <BuyerLayout>
      <div className="space-y-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Wishlist
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Heart className="h-5 w-5 text-[var(--b1-mid)]" />
              <span className="text-2xl font-bold text-[var(--b1)]">{wishlistIds.length}</span>
            </div>
            <Link
              to="/buyer/wishlist"
              className="mt-2 inline-block text-[11px] font-medium text-[var(--b1-mid)] hover:text-[var(--b1)]"
            >
              View list →
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Compare
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Scale className="h-5 w-5 text-[var(--b1-mid)]" />
              <span className="text-2xl font-bold text-[var(--b1)]">{compareIds.length}</span>
            </div>
            <Link
              to="/buyer/compare"
              className="mt-2 inline-block text-[11px] font-medium text-[var(--b1-mid)] hover:text-[var(--b1)]"
            >
              Open table →
            </Link>
          </div>
          <div className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              Cart
            </p>
            <div className="mt-1 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[var(--b1-mid)]" />
              <span className="text-2xl font-bold text-[var(--b1)]">{cartIds.length}</span>
            </div>
            <Link
              to="/buyer/cart"
              className="mt-2 inline-block text-[11px] font-medium text-[var(--b1-mid)] hover:text-[var(--b1)]"
            >
              Go to cart →
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--b2)] bg-[var(--b2-soft)]/70 p-4 shadow-sm">
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
                Search, shortlist, compare and track visits — built for serious buyers.
              </p>
            </div>
          </div>

          <div className="mt-4">
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
            <div className="mt-2 flex flex-wrap items-end gap-2">
              <Input
                type="text"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                placeholder="Label for saved search (optional)"
                className="max-w-xs flex-1 rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-xs"
              />
              <Button
                type="button"
                onClick={() => {
                  dispatch(
                    addSavedSearch({
                      label: saveLabel.trim() || query.trim() || "Saved search",
                      filter: { query, pathname: "/buyer/dashboard" },
                    })
                  );
                  setSaveLabel("");
                }}
                className="rounded-full bg-[var(--b1)] px-4 py-2 text-xs text-[var(--fg)]"
              >
                Save search
              </Button>
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
                className="rounded-full border border-transparent bg-[var(--b1)] px-2.5 py-1 text-[10px] text-[var(--white)] transition-colors hover:border-[var(--b1)] hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]"
              >
                {loc}
              </Button>
            ))}
          </div>
        </section>

        {savedSearches.length > 0 && (
          <section className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--b1)]">Saved searches</h2>
            <ul className="mt-3 space-y-2">
              {savedSearches.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--b2-soft)]/50 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-[var(--b1)]">{s.label}</p>
                    <p className="text-[10px] text-[var(--muted)]">
                      {String(s.filter.query ?? "")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-2 py-1 text-[10px]"
                      onClick={() => {
                        const q = s.filter.query;
                        if (typeof q === "string") setQuery(q);
                      }}
                    >
                      Reapply
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-full px-2 py-1 text-[10px] text-[var(--error)]"
                      onClick={() => dispatch(removeSavedSearch(s.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activity.length > 0 && (
          <section className="rounded-2xl border border-[var(--b2-soft)] bg-[var(--white)] p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--b1)]">Recent activity</h2>
            <ul className="mt-3 space-y-2 text-xs text-[var(--muted)]">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex justify-between gap-2 border-b border-[var(--b2-soft)]/80 pb-2 last:border-0">
                  <span className="text-[var(--b1)]">{a.title}</span>
                  <span className="shrink-0 uppercase tracking-wide text-[10px]">{a.type}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/buyer/activity"
              className="mt-3 inline-block text-[11px] font-medium text-[var(--b1-mid)] hover:text-[var(--b1)]"
            >
              Full history →
            </Link>
          </section>
        )}

        <RecentlyViewed />

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

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            Recommendations
          </h2>
          <PropertyRecommendations />
        </section>
      </div>
    </BuyerLayout>
  );
};

export default BuyerDashboard;
