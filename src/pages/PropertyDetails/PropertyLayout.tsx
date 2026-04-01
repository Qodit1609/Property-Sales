
import React, { useState } from "react";
import NavbarHeaderImage from "../../components/NavbarHeaderImage/NavbarHeaderImage";
import PropertyFilterCard from "../../components/Propertycard/PropertyFilterCard";
import type { Property } from "../../features/properties/propertyType";

interface PropertyLayoutProps {
  allProperties: Property[];                          // full list for this page
  children: (filtered: Property[]) => React.ReactNode; // render-prop: receives filtered list
}

const PropertyLayout: React.FC<PropertyLayoutProps> = ({ allProperties, children }) => {
  const [filtered, setFiltered] = useState<Property[]>(allProperties);

  return (
    <div className="min-h-screen bg-[var(--warning-bg)]">
      <NavbarHeaderImage />

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">

          {/* Filter sidebar */}
          <div className="order-1 w-full min-w-0 lg:order-none lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <PropertyFilterCard
                properties={allProperties}
                onFiltered={setFiltered}
              />
            </div>
          </div>

          {/* Cards grid: align-content start so rows never stretch to fill a tall sidebar column */}
          <div className="order-2 grid w-full min-w-0 grid-cols-1 content-start gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 lg:col-span-3 lg:pl-6 lg:border-l lg:border-gray-300">
            {children(filtered)}
          </div>

        </div>
      </section>
    </div>
  );
};

export default PropertyLayout;