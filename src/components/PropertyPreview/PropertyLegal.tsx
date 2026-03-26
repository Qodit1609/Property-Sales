import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { yesNoOptional } from "./previewUtils";

type PropertyLegalProps = {
  property: Property;
};

const PropertyLegal = ({ property }: PropertyLegalProps) => {
  const legal = property.legal;
  const items = [
    { label: "Land Registry", value: yesNoOptional(legal?.landRegistry) },
    { label: "Ownership Docs", value: yesNoOptional(legal?.ownershipDocs) },
    { label: "Encumbrance", value: yesNoOptional(legal?.encumbrance) },
    { label: "Land Use Type", value: legal?.landUseType },
    { label: "Construction Allowed", value: yesNoOptional(legal?.constructionAllowed) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <PropertyFeatureList items={items} emptyMessage="Legal information unavailable." />;
};

export default PropertyLegal;
