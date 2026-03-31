import type { Property } from "../../features/properties/propertyType";
import PropertyFeatureList from "./PropertyFeatureList";
import { getDisplayAddress, toMapLink } from "./previewUtils";

type PropertyLocationProps = {
  property: Property;
};

const PropertyLocation = ({ property }: PropertyLocationProps) => {
  const mapLink = toMapLink(property);
  const distances = property.location?.distances ?? property.infrastructure?.distances;
  const nearby = property.location?.nearbyFacilities ?? property.infrastructure?.nearbyFacilities;

  const distanceItems = [
    {
      label: "Airport",
      value: Number.isFinite(distances?.airport) ? `${distances?.airport} km` : undefined,
    },
    {
      label: "Railway",
      value: Number.isFinite(distances?.railway) ? `${distances?.railway} km` : undefined,
    },
    {
      label: "Highway",
      value: Number.isFinite(distances?.highway) ? `${distances?.highway} km` : undefined,
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const nearbyItems = [
    { label: "Schools", value: nearby?.schools?.join(", ") },
    { label: "Hospitals", value: nearby?.hospitals?.join(", ") },
    { label: "Markets", value: nearby?.markets?.join(", ") },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-[var(--muted)]">Address</p>
        <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{getDisplayAddress(property)}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--b2-soft)] p-3">
          <p className="text-xs text-[var(--muted)]">City</p>
          <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{property.location?.city || "\u2014"}</p>
        </div>
        <div className="rounded-lg border border-[var(--b2-soft)] p-3">
          <p className="text-xs text-[var(--muted)]">State</p>
          <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{property.location?.state || "\u2014"}</p>
        </div>
        <div className="rounded-lg border border-[var(--b2-soft)] p-3">
          <p className="text-xs text-[var(--muted)]">Pincode</p>
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
          Open Google Map
        </a>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[var(--b1)]">Distances</h4>
        <PropertyFeatureList items={distanceItems} />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[var(--b1)]">Nearby Facilities</h4>
        <PropertyFeatureList items={nearbyItems} />
      </div>
    </div>
  );
};

export default PropertyLocation;
