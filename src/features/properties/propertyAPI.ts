import api, { API_ENDPOINTS } from "../../lib/apiClient";
import type { Property } from "./propertyType";
import { FALLBACK_PROPERTY_IMAGE } from "../../utils/propertyFormatters";

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const toString = (value: unknown): string | undefined => {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const toStringArray = (value: unknown): string[] => {
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "available", "1"].includes(normalized)) {
      return true;
    }
    if (["false", "no", "not available", "0"].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }

  return undefined;
};

const toRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
};

/** Hosts replaced with the local SVG fallback (broken or unwanted CDNs). Keep real http(s) URLs loadable — e.g. via.placeholder.com is valid for seeded demo data. */
const BLOCKED_IMAGE_HOSTS = new Set(["is1-2.housingcdn.com"]);

const sanitizeImageUrl = (value: string): string => {
  try {
    const parsed = new URL(value);
    if (BLOCKED_IMAGE_HOSTS.has(parsed.hostname.toLowerCase())) {
      return FALLBACK_PROPERTY_IMAGE;
    }
    return value;
  } catch {
    return FALLBACK_PROPERTY_IMAGE;
  }
};

const getLocationText = (raw: Record<string, unknown>): string => {
  const location = toRecord(raw.location);

  const locationParts = [
    toString(raw.locality),
    toString(raw.city),
    toString(raw.state),
    toString(location.locality),
    toString(location.city),
    toString(location.state),
  ].filter(Boolean);

  return (
    toString(raw.address) ??
    toString(location.address) ??
    (locationParts.length ? locationParts.join(", ") : undefined) ??
    "Location not available"
  );
};

