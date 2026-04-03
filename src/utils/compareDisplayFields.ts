import type { Property } from "../features/properties/propertyType";
import { formatSpecValue } from "./comparePropertySpecs";

export type CompareSectionDef = {
  title: string;
  rows: CompareRowDef[];
};

export type CompareRowDef = {
  key: string;
  label: string;
  paths?: string[];
  getFromProperty?: (p: Property) => unknown;
};

function firstFormattedFromFlat(
  flat: Record<string, unknown>,
  paths: string[]
): string {
  for (const path of paths) {
    if (Object.prototype.hasOwnProperty.call(flat, path)) {
      const s = formatSpecValue(flat[path]);
      if (s !== "\u2014") return s;
    }
  }
  return "\u2014";
}

export function resolveCompareRowValue(
  row: CompareRowDef,
  property: Property,
  flat: Record<string, unknown>
): string {
  if (row.getFromProperty) {
    return formatSpecValue(row.getFromProperty(property));
  }
  if (row.paths?.length) {
    return firstFormattedFromFlat(flat, row.paths);
  }
  return "\u2014";
}

/** Ordered sections and rows — display-only; does not alter compare flattening. */
export const COMPARE_DISPLAY_SECTIONS: CompareSectionDef[] = [
  {
    title: "Core Property Data",
    rows: [
      {
        key: "core-title",
        label: "Title",
        getFromProperty: (p) => p.title,
      },
      {
        key: "core-propertyType",
        label: "PropertyType",
        paths: ["propertyType"],
      },
      {
        key: "core-listingType",
        label: "ListingType",
        paths: ["listingType"],
      },
      {
        key: "core-status",
        label: "Status",
        paths: ["status"],
      },
      {
        key: "core-price",
        label: "Price",
        paths: ["price"],
      },
      {
        key: "core-pricePerSqft",
        label: "PricePerSqft",
        paths: ["analytics.pricePerSqft", "pricePerSqft"],
      },
      {
        key: "core-area",
        label: "Area",
        paths: ["area", "size", "area_sqft"],
      },
      {
        key: "core-bedrooms",
        label: "Bedrooms",
        paths: ["bedrooms", "beds"],
      },
      {
        key: "core-bathrooms",
        label: "Bathrooms",
        paths: ["bathrooms", "baths"],
      },
      {
        key: "core-floor",
        label: "Floor",
        paths: ["features.floor", "floor"],
      },
      {
        key: "core-facing",
        label: "Facing",
        paths: ["features.facing", "facing"],
      },
    ],
  },
  {
    title: "Location",
    rows: [
      {
        key: "loc-address",
        label: "Address",
        paths: ["address", "location.address"],
      },
      {
        key: "loc-city",
        label: "City",
        paths: ["location.city", "city"],
      },
      {
        key: "loc-state",
        label: "State",
        paths: ["location.state", "state"],
      },
      {
        key: "loc-mapLink",
        label: "MapLink",
        paths: ["mapLink", "location.googleMapLink", "location.mapLink"],
      },
    ],
  },
  {
    title: "Infrastructure",
    rows: [
      {
        key: "infra-roadAccess",
        label: "RoadAccess",
        paths: ["infrastructure.roadAccess"],
      },
      {
        key: "infra-roadType",
        label: "RoadType",
        paths: ["infrastructure.roadType"],
      },
      {
        key: "infra-electricity",
        label: "Electricity",
        paths: ["infrastructure.electricityAvailable"],
      },
      {
        key: "infra-fencing",
        label: "Fencing",
        paths: ["infrastructure.fencing"],
      },
      {
        key: "infra-gated",
        label: "Gated",
        paths: ["infrastructure.gated"],
      },
    ],
  },
  {
    title: "Farming & Land",
    rows: [
      {
        key: "farm-soilType",
        label: "SoilType",
        paths: ["soilAndFarming.soilType", "soilType"],
      },
      {
        key: "farm-soilQualityIndex",
        label: "SoilQualityIndex",
        paths: ["soilAndFarming.soilQualityIndex"],
      },
      {
        key: "farm-cropSuitability",
        label: "CropSuitability",
        paths: ["soilAndFarming.cropSuitability"],
      },
      {
        key: "farm-farmingPercentage",
        label: "FarmingPercentage",
        paths: [
          "soilAndFarming.farmingPercentage",
          "soilAndFarming.farmingPercent",
        ],
      },
      {
        key: "farm-irrigationSupport",
        label: "IrrigationSupport",
        paths: [
          "soilAndFarming.rainfallData.irrigationSupport",
          "soilAndFarming.irrigationSupport",
        ],
      },
      {
        key: "farm-waterAvailability",
        label: "WaterAvailability",
        paths: ["waterResources.waterAvailability", "soilAndFarming.waterAvailability"],
      },
    ],
  },
  {
    title: "Water Resources",
    rows: [
      {
        key: "water-borewell",
        label: "Borewell",
        paths: ["waterResources.borewell", "waterResources.borewellAvailable"],
      },
      {
        key: "water-borewellDepth",
        label: "BorewellDepth",
        paths: ["waterResources.borewellDepth"],
      },
      {
        key: "water-irrigationSystem",
        label: "IrrigationSystem",
        paths: ["waterResources.irrigationSystem", "waterResources.irrigation"],
      },
      {
        key: "water-nearbySources",
        label: "NearbySources",
        paths: ["waterResources.nearbySources", "waterResources.nearbyWaterSources"],
      },
    ],
  },
  {
    title: "Legal",
    rows: [
      {
        key: "legal-ownershipDocs",
        label: "OwnershipDocs",
        paths: ["legal.ownershipDocs", "legal.ownershipDocuments"],
      },
      {
        key: "legal-landRegistry",
        label: "LandRegistry",
        paths: ["legal.landRegistry", "legal.landRegistryAvailable"],
      },
      {
        key: "legal-encumbranceFree",
        label: "EncumbranceFree",
        paths: ["legal.encumbranceFree", "legal.encumbrance"],
      },
      {
        key: "legal-landUseType",
        label: "LandUseType",
        paths: ["legal.landUseType"],
      },
    ],
  },
  {
    title: "Features",
    rows: [
      {
        key: "feat-powerBackup",
        label: "PowerBackup",
        paths: ["features.powerBackup"],
      },
      {
        key: "feat-security",
        label: "Security",
        paths: ["features.security"],
      },
      {
        key: "feat-constructionAllowed",
        label: "ConstructionAllowed",
        paths: ["features.constructionAllowed", "legal.constructionAllowed"],
      },
      {
        key: "feat-farmhouseBuilt",
        label: "FarmhouseBuilt",
        paths: ["features.farmhouseBuilt"],
      },
    ],
  },
];

export const COMPARE_DISPLAY_ROWS_FLAT: CompareRowDef[] =
  COMPARE_DISPLAY_SECTIONS.flatMap((s) => s.rows);
