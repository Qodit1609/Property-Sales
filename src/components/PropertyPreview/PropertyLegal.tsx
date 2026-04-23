import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { yesNoOptional } from "./previewUtils";
import { useTranslation } from "react-i18next";

type PropertyLegalProps = {
  property: Property;
};

const PropertyLegal = ({ property }: PropertyLegalProps) => {
  const { t } = useTranslation();
  const legal = property.legal;
  const items = [
    { label: t("propertyPreview.labels.landRegistry"), value: yesNoOptional(legal?.landRegistry) },
    { label: t("propertyPreview.labels.ownershipDocs"), value: yesNoOptional(legal?.ownershipDocs) },
    { label: t("propertyPreview.labels.encumbrance"), value: yesNoOptional(legal?.encumbrance) },
    { label: t("propertyPreview.labels.landUseType"), value: legal?.landUseType },
    { label: t("propertyPreview.labels.constructionAllowed"), value: yesNoOptional(legal?.constructionAllowed) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return <PropertyFeatureList items={items} emptyMessage={t("propertyPreview.messages.legalInfoUnavailable")} />;
};

export default PropertyLegal;
