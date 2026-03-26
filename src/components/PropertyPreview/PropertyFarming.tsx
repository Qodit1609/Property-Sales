import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";

type PropertyFarmingProps = {
  property: Property;
};

const PropertyFarming = ({ property }: PropertyFarmingProps) => {
  const farming = property.soilAndFarming;
  const cropSuitability = Array.isArray(farming?.cropSuitability)
    ? farming.cropSuitability.filter(Boolean).join(", ")
    : typeof farming?.cropSuitability === "string"
      ? farming.cropSuitability
      : undefined;

  const rainfallData =
    typeof farming?.rainfallData === "string"
      ? farming.rainfallData
      : farming?.rainfallData
        ? [
            farming.rainfallData.annualRainfall
              ? `${farming.rainfallData.annualRainfall} mm/year`
              : undefined,
            farming.rainfallData.irrigationSupport === true
              ? "Irrigation support available"
              : farming.rainfallData.irrigationSupport === false
                ? "No irrigation support"
                : undefined,
          ]
            .filter(Boolean)
            .join(" | ")
        : undefined;

  const farmingPercent = [farming?.farmingPercent, farming?.farmingPercentage].find(
    (value): value is number => Number.isFinite(value),
  );
  const soilQualityIndex = farming?.soilQualityIndex;

  const items = [
    { label: "Soil Type", value: farming?.soilType },
    {
      label: "Soil Quality Index",
      value: Number.isFinite(soilQualityIndex) ? String(soilQualityIndex) : undefined,
    },
    {
      label: "Crop Suitability",
      value: cropSuitability,
    },
    { label: "Rainfall Data", value: rainfallData },
    {
      label: "Farming %",
      value: typeof farmingPercent === "number" ? `${farmingPercent}%` : undefined,
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <PropertyFeatureList items={items} emptyMessage="Farming insights unavailable." />;
};

export default PropertyFarming;
