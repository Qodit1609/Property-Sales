import type { Property } from "../../features/properties/propertyType";
import {
  FALLBACK_PROPERTY_IMAGE,
} from "../../utils/propertyFormatters";
import { pickCyclicImagesForProperty } from "../../utils/propertyImagePool";
import i18n from "../../i18n";

const normalizeToken = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

type PreviewDynamicGroup = "facing" | "landUseType" | "roadType" | "waterAvailability" | "furnishing";

const translatePreviewDynamic = (
  group: PreviewDynamicGroup,
  value?: string,
): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  const trimmed = value.trim();
  const namespace = `propertyPreview.dynamic.${group}`;
  const directKey = `${namespace}.${trimmed}`;
  if (i18n.exists(directKey)) {
    return i18n.t(directKey);
  }

  const normalized = normalizeToken(trimmed);
  const enOptions = i18n.getResource("en", "translation", namespace) ?? {};
  const hiOptions = i18n.getResource("hi", "translation", namespace) ?? {};
  const candidate = Object.keys(enOptions).find((item) => {
    const enValue = typeof enOptions[item] === "string" ? enOptions[item] : item;
    const hiValue = typeof hiOptions[item] === "string" ? hiOptions[item] : undefined;
    return (
      normalizeToken(item) === normalized ||
      normalizeToken(String(enValue)) === normalized ||
      (hiValue ? normalizeToken(String(hiValue)) === normalized : false)
    );
  });
  if (candidate) {
    return i18n.t(`${namespace}.${candidate}`);
  }
  return trimmed;
};

export const translateFacing = (value?: string): string | undefined =>
  translatePreviewDynamic("facing", value);

export const translateLandUseType = (value?: string): string | undefined =>
  translatePreviewDynamic("landUseType", value);

export const translateRoadType = (value?: string): string | undefined =>
  translatePreviewDynamic("roadType", value);

export const translateWaterAvailability = (value?: string): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  if (value.includes("+")) {
    return value
      .split("+")
      .map((part) => translatePreviewDynamic("waterAvailability", part.trim()) ?? part.trim())
      .join(" + ");
  }
  return translatePreviewDynamic("waterAvailability", value);
};

export const translateFurnishing = (value?: string): string | undefined =>
  translatePreviewDynamic("furnishing", value);

const translatePostPropertyOption = (
  group: "propertyType" | "category" | "ownership" | "soil" | "suitableFor",
  value?: string,
): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  const trimmed = value.trim();
  const directKey = `postProperty.options.${group}.${trimmed}`;
  if (i18n.exists(directKey)) {
    return i18n.t(directKey);
  }

  const normalized = normalizeToken(trimmed);
  const enOptions = i18n.getResource("en", "translation", `postProperty.options.${group}`) ?? {};
  const hiOptions = i18n.getResource("hi", "translation", `postProperty.options.${group}`) ?? {};
  const candidates = Object.keys(enOptions);
  const candidate = candidates.find((item) => {
    const enValue = typeof enOptions[item] === "string" ? enOptions[item] : item;
    const hiValue = typeof hiOptions[item] === "string" ? hiOptions[item] : undefined;
    return (
      normalizeToken(item) === normalized ||
      normalizeToken(enValue) === normalized ||
      (hiValue ? normalizeToken(hiValue) === normalized : false)
    );
  });
  if (candidate) {
    return i18n.t(`postProperty.options.${group}.${candidate}`);
  }
  return trimmed;
};

export const translatePropertyType = (value?: string): string | undefined =>
  translatePostPropertyOption("propertyType", value);

export const translateSoilType = (value?: string): string | undefined =>
  translatePostPropertyOption("soil", value);

export const translateOwnershipType = (value?: string): string | undefined =>
  translatePostPropertyOption("ownership", value);

export const translateSuitableFor = (value?: string): string | undefined =>
  translatePostPropertyOption("suitableFor", value);

export const translateListingType = (value?: string): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  const trimmed = value.trim();
  const normalized = normalizeToken(trimmed);
  if (
    normalized.includes("rent") ||
    normalized.includes("lease") ||
    normalized.includes("किराया") ||
    normalized.includes("लीज")
  ) {
    return i18n.t("postProperty.basic.rentLease");
  }
  if (
    normalized.includes("sell") ||
    normalized.includes("sale") ||
    normalized.includes("बेच") ||
    normalized.includes("बिक्री")
  ) {
    return i18n.t("postProperty.basic.sell");
  }

  const listingKey = `listingType.${trimmed}`;
  if (i18n.exists(listingKey)) {
    return i18n.t(listingKey);
  }
  const listingOptions = i18n.getResource("en", "translation", "listingType") ?? {};
  const listingCandidate = Object.keys(listingOptions).find(
    (item) => normalizeToken(item) === normalized,
  );
  if (listingCandidate) {
    return i18n.t(`listingType.${listingCandidate}`);
  }
  return trimmed;
};

