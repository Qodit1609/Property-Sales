import React from "react";
import NavbarHeaderImage from "../../components/NavbarHeaderImage/NavbarHeaderImage";
import PropertyFilterCard from "../../components/Propertycard/PropertyFilterCard";


interface PropertyLayoutProps {
  children: React.ReactNode;
}

const PropertyLayout: React.FC<PropertyLayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Fixed / Common Header */}
      <NavbarHeaderImage />

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Fixed / Common Filter */}
          <div className="lg:col-span-1 order-1 lg:order-none">
            <div className="lg:sticky lg:top-24">
              <PropertyFilterCard />
            </div>
          </div>

          {/* Dynamic Page Content */}
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
            {children}
          </div>

        </div>
      </section>
    </div>
  );
};

export default PropertyLayout;
