import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { useTranslation } from "react-i18next";
import { translateSoilType } from "./previewUtils";

type PropertyFarmingProps = {
  property: Property;
};

const PropertyFarming = ({ property }: PropertyFarmingProps) => {
  const { t } = useTranslation();
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
              ? t("propertyPreview.messages.irrigationSupportAvailable")
              : farming.rainfallData.irrigationSupport === false
                ? t("propertyPreview.messages.noIrrigationSupport")
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
    { label: t("propertyPreview.labels.soilType"), value: translateSoilType(farming?.soilType) },
    {
      label: t("propertyPreview.labels.soilQualityIndex"),
      value: Number.isFinite(soilQualityIndex) ? String(soilQualityIndex) : undefined,
    },
    {
      label: t("propertyPreview.labels.cropSuitability"),
      value: cropSuitability,
    },
    { label: t("propertyPreview.labels.rainfallData"), value: rainfallData },
    {
      label: t("propertyPreview.labels.farmingPercent"),
      value: typeof farmingPercent === "number" ? `${farmingPercent}%` : undefined,
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <PropertyFeatureList items={items} emptyMessage={t("propertyPreview.messages.farmingInsightsUnavailable")} />;
};

export default PropertyFarming;