export const translateStatusValue = (value?: string): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  const normalized = normalizeToken(value);
  if (normalized === "available") {
    return i18n.t("propertyPreview.labels.available");
  }
  if (normalized === normalizeToken(i18n.getResource("hi", "translation", "propertyPreview.labels.available") as string || "")) {
    return i18n.t("propertyPreview.labels.available");
  }
  const globalStatusKey = `status.${normalized}`;
  if (i18n.exists(globalStatusKey)) {
    return i18n.t(globalStatusKey);
  }
  const statusKey = `sellerPanel.status.${normalized}`;
  if (i18n.exists(statusKey)) {
    return i18n.t(statusKey);
  }
  const knownStatuses = ["pending", "approved", "rejected", "sold", "deactivated"] as const;
  const matchedStatus = knownStatuses.find((status) => {
    const hiValue = i18n.getResource("hi", "translation", `sellerPanel.status.${status}`) as string | undefined;
    const enValue = i18n.getResource("en", "translation", `sellerPanel.status.${status}`) as string | undefined;
    return (
      normalizeToken(status) === normalized ||
      (enValue ? normalizeToken(enValue) === normalized : false) ||
      (hiValue ? normalizeToken(hiValue) === normalized : false)
    );
  });
  if (matchedStatus) {
    return i18n.t(`sellerPanel.status.${matchedStatus}`);
  }
  return value;
};

const AMENITY_LABELS: Array<{ key: string; label: string }> = [
  { key: "borewell", label: "Borewell" },
  { key: "dripIrrigation", label: "Drip irrigation" },
  { key: "fencing", label: "Fencing" },
  { key: "electricityConnection", label: "Electricity connection" },
  { key: "farmRoad", label: "Farm road" },
  { key: "nearbyHighway", label: "Nearby highway" },
  { key: "storageFacility", label: "Storage facility" },
  { key: "security", label: "Security" },
];

export const translateAmenityValue = (value?: string): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  const normalized = normalizeToken(value);
  const match = AMENITY_LABELS.find((item) => {
    const enLabel = i18n.getResource("en", "translation", `postProperty.amenities.options.${item.key}.label`) as string | undefined;
    const hiLabel = i18n.getResource("hi", "translation", `postProperty.amenities.options.${item.key}.label`) as string | undefined;
    return (
      normalizeToken(item.label) === normalized ||
      (enLabel ? normalizeToken(enLabel) === normalized : false) ||
      (hiLabel ? normalizeToken(hiLabel) === normalized : false)
    );
  });
  if (match) {
    return i18n.t(`postProperty.amenities.options.${match.key}.label`);
  }
  return value;
};

export const translateDynamicList = (items?: string[]): string[] | undefined => {
  if (!items?.length) {
    return items;
  }
  return items.map((item) =>
    translateAmenityValue(
      translateWaterAvailability(
        translateFacing(
          translateFurnishing(
            translateLandUseType(
              translateRoadType(
                translateSuitableFor(
                  translateSoilType(translatePropertyType(item)),
                ),
              ),
            ),
          ),
        ),
      ),
    ) ?? item,
  );
};

export const translatePersonType = (value?: string): string | undefined => {
  if (!value?.trim()) {
    return value;
  }
  const normalized = normalizeToken(value);
  if (normalized === "seller" || normalized === normalizeToken(i18n.t("propertyPreview.labels.seller"))) return i18n.t("propertyPreview.labels.seller");
  if (normalized === "owner" || normalized === normalizeToken(i18n.t("propertyPreview.labels.owner"))) return i18n.t("propertyPreview.labels.owner");
  if (normalized === "dealer" || normalized === normalizeToken(i18n.t("propertyPreview.labels.dealer"))) return i18n.t("propertyPreview.labels.dealer");
  if (normalized === "agent" || normalized === normalizeToken(i18n.t("propertyPreview.labels.agent"))) return i18n.t("propertyPreview.labels.agent");
  return value;
};

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
    return `\u20B9 ${Number(directPrice).toLocaleString("en-IN")} / ${i18n.t("propertyPreview.labels.sqft")}`;
  }

  const area = Number(property.area ?? property.landSize ?? 0);
  if (!Number.isFinite(area) || area <= 0 || property.price <= 0) {
    return "\u2014";
  }

  const calculated = property.price / area;
  return `\u20B9 ${Math.round(calculated).toLocaleString("en-IN")} / ${i18n.t("propertyPreview.labels.sqft")}`;
};

