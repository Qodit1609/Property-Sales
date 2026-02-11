import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "../Crads/PropertyCard";

// ⭐ Redux imports (from OLD file)
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchProperties } from "../../features/properties/propertySlice";

const PropertyList = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector(
    (state) => state.properties
  );

  // ⭐ API call (same as OLD)
  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 10 }));
  }, [dispatch]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  // ⭐ Loading & Error (logic from OLD, UI minimal)
  if (loading) {
    return (
      <p className="text-center pt-16 text-[var(--b1-mid)]">
        Loading properties...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center pt-16 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-16">
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
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-[var(--white)] shadow-md p-2 rounded-full hover:bg-[var(--b2-soft)]"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={scrollRight}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-[var(--white)] shadow-md p-2 rounded-full hover:bg-[var(--b2-soft)]"
        >
          <ChevronRight size={22} />
        </button>

        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar touch-pan-x px-1"
        >
          {data.map((property) => (
            <div
              key={property._id}
              className="min-w-[240px] sm:min-w-[280px] md:min-w-[300px]"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
