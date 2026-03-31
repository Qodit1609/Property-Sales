import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { yesNoOptional } from "./previewUtils";

type PropertyWaterProps = {
  property: Property;
};

const PropertyWater = ({ property }: PropertyWaterProps) => {
  const water = property.waterResources;
  const items = [
    { label: "Borewell", value: yesNoOptional(water?.borewell) },
    { label: "Water Availability", value: water?.waterAvailability },
    { label: "Irrigation", value: yesNoOptional(water?.irrigation) },
    {
      label: "Nearby Sources",
      value: water?.nearbySources?.join(", "),
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <PropertyFeatureList items={items} emptyMessage="Water resource details unavailable." />;
};

export default PropertyWater;
