import { useEffect } from "react";
import PropertyCard, { PropertyCardSkeleton } from "../Cards/PropertyCard";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchProperties } from "../../features/properties/propertySlice";

const PropertyList = () => {
  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector(
    (state) => state.properties
  );
  const properties = Array.isArray(data) ? data : [];

  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (error) {
    return (
      <p className="text-center pt-16 text-[var(--error)]">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-16">

      {/* Heading */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4">
        <div className="w-12 sm:w-28 h-[1px] bg-[var(--b1-mid)]/40" />
        <p className="text-[var(--b1-mid)] font-medium text-xs sm:text-base tracking-widest">
          FEATURED LISTINGS
        </p>
        <div className="w-12 sm:w-28 h-[1px] bg-[var(--b1-mid)]/40" />
      </div>

      <p className="max-w-3xl mx-auto text-[var(--b1)]/70 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-12 text-center px-2">
        Discover exclusive properties in prime demand areas.
        Crafted for superior living and lifestyle excellence.
        Ensuring high returns and dependable investment growth.
      </p>

      <div className="relative">
        <div
          className="
            flex gap-4 sm:gap-6 overflow-x-auto pb-4
            snap-x snap-mandatory scroll-smooth
            [scrollbar-width:thin]
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-[var(--b2-soft)]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[var(--b1-mid)]/50
            hover:[&::-webkit-scrollbar-thumb]:bg-[var(--b1-mid)]/80
          "
          aria-label="Property listings horizontal scroller"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="
                    snap-start shrink-0
                    w-[calc(100%-1.5rem)]
                    sm:w-[calc((100%-1.5rem)/2)]
                    lg:w-[calc((100%-3rem)/3)]
                    xl:w-[calc((100%-4.5rem)/4)]
                  "
                >
                  <PropertyCardSkeleton />
                </div>
              ))
            : properties.map((property) => (
                <div
                  key={property._id}
                  className="
                    snap-start shrink-0
                    w-[calc(100%-1.5rem)]
                    sm:w-[calc((100%-1.5rem)/2)]
                    lg:w-[calc((100%-3rem)/3)]
                    xl:w-[calc((100%-4.5rem)/4)]
                  "
                >
                  <PropertyCard property={property} />
                </div>
              ))}
        </div>
      </div>
      {!loading && !error && properties.length === 0 && (
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          No properties found right now. Please try again shortly.
        </p>
      )}
    </div>
  );
};

export default PropertyList;