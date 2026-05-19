import React from "react";
import { useTranslation } from "react-i18next";
import PropertyCard from "../../components/Cards/PropertyCard";
import PropertyLayout from "../PropertyDetails/PropertyLayout";
import { useAppSelector } from "../../hooks/reduxHooks";

const Farmhouse: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useAppSelector((state) => state.properties);

  const allProperties = data.filter(
    (property) => property.propertyType === "Farmhouse"
  );

  return (
    <PropertyLayout allProperties={allProperties}>
      {(filtered) =>
        filtered.length > 0 ? (
          filtered.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center text-gray-500 py-20 text-lg">
            {t("propertyList.emptyFiltered")}
          </div>
        )
      }
    </PropertyLayout>
  );
};

export default Farmhouse;
