import React from "react";
import PropertyCard from "../../components/Cards/PropertyCard";
import PropertyLayout from "../PropertyDetails/PropertyLayout";
import { useAppSelector } from "../../hooks/reduxHooks";
import { isAgricultureLandType } from "../../features/properties/propertyTypeUtils";

const AgricultureLand: React.FC = () => {
  const { data, loading, error } = useAppSelector((state) => state.properties);

  const allProperties = data.filter((property) =>
    isAgricultureLandType(property.propertyType),
  );

  return (
    <PropertyLayout allProperties={allProperties}>
      {(filtered) =>
        loading ? (
          <div className="col-span-2 flex items-center justify-center text-[var(--muted)] py-20 text-lg">
            Loading properties...
          </div>
        ) : error ? (
          <div className="col-span-2 flex items-center justify-center text-[var(--error)] py-20 text-lg">
            {error}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center text-[var(--muted)] py-20 text-lg">
            No properties match your filters.
          </div>
        )
      }
    </PropertyLayout>
  );
};

export default AgricultureLand;
