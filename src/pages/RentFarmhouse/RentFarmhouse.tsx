import React from "react";
import PropertyCard from "../../components/Crads/PropertyCard";
import PropertyLayout from "../PropertyDetails/PropertyLayout";
import { properties } from "../../components/Data/properties";

const RentFarmhouse: React.FC = () => {
  return (
    <PropertyLayout>
      {properties.map((property) => ( <PropertyCard property={property} /> ))}
    </PropertyLayout>
  );
};

export default RentFarmhouse;