export const formatPriceLocalized = (price: number, listingType?: string): string => {
  if (!Number.isFinite(price) || price <= 0) {
    return i18n.t("propertyPreview.messages.priceOnRequest");
  }
  const amount = `\u20B9 ${price.toLocaleString("en-IN")}`;
  const normalized = normalizeToken(listingType ?? "");
  if (
    normalized.includes("rent") ||
    normalized.includes("lease") ||
    normalized.includes("किराया") ||
    normalized.includes("लीज")
  ) {
    return `${amount} / ${i18n.t("propertyPreview.labels.month")}`;
  }
  return amount;
};

export const formatAreaLocalized = (area?: number | string, areaUnit?: string): string => {
  const safeArea =
    typeof area === "string" ? Number(area.replace(/[^0-9.]/g, "")) : area;
  if (!Number.isFinite(safeArea) || !safeArea || safeArea <= 0) {
    return i18n.t("propertyPreview.messages.areaNotSpecified");
  }

  const normalizedUnit = normalizeToken(areaUnit || "sqft");
  let unitKey = "sqft";
  if (normalizedUnit === "acre" || normalizedUnit === "acres" || normalizedUnit === "एकड़") {
    unitKey = "acre";
  } else if (normalizedUnit === "bigha" || normalizedUnit === "बीघा") {
    unitKey = "bigha";
  }

  return `${safeArea.toLocaleString("en-IN")} ${i18n.t(`propertyPreview.labels.${unitKey}`)}`;
};

export const yesNo = (value?: string | number | boolean): string => {
  if (typeof value === "boolean") {
    return value ? i18n.t("postProperty.common.yes") : i18n.t("postProperty.common.no");
  }

  if (typeof value === "number") {
    if (value === 1) {
      return i18n.t("postProperty.common.yes");
    }
    if (value === 0) {
      return i18n.t("postProperty.common.no");
    }
  }

  if (typeof value === "string" && value.trim()) {
    const normalized = normalizeToken(value);
    if (["yes", "true", "1", "हाँ", "हां"].includes(normalized)) {
      return i18n.t("postProperty.common.yes");
    }
    if (["no", "false", "0", "नहीं", "ना"].includes(normalized)) {
      return i18n.t("postProperty.common.no");
    }
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
  const normalizeContact = (value?: string | number): string | undefined => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return undefined;
  };
  const findNestedMobile = (value: unknown, depth = 0): string | undefined => {
    if (depth > 4 || !value || typeof value !== "object") return undefined;
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findNestedMobile(item, depth + 1);
        if (found) return found;
      }
      return undefined;
    }
    const record = value as Record<string, unknown>;
    const preferredKeys = [
      "contactMobile",
      "mobileNumber",
      "phoneNumber",
      "mobile",
      "phone",
      "contact",
    ];
    for (const key of preferredKeys) {
      const direct = normalizeContact(record[key] as string | number | undefined);
      if (direct) return direct;
    }
    for (const nested of Object.values(record)) {
      const found = findNestedMobile(nested, depth + 1);
      if (found) return found;
    }
    return undefined;
  };
  const propertyWithContact = property as Property & {
    contactName?: string;
    contactEmail?: string;
    contactMobile?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    phone?: string;
    mobile?: string;
    contact?: string;
    agent?: {
      name?: string;
      phone?: string | number;
      mobile?: string | number;
      mobileNumber?: string | number;
      phoneNumber?: string | number;
      email?: string;
      contactEmail?: string;
    };
  };
  const ownerDetails = property.ownerDetails as Property["ownerDetails"] & {
    email?: string;
    contactEmail?: string;
    mobile?: string;
    mobileNumber?: string;
    phoneNumber?: string;
  };
  const dealer = property.dealer as Property["dealer"] & {
    email?: string;
    contactEmail?: string;
    mobile?: string;
    mobileNumber?: string;
    phoneNumber?: string;
  };
  const seller = property.seller as Property["seller"] & {
    contactEmail?: string;
    mobile?: string;
    mobileNumber?: string;
    phoneNumber?: string;
  };
  const agentName =
    propertyWithContact.contactName ||
    propertyWithContact.agent?.name ||
    dealer?.name ||
    seller?.name ||
    ownerDetails?.name ||
    i18n.t("propertyPreview.messages.agentDetailsNotAvailable");
  const mobile =
    normalizeContact(propertyWithContact.contactMobile) ||
    normalizeContact(propertyWithContact.mobileNumber) ||
    normalizeContact(propertyWithContact.phoneNumber) ||
    normalizeContact(propertyWithContact.phone) ||
    normalizeContact(propertyWithContact.mobile) ||
    normalizeContact(propertyWithContact.contact) ||
    normalizeContact(propertyWithContact.agent?.phone) ||
    normalizeContact(propertyWithContact.agent?.mobile) ||
    normalizeContact(propertyWithContact.agent?.mobileNumber) ||
    normalizeContact(propertyWithContact.agent?.phoneNumber) ||
    normalizeContact(dealer?.phone) ||
    normalizeContact(dealer?.mobile) ||
    normalizeContact(dealer?.mobileNumber) ||
    normalizeContact(dealer?.phoneNumber) ||
    normalizeContact(seller?.phone) ||
    normalizeContact(seller?.mobile) ||
    normalizeContact(seller?.mobileNumber) ||
    normalizeContact(seller?.phoneNumber) ||
    normalizeContact(ownerDetails?.phone) ||
    normalizeContact(ownerDetails?.mobile) ||
    normalizeContact(ownerDetails?.mobileNumber) ||
    normalizeContact(ownerDetails?.phoneNumber) ||
    findNestedMobile(property);
  const email =
    propertyWithContact.contactEmail ||
    propertyWithContact.agent?.email ||
    propertyWithContact.agent?.contactEmail ||
    seller?.email ||
    seller?.contactEmail ||
    dealer?.email ||
    dealer?.contactEmail ||
    ownerDetails?.email ||
    ownerDetails?.contactEmail;
  const role = translatePersonType(property.dealer?.type || property.ownerDetails?.type) || i18n.t("propertyPreview.labels.agent");
  const verified =
    Boolean(property.dealer?.verified) ||
    Boolean(property.seller?.verified) ||
    Boolean(property.ownerDetails?.verified) ||
    Boolean(property.verified);

  return { agentName, phone: mobile, mobile, email, role, verified };
};

