import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { getDisplayAddress, toMapLink } from "./previewUtils";
import { useTranslation } from "react-i18next";

type PropertyLocationProps = {
  property: Property;
};

const PropertyLocation = ({ property }: PropertyLocationProps) => {
  const { t } = useTranslation();
  const mapLink = toMapLink(property);
  const distances = property.location?.distances ?? property.infrastructure?.distances;
  const nearby = property.location?.nearbyFacilities ?? property.infrastructure?.nearbyFacilities;

  const distanceItems = [
    {
      label: t("propertyPreview.labels.airport"),
      value: Number.isFinite(distances?.airport) ? `${distances?.airport} km` : undefined,
    },
    {
      label: t("propertyPreview.labels.railway"),
      value: Number.isFinite(distances?.railway) ? `${distances?.railway} km` : undefined,
    },
    {
      label: t("propertyPreview.labels.highway"),
      value: Number.isFinite(distances?.highway) ? `${distances?.highway} km` : undefined,
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const nearbyItems = [
    { label: t("propertyPreview.labels.schools"), value: nearby?.schools?.join(", ") },
    { label: t("propertyPreview.labels.hospitals"), value: nearby?.hospitals?.join(", ") },
    { label: t("propertyPreview.labels.markets"), value: nearby?.markets?.join(", ") },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[var(--muted)]">{t("propertyPreview.labels.address")}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{getDisplayAddress(property)}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--b2-soft)] p-3">
          <p className="text-xs text-[var(--muted)]">{t("propertyPreview.labels.city")}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{property.location?.city || "\u2014"}</p>
        </div>
        <div className="rounded-lg border border-[var(--b2-soft)] p-3">
          <p className="text-xs text-[var(--muted)]">{t("propertyPreview.labels.state")}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{property.location?.state || "\u2014"}</p>
        </div>
        <div className="rounded-lg border border-[var(--b2-soft)] p-3">
          <p className="text-xs text-[var(--muted)]">{t("propertyPreview.labels.pincode")}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{property.location?.pincode || "\u2014"}</p>
        </div>
      </div>

      {mapLink && (
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-lg border border-[var(--b2-soft)] px-3 py-2 text-sm font-semibold text-[var(--b1)] transition hover:bg-[var(--b2-soft)]/40"
        >
          {t("propertyPreview.actions.openGoogleMap")}
        </a>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[var(--b1)]">{t("propertyPreview.sections.distances")}</h4>
        <PropertyFeatureList items={distanceItems} />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[var(--b1)]">{t("propertyPreview.sections.nearbyFacilities")}</h4>
        <PropertyFeatureList items={nearbyItems} />
      </div>
    </div>
  );
};

export default PropertyLocation;
