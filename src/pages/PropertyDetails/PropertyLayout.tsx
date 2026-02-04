// import React from "react";
// import NavbarHeaderImage from "../../components/NavbarHeaderImage/NavbarHeaderImage";
// import PropertyFilterCard from "../../components/Propertycard/PropertyFilterCard";


// interface PropertyLayoutProps {
//   children: React.ReactNode;
// }

// const PropertyLayout: React.FC<PropertyLayoutProps> = ({ children }) => {
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Fixed / Common Header */}
//       <NavbarHeaderImage />

//       <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
//           {/* Fixed / Common Filter */}
//           <div className="lg:col-span-1 order-1 lg:order-none">
//             <div className="lg:sticky lg:top-24">
//               <PropertyFilterCard />
//             </div>
//           </div>

//           {/* Dynamic Page Content */}
//           <div
//             className="
//               lg:col-span-3
//               order-2
//               grid
//               grid-cols-1
//               sm:grid-cols-2
//               gap-y-6
//               gap-x-4
//               lg:pl-6
//               lg:border-l
//               lg:border-gray-300
//             "
//           >
//             {children}
//           </div>

//         </div>
//       </section>
//     </div>
//   );
// };

// export default PropertyLayout;

import React, { useState } from "react";
import NavbarHeaderImage from "../../components/NavbarHeaderImage/NavbarHeaderImage";
import PropertyFilterCard from "../../components/Propertycard/PropertyFilterCard";
import type { Property } from "../../components/Data/properties";

interface PropertyLayoutProps {
  allProperties: Property[];                          // full list for this page
  children: (filtered: Property[]) => React.ReactNode; // render-prop: receives filtered list
}

const PropertyLayout: React.FC<PropertyLayoutProps> = ({ allProperties, children }) => {
  const [filtered, setFiltered] = useState<Property[]>(allProperties);

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarHeaderImage />

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Filter sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-none">
            <div className="lg:sticky lg:top-24">
              <PropertyFilterCard
                properties={allProperties}
                onFiltered={setFiltered}
              />
            </div>
          </div>

          {/* Cards grid – children is a function now */}
          <div className="lg:col-span-3 order-2 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 lg:pl-6 lg:border-l lg:border-gray-300">
            {children(filtered)}
          </div>

        </div>
      </section>
    </div>
  );
};

export default PropertyLayout;