export const getGalleryImages = (property: Property): string[] => {
  const mediaImages = property.media?.images ?? property.media?.gallery ?? [];
  const rawImages = property.images ?? [];
  const images = mediaImages.length ? mediaImages : rawImages;
  return images.length ? images : [FALLBACK_PROPERTY_IMAGE];
};

/** Detail page: up to this many images from the pool when using cyclic fallback (repeats if pool is smaller). */
const GALLERY_POOL_MIN = 3;
const GALLERY_POOL_MAX = 8;

/** Prefer server-linked map, then cyclic assignment from global Cloudinary pool, then property payload. */
export const resolvePropertyGalleryImages = (
  property: Property,
  propertyImagesMap: Record<string, string[]>,
  cloudinaryPool: string[],
): string[] => {
  const fromMediaApi = propertyImagesMap[property._id];
  if (fromMediaApi?.length) {
    return fromMediaApi;
  }
  if (cloudinaryPool.length) {
    const count = Math.min(
      GALLERY_POOL_MAX,
      Math.max(GALLERY_POOL_MIN, cloudinaryPool.length),
    );
    const cyclic = pickCyclicImagesForProperty(
      property._id,
      cloudinaryPool,
      count,
    );
    if (cyclic.length) {
      return cyclic;
    }
  }
  return getGalleryImages(property);
};

export const getDisplayAddress = (property: Property): string => {
  return (
    property.location?.address ||
    property.address ||
    property.locationText ||
    i18n.t("propertyCard.locationNotAvailable")
  );
};

export const getOverviewSpecs = (property: Property): Array<{ label: string; value: string }> => {
  const areaValue = property.area ?? property.size ?? property.landSize;
  const areaUnit = property.areaUnit ?? property.landUnit;

  return [
    { label: i18n.t("propertyPreview.labels.area"), value: formatAreaLocalized(areaValue, areaUnit) },
    {
      label: i18n.t("propertyPreview.labels.landSize"),
      value: formatAreaLocalized(property.landSize ?? areaValue, property.landUnit ?? areaUnit),
    },
    {
      label: i18n.t("propertyPreview.detail.bedrooms"),
      value: property.bedrooms || property.beds ? String(property.bedrooms ?? property.beds) : "",
    },
    {
      label: i18n.t("propertyPreview.detail.bathrooms"),
      value:
        property.bathrooms || property.baths
          ? String(property.bathrooms ?? property.baths)
          : "",
    },
    {
      label: i18n.t("propertyPreview.labels.facing"),
      value: translateFacing(property.features?.facing || property.facing) || "",
    },
    {
      label: i18n.t("propertyPreview.detail.floor"),
      value: property.features?.floor || property.floor ? String(property.features?.floor || property.floor) : "",
    },
    { label: i18n.t("propertyPreview.detail.type"), value: translatePropertyType(property.propertyType) || "" },
    { label: i18n.t("propertyPreview.detail.listing"), value: translateListingType(property.listingType) || "" },
    { label: i18n.t("propertyPreview.detail.price"), value: formatPriceLocalized(property.price, property.listingType) },
  ].filter((spec) => spec.value.trim().length > 0);
};
