import { useEffect, useRef, useState } from "react";
import PropertyCard from "../Cards/PropertyCard";
import { properties } from "../Data/properties";
import { Button } from "@/components/common";
import { useTranslation } from "react-i18next";

const PropertySection = () => {
  const { t } = useTranslation();
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
    <section className="w-full bg-[var(--b2-soft)] pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <p className="text-sm text-[var(--b1-mid)] font-sans">
            {t("propertySection.featuredProperty")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--b1)] font-serif">
            {t("propertySection.recommendedProperties")}
          </h2>
        </div>

        {!showAll ? (
          <div
            ref={scrollRef}
            className="flex items-start gap-6 overflow-x-auto no-scrollbar"
          >
            {properties.map((item) => (
              <div key={item._id} className="w-[340px] flex-shrink-0">
                <PropertyCard property={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((item) => (
              <PropertyCard key={item._id} property={item} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          {!showAll ? (
            <Button
              onClick={() => setShowAll(true)}
              className="
                bg-[var(--b2)]
                text-[var(--b1)]
                font-semibold font-sans
                px-6 py-3 rounded-lg
                w-full sm:w-auto
                hover:bg-[var(--b1-mid)] hover:text-[var(--fg)]
                transition
              "
            >
              {t("propertySection.showAllProperties")}
            </Button>
          ) : (
            <Button
              onClick={() => setShowAll(false)}
              className="
                bg-[var(--b2-soft)]
                text-[var(--b1)]
                font-semibold font-sans
                px-6 py-3 rounded-lg
                w-full sm:w-auto
                hover:bg-[var(--b1-mid)] hover:text-[var(--fg)]
                transition
              "
            >
              {t("propertySection.close")}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertySection;