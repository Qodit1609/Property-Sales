import React from "react";
import PropertyFilterCard from "../../components/Propertycard/PropertyFilterCard";
import PropertyCard from "../../components/Crads/PropertyCard";
import NavbarHeaderImage from "../../components/NavbarHeaderImage/NavbarHeaderImage";
import { properties } from "../../components/Data/properties";

const Farmhouse: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarHeaderImage />
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-1 lg:order-none">
            <div className="lg:sticky lg:top-24">
              <PropertyFilterCard />
            </div>
          </div>
          <div
            className="
              lg:col-span-3
              order-2
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-y-6
              gap-x-4
              lg:pl-6
              lg:border-l
              lg:border-gray-300
            "
          >
            {properties.map((property) => (
               <PropertyCard property={property} />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Farmhouse;