const normalizeProperty = (payload: unknown): Property => {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const location = toRecord(raw.location);
  const geoJSON = toRecord(location.geoJSON);
  const media = toRecord(raw.media);
  const dealer = toRecord(raw.dealer);
  const seller = toRecord(raw.seller);
  const sellerIdRaw = raw.sellerId;
  const status = toRecord(raw.status);
  const distances = toRecord(location.distances);
  const features = toRecord(raw.features);
  const infrastructure = toRecord(raw.infrastructure);
  const infrastructureDistances = toRecord(infrastructure.distances);
  const nearbyFacilities = toRecord(infrastructure.nearbyFacilities);
  const locationNearbyFacilities = toRecord(location.nearbyFacilities);
  const legal = toRecord(raw.legal);
  const soilAndFarming = toRecord(raw.soilAndFarming);
  const rainfallData = toRecord(soilAndFarming.rainfallData);
  const waterResources = toRecord(raw.waterResources);
  const analytics = toRecord(raw.analytics);
  const topography = toRecord(raw.topography);
  const climateRisk = toRecord(raw.climateRisk);
  const investment = toRecord(raw.investment);
  const agent = toRecord(raw.agent);
  const highlights = toRecord(raw.highlights);
  const amenitiesObject = toRecord(raw.amenities);

  const imagesRaw = toStringArray(raw.images).length
    ? toStringArray(raw.images)
    : toStringArray(media.images);
  const coverImage = toString(raw.coverImage);
  const imagesWithCover = coverImage ? [coverImage, ...imagesRaw] : imagesRaw;
  const images = imagesWithCover.map(sanitizeImageUrl);
  const amenities = [
    ...toStringArray(raw.amenities),
    ...toStringArray(raw.amenitiesHighlight),
  ];

  const area = toNumber(raw.area) ?? toNumber(raw.landSize);
  const bedrooms = toNumber(raw.bedrooms);
  const bathrooms = toNumber(raw.bathrooms);
  const geoPoint = toRecord(location.coordinates);
  const mapCoordinates = (() => {
    if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      const lng = toNumber(location.coordinates[0]);
      const lat = toNumber(location.coordinates[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }

    if (Array.isArray(geoJSON.coordinates) && geoJSON.coordinates.length >= 2) {
      const lng = toNumber(geoJSON.coordinates[0]);
      const lat = toNumber(geoJSON.coordinates[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }

    const lat =
      toNumber(geoPoint.lat) ?? toNumber((location as Record<string, unknown>).lat) ?? toNumber(raw.latitude);
    const lng =
      toNumber(geoPoint.lng) ?? toNumber((location as Record<string, unknown>).lng) ?? toNumber(raw.longitude);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }

    return undefined;
  })();

  const resolvedId =
    toString(raw._id) ??
    toString(raw.id) ??
    (typeof raw === "object" && raw !== null && "_id" in raw ? String((raw as Record<string, unknown>)._id) : undefined) ??
    (typeof raw === "object" && raw !== null && "id" in raw ? String((raw as Record<string, unknown>).id) : undefined);

  return {
    _id: resolvedId ?? "",
    sellerId:
      typeof sellerIdRaw === "string"
        ? sellerIdRaw
        : sellerIdRaw && typeof sellerIdRaw === "object"
        ? toString((sellerIdRaw as Record<string, unknown>)._id) ??
          toString((sellerIdRaw as Record<string, unknown>).id) ??
          null
        : null,
    title: toString(raw.title) ?? toString(raw.name) ?? "Untitled Property",
    description: toString(raw.description) ?? toString(raw.aboutProperty) ?? "",
    shortDescription:
      toString(raw.shortDescription) ?? toString(raw.description)?.slice(0, 150),
    address: getLocationText(raw),
    locationText: getLocationText(raw),
    price: toNumber(raw.price) ?? 0,
    images,
    videos: toStringArray(media.videos),
    propertyType: toString(raw.propertyType) ?? toString(raw.category) ?? "Property",
    listingType:
      (toString(raw.listingType) as Property["listingType"]) ??
      (toString(raw.listing_type) as Property["listingType"]),
    size: area,
    area,
    areaUnit:
      (toString(raw.areaUnit) as Property["areaUnit"]) ??
      (toString(raw.landUnit) as Property["areaUnit"]) ??
      "sqft",
    landSize: toNumber(raw.landSize),
    landUnit: (toString(raw.landUnit) as Property["landUnit"]) ?? "acre",
    beds: bedrooms,
    baths: bathrooms,
    parking: toNumber(raw.parking),
    bedrooms,
    bathrooms,
    distanceFromIndore:
      toNumber(distances.cityCenter) ??
      toNumber(infrastructureDistances.cityCenter) ??
      toNumber(raw.distanceFromIndore),
    tags: toStringArray(raw.tags),
    amenities: Array.from(new Set(amenities)),
    createdAt: toString(raw.createdAt),
    postedAt: toString(status.postedAt),
    featured: Boolean(status.featured),
    verified: Boolean(status.verified) || Boolean(dealer.verified),
    ownerDetails: {
      name: toString(dealer.name) ?? toString(seller.name) ?? toString(agent.name) ?? "",
      phone: toString(dealer.phone) ?? toString(seller.phone) ?? toString(agent.phone) ?? "",
      type: toString(dealer.type) ?? toString(agent.type),
      verified: Boolean(dealer.verified) || Boolean(agent.verified),
    },
    dealer: {
      name: toString(dealer.name) ?? toString(agent.name),
      phone: toString(dealer.phone) ?? toString(agent.phone),
      type: toString(dealer.type) ?? toString(agent.type),
      verified: Boolean(dealer.verified) || Boolean(agent.verified),
    },
    seller: {
      name: toString(seller.name),
      phone: toString(seller.phone),
      email: toString(seller.email),
      verified: Boolean(seller.verified),
    },
    media: {
      images,
      videos: toStringArray(media.videos),
      droneView: toStringArray(media.droneView).length
        ? toStringArray(media.droneView)
        : toStringArray(raw.droneView),
      mapPreview: toString(media.mapPreview) ?? toString(location.mapPreview),
      mapScreenshot: toString(media.mapScreenshot),
    },
    features: {
      parking:
        toNumber(features.parking) ??
        toString(features.parking) ??
        toNumber(raw.parking) ??
        toBoolean(amenitiesObject.farmRoad),
      powerBackup: toBoolean(features.powerBackup) ?? toString(features.powerBackup),
      security:
        toBoolean(features.security) ??
        toString(features.security) ??
        toBoolean(amenitiesObject.security),
      constructionAllowed:
        toBoolean(features.constructionAllowed) ??
        toBoolean(legal.constructionAllowed) ??
        toString(features.constructionAllowed) ??
        toString(legal.constructionAllowed),
      farmhouseBuilt: toBoolean(features.farmhouseBuilt) ?? toString(features.farmhouseBuilt),
      facing: toString(features.facing) ?? toString(raw.facing),
      floor: toNumber(features.floor) ?? toString(features.floor) ?? toString(raw.floor),
    },
    infrastructure: {
      distances: {
        airport: toNumber(distances.airport) ?? toNumber(infrastructureDistances.airport),
        railway:
          toNumber(distances.railway) ??
          toNumber(distances.railwayStation) ??
          toNumber(infrastructureDistances.railway) ??
          toNumber(infrastructureDistances.railwayStation),
        railwayStation:
          toNumber(distances.railwayStation) ??
          toNumber(distances.railway) ??
          toNumber(infrastructureDistances.railwayStation) ??
          toNumber(infrastructureDistances.railway),
        highway: toNumber(distances.highway) ?? toNumber(infrastructureDistances.highway),
        cityCenter:
          toNumber(distances.cityCenter) ?? toNumber(infrastructureDistances.cityCenter),
      },
      nearbyFacilities: {
        schools:
          toStringArray(locationNearbyFacilities.schools).length > 0
            ? toStringArray(locationNearbyFacilities.schools)
            : toStringArray(nearbyFacilities.schools),
        hospitals:
          toStringArray(locationNearbyFacilities.hospitals).length > 0
            ? toStringArray(locationNearbyFacilities.hospitals)
            : toStringArray(nearbyFacilities.hospitals),
        markets:
          toStringArray(locationNearbyFacilities.markets).length > 0
            ? toStringArray(locationNearbyFacilities.markets)
            : toStringArray(nearbyFacilities.markets),
        roads:
          toStringArray(locationNearbyFacilities.roads).length > 0
            ? toStringArray(locationNearbyFacilities.roads)
            : toStringArray(nearbyFacilities.roads),
      },
      electricityAvailable:
        toBoolean(infrastructure.electricityAvailable) ?? toString(infrastructure.electricityAvailable),
      roadAccess: toBoolean(infrastructure.roadAccess) ?? toString(infrastructure.roadAccess),
      roadType: toString(infrastructure.roadType),
      fencing: toBoolean(infrastructure.fencing) ?? toString(infrastructure.fencing),
      gated: toBoolean(infrastructure.gated) ?? toString(infrastructure.gated),
    },
    legal: {
      landRegistry:
        toBoolean(legal.landRegistryAvailable) ??
        toBoolean(legal.landRegistry) ??
        toString(legal.landRegistryAvailable) ??
        toString(legal.landRegistry),
      landRegistryAvailable:
        toBoolean(legal.landRegistryAvailable) ??
        toBoolean(legal.landRegistry) ??
        toString(legal.landRegistryAvailable) ??
        toString(legal.landRegistry),
      ownershipDocs:
        toBoolean(legal.ownershipDocuments) ??
        toBoolean(legal.ownershipDocs) ??
        toString(legal.ownershipDocuments) ??
        toString(legal.ownershipDocs),
      ownershipDocuments:
        toBoolean(legal.ownershipDocuments) ??
        toBoolean(legal.ownershipDocs) ??
        toString(legal.ownershipDocuments) ??
        toString(legal.ownershipDocs),
      encumbrance:
        toBoolean(legal.encumbranceFree) ??
        toBoolean(legal.encumbrance) ??
        toString(legal.encumbranceFree) ??
        toString(legal.encumbrance),
      encumbranceFree:
        toBoolean(legal.encumbranceFree) ??
        toBoolean(legal.encumbrance) ??
        toString(legal.encumbranceFree) ??
        toString(legal.encumbrance),
      landUseType: toString(legal.landUseType),
      constructionAllowed:
        toBoolean(legal.constructionAllowed) ?? toString(legal.constructionAllowed),
    },
    soilAndFarming: {
      soilType:
        toString(soilAndFarming.soilType) ?? toString(highlights.soilType) ?? toString(raw.soilType),
      soilQualityIndex: toNumber(soilAndFarming.soilQualityIndex) ?? toNumber(highlights.soilQualityIndex),
      cropSuitability:
        toStringArray(soilAndFarming.cropSuitability).length > 0
          ? toStringArray(soilAndFarming.cropSuitability)
          : toStringArray(raw.suitableFor),
      rainfallData:
        toString(soilAndFarming.rainfallData) ??
        (Number.isFinite(toNumber(rainfallData.annualRainfall)) || typeof toBoolean(rainfallData.irrigationSupport) !== "undefined"
          ? {
              annualRainfall: toNumber(rainfallData.annualRainfall),
              irrigationSupport: toBoolean(rainfallData.irrigationSupport),
            }
          : undefined),
      soilReportAvailable:
        toBoolean(soilAndFarming.soilReportAvailable) ?? toString(soilAndFarming.soilReportAvailable),
      farmingPercent:
        toNumber(soilAndFarming.farmingPercent) ??
        toNumber(soilAndFarming.farmingPercentage) ??
        toNumber(raw.farmingPercent),
      farmingPercentage:
        toNumber(soilAndFarming.farmingPercentage) ??
        toNumber(soilAndFarming.farmingPercent) ??
        toNumber(raw.farmingPercent),
    },
    waterResources: {
      borewell:
        toBoolean(waterResources.borewellAvailable) ??
        toBoolean(waterResources.borewell) ??
        toBoolean(amenitiesObject.borewell) ??
        toString(waterResources.borewellAvailable) ??
        toString(waterResources.borewell),
      borewellAvailable:
        toBoolean(waterResources.borewellAvailable) ??
        toBoolean(waterResources.borewell) ??
        toString(waterResources.borewellAvailable) ??
        toString(waterResources.borewell),
      borewellDepth: toNumber(waterResources.borewellDepth),
      waterAvailability: toString(waterResources.waterAvailability) ?? toString(highlights.waterAvailability),
      irrigation:
        toBoolean(waterResources.irrigationSystem) ??
        toBoolean(waterResources.irrigation) ??
        toBoolean(amenitiesObject.dripIrrigation) ??
        toString(waterResources.irrigationSystem) ??
        toString(waterResources.irrigation),
      irrigationSystem:
        toBoolean(waterResources.irrigationSystem) ??
        toBoolean(waterResources.irrigation) ??
        toString(waterResources.irrigationSystem) ??
        toString(waterResources.irrigation),
      nearbySources:
        toStringArray(waterResources.nearbyWaterSources).length > 0
          ? toStringArray(waterResources.nearbyWaterSources)
          : toStringArray(waterResources.nearbySources),
      nearbyWaterSources:
        toStringArray(waterResources.nearbyWaterSources).length > 0
          ? toStringArray(waterResources.nearbyWaterSources)
          : toStringArray(waterResources.nearbySources),
      waterCertificateAvailable:
        toBoolean(waterResources.waterCertificateAvailable) ??
        toString(waterResources.waterCertificateAvailable),
    },
    analytics: {
      views: toNumber(analytics.views),
      saves: toNumber(analytics.saves),
      contactClicks: toNumber(analytics.contactClicks),
      roiPercent:
        toNumber(analytics.roiPercent) ??
        toNumber(investment.expectedROI) ??
        toNumber(raw.roiPercent) ??
        toNumber(raw.roi) ??
        toNumber(raw.ROI),
      appreciationRate:
        toNumber(analytics.appreciationRate) ??
        toNumber(investment.appreciationRate) ??
        toNumber(raw.appreciationRate) ??
        toNumber(raw.appreciationPercent),
      pricePerSqft: toNumber(analytics.pricePerSqft) ?? toNumber(raw.pricePerSqft),
    },
    topography: {
      slope: toString(topography.slope),
      elevation: toNumber(topography.elevation),
    },
    climateRisk: {
      floodRisk: toBoolean(climateRisk.floodRisk),
      droughtRisk: toBoolean(climateRisk.droughtRisk),
    },
    investment: {
      expectedROI: toNumber(investment.expectedROI) ?? toNumber(analytics.roiPercent) ?? toNumber(raw.roiPercent),
      appreciationRate:
        toNumber(investment.appreciationRate) ??
        toNumber(analytics.appreciationRate) ??
        toNumber(raw.appreciationRate),
    },
    pricePerSqft: toNumber(raw.pricePerSqft) ?? toNumber(analytics.pricePerSqft),
    mapLink: toString(location.googleMapLink) ?? toString(raw.mapLink),
    facing: toString(raw.facing) ?? toString(features.facing),
    floor: toNumber(raw.floor) ?? toString(raw.floor) ?? toString(features.floor),
    roiPercent:
      toNumber(raw.roiPercent) ??
      toNumber(analytics.roiPercent) ??
      toNumber(raw.roi) ??
      toNumber(raw.ROI),
    availabilityStatus:
      toString(raw.propertyStatus) ??
      toString(raw.availabilityStatus) ??
      (toBoolean(status.isActive) === false ? "Sold" : undefined) ??
      ((toString(status.approvalStatus) ?? "").toLowerCase() === "pending" ? "Pending" : undefined) ??
      "Available",
    statusDetails: {
      featured: toBoolean(status.featured),
      verified: toBoolean(status.verified),
      isActive: toBoolean(status.isActive),
      approvalStatus: toString(status.approvalStatus),
      postedAt: toString(status.postedAt),
    },
    soilType: toString(raw.soilType) ?? toString(soilAndFarming.soilType),
    location: {
      address: toString(location.address) ?? toString(raw.address),
      locality: toString(location.locality) ?? toString(raw.locality),
      city: toString(location.city) ?? toString(raw.city),
      state: toString(location.state) ?? toString(raw.state),
      pincode: toString(location.pincode) ?? toString(raw.pincode),
      googleMapLink: toString(location.googleMapLink),
      mapPreview: toString(location.mapPreview),
      distances: {
        airport: toNumber(distances.airport),
        railway: toNumber(distances.railway) ?? toNumber(distances.railwayStation),
        railwayStation: toNumber(distances.railwayStation) ?? toNumber(distances.railway),
        highway: toNumber(distances.highway),
        cityCenter: toNumber(distances.cityCenter),
      },
      nearbyFacilities: {
        schools: toStringArray(locationNearbyFacilities.schools),
        hospitals: toStringArray(locationNearbyFacilities.hospitals),
        markets: toStringArray(locationNearbyFacilities.markets),
        roads: toStringArray(locationNearbyFacilities.roads),
      },
      geoJSON: {
        type: toString(geoJSON.type),
        coordinates: Array.isArray(geoJSON.coordinates)
          ? geoJSON.coordinates.map((item) => Number(item)).filter((value) => Number.isFinite(value))
          : undefined,
      },
      coordinates: mapCoordinates,
    },
  };
};

const extractArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const direct = [
    record.data,
    record.properties,
    record.items,
    record.results,
    record.docs,
  ];

  for (const candidate of direct) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    const nestedCandidates = [
      nested.data,
      nested.properties,
      nested.items,
      nested.results,
      nested.docs,
    ];
    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
  }

  return [];
};

