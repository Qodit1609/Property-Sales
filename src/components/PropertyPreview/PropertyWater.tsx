import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { translateDynamicList, translateWaterAvailability, yesNoOptional } from "./previewUtils";
import { useTranslation } from "react-i18next";

type PropertyWaterProps = {
  property: Property;
};

const PropertyWater = ({ property }: PropertyWaterProps) => {
  const { t } = useTranslation();
  const water = property.waterResources;
  const items = [
    { label: t("propertyPreview.labels.borewell"), value: yesNoOptional(water?.borewell) },
    {
      label: t("propertyPreview.labels.waterAvailability"),
      value: translateWaterAvailability(water?.waterAvailability),
    },
    { label: t("propertyPreview.labels.irrigation"), value: yesNoOptional(water?.irrigation) },
    {
      label: t("propertyPreview.labels.nearbySources"),
      value: translateDynamicList(water?.nearbySources)?.join(", "),
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <PropertyFeatureList items={items} emptyMessage={t("propertyPreview.messages.waterResourceDetailsUnavailable")} />;
};

export default PropertyWater;
