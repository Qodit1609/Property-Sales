// import React from "react";
// import PropertyCard from "../../components/Crads/PropertyCard";
// import { properties } from "../../components/Data/properties";
// import PropertyLayout from "../PropertyDetails/PropertyLayout";

// const Farmhouse: React.FC = () => {
//   return (
//     <PropertyLayout>
//       {properties.map((property) => (
//         <PropertyCard key={property.id} property={property} />
//       ))}
//     </PropertyLayout>
//   );
// };

// export default Farmhouse;
import React from "react";
import PropertyCard from "../../components/Crads/PropertyCard";
import { getByType } from "../../components/Data/properties";
import PropertyLayout from "../PropertyDetails/PropertyLayout";

const allProperties = getByType("Farmhouse");

const Farmhouse: React.FC = () => (
  <PropertyLayout allProperties={allProperties}>
    {(filtered) =>
      filtered.length > 0 ? (
        filtered.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))
      ) : (
        <div className="col-span-2 flex items-center justify-center text-gray-500 py-20 text-lg">
          No properties match your filters.
        </div>
      )
    }
  </PropertyLayout>
);

export default Farmhouse;