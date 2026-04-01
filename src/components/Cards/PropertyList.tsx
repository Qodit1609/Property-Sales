import PropertyCard, { PropertyCardSkeleton } from "../Cards/PropertyCard";

// Redux
import { useAppSelector } from "../../hooks/reduxHooks";
import {
  selectMediaError,
  selectMediaLoading,
  selectPropertyImagesMap,
} from "../../features/media/mediaSelectors";
import { useHomeFilterOptional } from "../Home/homeFilterContext";

const PropertyList = () => {
  const { data, loading, error } = useAppSelector(
    (state) => state.properties
  );
  const homeFilter = useHomeFilterOptional();
  const rawList = Array.isArray(data) ? data : [];
  const properties = homeFilter
    ? homeFilter.getFilteredProperties(rawList)
    : rawList;
  const isHomeFiltered = Boolean(homeFilter?.appliedCriteria);
  const propertyImagesMap = useAppSelector(selectPropertyImagesMap);
  const mediaLoading = useAppSelector(selectMediaLoading);
  const mediaError = useAppSelector(selectMediaError);

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

      {mediaError && (
        <p className="mb-4 text-center text-xs text-[var(--muted)]" role="status">
          Gallery images could not be refreshed; showing listing images when available.
        </p>
      )}

      {/* Width calcs must match gap: gap-4=1rem, sm:gap-6=1.5rem, lg+:gap-8=2rem (3 gaps for 4 cols = 6rem). */}
      <div className="relative">
        <div
          className="
            flex items-stretch gap-4 sm:gap-6 lg:gap-8
            overflow-x-auto
            pt-3 pb-4 sm:pt-4 sm:pb-5
            snap-x snap-mandatory scroll-smooth
            scroll-pt-3 sm:scroll-pt-4
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
                    flex snap-start shrink-0 min-w-0
                    w-[calc(100%-1rem)]
                    sm:w-[calc((100%-1.5rem)/2)]
                    lg:w-[calc((100%-4rem)/3)]
                    xl:w-[calc((100%-6rem)/4)]
                  "
                >
                  <PropertyCardSkeleton />
                </div>
              ))
            : properties.map((property) => (
                <div
                  key={property._id}
                  className="
                    flex snap-start shrink-0 min-w-0
                    w-[calc(100%-1rem)]
                    sm:w-[calc((100%-1.5rem)/2)]
                    lg:w-[calc((100%-4rem)/3)]
                    xl:w-[calc((100%-6rem)/4)]
                  "
                >
                  <PropertyCard
                    property={property}
                    propertyImagesMap={propertyImagesMap}
                    mediaLoading={mediaLoading}
                  />
                </div>
              ))}
        </div>
      </div>
      {!loading && !error && properties.length === 0 && (
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {isHomeFiltered
            ? "No properties found"
            : "No properties found right now. Please try again shortly."}
        </p>
      )}
    </div>
  );
};

export default PropertyList;