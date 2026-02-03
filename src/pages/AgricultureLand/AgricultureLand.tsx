import React from "react";

import PropertyCard from "../../components/Crads/PropertyCard";
import { properties } from "../../components/Data/properties";
import PropertyLayout from "../PropertyDetails/PropertyLayout";

const AgricultureLand: React.FC = () => {
  return (
    <PropertyLayout>
      {properties.map((property) => ( <PropertyCard property={property} /> ))}
    </PropertyLayout>
  );
};

export default AgricultureLand;
