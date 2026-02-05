import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";
import { properties } from "./Properties";

const PropertySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showAll) return;

    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    }, 15);

    return () => clearInterval(interval);
  }, [showAll]);

  return (
    <section className="w-full bg-[#FFFBE6] pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <p className="text-sm text-[#347928]">
            Featured Property
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Recommended Properties for You
          </h2>
        </div>

        {!showAll ? (
          <div
            ref={scrollRef}
            className="flex items-start gap-6 overflow-x-auto no-scrollbar"
          >
            {properties.map((item) => (
              <div
                key={item.id}
                className="w-[340px] flex-shrink-0"
              >
                <PropertyCard property={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="bg-[#FCCD2A] text-[#347928] font-semibold px-6 py-3 rounded-lg w-full sm:w-auto hover:brightness-95 transition"
            >
              Show all Property
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="bg-[#C0EBA6] text-[#347928] font-semibold px-6 py-3 rounded-lg w-full sm:w-auto hover:brightness-95 transition"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertySection;