/** Normalizes list endpoints that return arrays or wrapped shapes like `{ data: { properties } }`. */
export function mapPropertyListPayload(payload: unknown): Property[] {
  return extractArray(payload).map(normalizeProperty);
}

export const fetchPropertiesAPI = async (page: number, limit: number) => {
  const res = await api.get(API_ENDPOINTS.PROPERTY.LIST, {
    params: {
      page,
      limit,
    },
  });
  const publicProperties = mapPropertyListPayload(res.data);

  if (publicProperties.length > 0) {
    return publicProperties;
  }

  // Fallback for authenticated users whose data is scoped to their account.
  try {
    const myRes = await api.get(API_ENDPOINTS.PROPERTY.MY_PROPERTIES);
    const myProperties = mapPropertyListPayload(myRes.data);
    if (myProperties.length > 0) {
      return myProperties;
    }
  } catch {
    // Keep silent: public listing may still legitimately be empty.
  }

  return publicProperties;
};

export const fetchPropertyByIdAPI = async (id: string) => {
  const res = await api.get(API_ENDPOINTS.PROPERTY.BY_ID(id));
  return normalizeProperty(res.data.data ?? res.data); // IMPORTANT: backend may wrap inside data
};

export const getNewProjects = async (): Promise<Property[]> => {
  const res = await api.get(API_ENDPOINTS.NEW.PROPERTIES);
  return mapPropertyListPayload(res.data);
};

export const approvePropertyAPI = async (id: string) => {
  const res = await api.get(API_ENDPOINTS.PROPERTY.APPROVE(id));
  return normalizeProperty(res.data.data ?? res.data); // IMPORTANT: backend may wrap inside data
};

