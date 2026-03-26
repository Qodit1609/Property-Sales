import type { Property } from "../../features/properties/propertyType";
import {
  FALLBACK_PROPERTY_IMAGE,
  formatArea,
  formatPrice,
} from "../../utils/propertyFormatters";

export const formatCompactNumber = (value?: number): string => {
  if (!Number.isFinite(value)) {
    return "\u2014";
  }
  const safeValue = Number(value);

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(safeValue);
};

export const formatSqftPrice = (property: Property): string => {
  const directPrice = property.pricePerSqft ?? property.analytics?.pricePerSqft;
  if (Number.isFinite(directPrice) && Number(directPrice) > 0) {
    return `\u20B9 ${Number(directPrice).toLocaleString("en-IN")} / sqft`;
  }

  const area = Number(property.area ?? property.landSize ?? 0);
  if (!Number.isFinite(area) || area <= 0 || property.price <= 0) {
    return "\u2014";
  }

  const calculated = property.price / area;
  return `\u20B9 ${Math.round(calculated).toLocaleString("en-IN")} / sqft`;
};

export const yesNo = (value?: string | number | boolean): string => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    if (value === 1) {
      return "Yes";
    }
    if (value === 0) {
      return "No";
    }
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "\u2014";
};

export const yesNoOptional = (
  value?: string | number | boolean,
): string | undefined => {
  if (typeof value === "undefined" || value === null) {
    return undefined;
  }

  const result = yesNo(value);
  return result === "\u2014" ? undefined : result;
};

export const toMapLink = (property: Property): string | undefined => {
  if (property.location?.googleMapLink) {
    return property.location.googleMapLink;
  }

  if (property.mapLink) {
    return property.mapLink;
  }

  const coords = getLatLng(property);
  if (coords) {
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  }

  return undefined;
};

export const getLatLng = (property: Property): { lat: number; lng: number } | undefined => {
  const directLat = Number((property.location as { lat?: unknown } | undefined)?.lat);
  const directLng = Number((property.location as { lng?: unknown } | undefined)?.lng);
  if (Number.isFinite(directLat) && Number.isFinite(directLng)) {
    return { lat: directLat, lng: directLng };
  }

  const coords = property.location?.coordinates;
  if (coords && typeof coords === "object" && !Array.isArray(coords)) {
    const lat = Number(coords.lat);
    const lng = Number(coords.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (Array.isArray(coords) && coords.length === 2) {
    const first = Number(coords[0]);
    const second = Number(coords[1]);
    if (Number.isFinite(first) && Number.isFinite(second)) {
      return { lat: first, lng: second };
    }
  }

  return undefined;
};

export const getPrimaryContact = (property: Property) => {
  const agentName =
    property.dealer?.name ||
    property.seller?.name ||
    property.ownerDetails?.name ||
    "Agent details not available";
  const phone =
    property.dealer?.phone || property.seller?.phone || property.ownerDetails?.phone;
  const role = property.dealer?.type || property.ownerDetails?.type || "Agent";
  const verified =
    Boolean(property.dealer?.verified) ||
    Boolean(property.seller?.verified) ||
    Boolean(property.ownerDetails?.verified) ||
    Boolean(property.verified);

  return { agentName, phone, role, verified };
};

export const getGalleryImages = (property: Property): string[] => {
  const mediaImages = property.media?.images ?? property.media?.gallery ?? [];
  const rawImages = property.images ?? [];
  const images = mediaImages.length ? mediaImages : rawImages;
  return images.length ? images : [FALLBACK_PROPERTY_IMAGE];
};

export const getDisplayAddress = (property: Property): string => {
  return (
    property.location?.address ||
    property.address ||
    property.locationText ||
    "Location not available"
  );
};

export const getOverviewSpecs = (property: Property): Array<{ label: string; value: string }> => {
  const areaValue = property.area ?? property.size ?? property.landSize;
  const areaUnit = property.areaUnit ?? property.landUnit;

  return [
    { label: "Area", value: formatArea(areaValue, areaUnit) },
    {
      label: "Land Size",
      value: formatArea(property.landSize ?? areaValue, property.landUnit ?? areaUnit),
    },
    {
      label: "Bedrooms",
      value: property.bedrooms || property.beds ? String(property.bedrooms ?? property.beds) : "",
    },
    {
      label: "Bathrooms",
      value:
        property.bathrooms || property.baths
          ? String(property.bathrooms ?? property.baths)
          : "",
    },
    { label: "Facing", value: property.features?.facing || property.facing || "" },
    {
      label: "Floor",
      value: property.features?.floor || property.floor ? String(property.features?.floor || property.floor) : "",
    },
    { label: "Type", value: property.propertyType || "" },
    { label: "Listing", value: property.listingType ? property.listingType.toUpperCase() : "" },
    { label: "Price", value: formatPrice(property.price, property.listingType) },
  ].filter((spec) => spec.value.trim().length > 0);
};
