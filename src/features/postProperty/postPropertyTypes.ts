export type ListingType = "sell" | "rent";

export type PropertyCategory =
  | "Agriculture Land"
  | "Farmhouse"
  | "Agri Resort"
  | "Residential"
  | "Commercial";

/** Must match Property-Sales-BE propertyModel.propertyType + utils/constants PROPERTY_TYPES */
export const BACKEND_PROPERTY_TYPES = [
  "Farmhouse",
  "Farmland",
  "Agriculture Land",
  "Resort",
  "Flat",
  "House",
  "Plot",
  "Villa",
  "Apartment",
  "Commercial",
  "Other",
] as const;

const BACKEND_PROPERTY_TYPE_SET = new Set<string>(BACKEND_PROPERTY_TYPES);

export function isBackendPropertyType(value: string): boolean {
  return BACKEND_PROPERTY_TYPE_SET.has(value.trim());
}

export type AreaUnit = "acre" | "hectare" | "sqft";

export type OwnershipType = "Freehold" | "Leasehold" | "Power of Attorney" | "Other";

export type SoilType = "Black" | "Red" | "Alluvial" | "Sandy" | "Other";

export type SuitableFor =
  | "Farming"
  | "Resort"
  | "Investment"
  | "Farmhouse";

export type AmenityKey =
  | "borewell"
  | "dripIrrigation"
  | "fencing"
  | "electricityConnection"
  | "farmRoad"
  | "nearbyHighway"
  | "storageFacility"
  | "security";

export type BasicDetails = {
  listingType: ListingType | "";
  category: PropertyCategory | "";
  propertyType: string;
  title: string;
  shortDescription: string;
  contactName: string;
  contactEmail: string;
  contactMobile: string;
  mobileVerified: boolean;
};

export type LocationDetails = {
  state: string;
  city: string;
  district: string;
  tehsil: string;
  village: string;
  address: string;
  landmark: string;
  locality: string;
  surveyNumber: string;
  pinCode: string;
  latitude: number | null;
  longitude: number | null;
};

export type ProfileDetails = {
  totalArea: number | null;
  areaUnit: AreaUnit;
  price: number | null;
  negotiable: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: string;
  furnishing: string;
  facing: string;
  parking: boolean | null;
  powerBackup: boolean | null;
  security: boolean | null;
  constructionAllowed: boolean | null;
  farmhouseBuilt: boolean | null;
  ownershipType: OwnershipType | "";
  landRegistry: boolean | null;
  ownershipDocs: boolean | null;
  encumbrance: boolean | null;
  landUseType: string;
  waterAvailability: boolean | null;
  waterAvailabilityText: string;
  borewell: boolean | null;
  irrigation: boolean | null;
  borewellDepth: number | null;
  nearbySources: string;
  electricityAvailability: boolean | null;
  roadAccess: boolean | null;
  roadType: string;
  gated: boolean | null;
  airportDistance: number | null;
  railwayDistance: number | null;
  highwayDistance: number | null;
  cityCenterDistance: number | null;
  nearbySchools: string;
  nearbyHospitals: string;
  nearbyMarkets: string;
  soilType: SoilType | "";
  soilQualityIndex: number | null;
  annualRainfall: number | null;
  irrigationSupport: boolean | null;
  farmingPercentage: number | null;
  suitableFor: SuitableFor[];
  roiPercent: number | null;
  appreciationRate: number | null;
  description: string;
};

export type MediaItem = {
  id: string;
  url: string; // local preview or uploaded URL
  source: "local" | "remote";
  fileName?: string;
  sizeBytes?: number;
  mimeType?: string;
  hash?: string;
};

export type MediaState = {
  images: MediaItem[];
  documents: MediaItem[];
  videoUrl?: string;
  uploading: boolean;
  uploadError: string | null;
};

export type AmenitiesState = Record<AmenityKey, boolean>;

export type DraftState = {
  lastSavedAt: number | null;
  isDirty: boolean;
};

export type PostPropertyStepKey =
  | "basic"
  | "location"
  | "profile"
  | "media"
  | "amenities"
  | "review";

export type PostPropertyState = {
  basicDetails: BasicDetails;
  locationDetails: LocationDetails;
  profileDetails: ProfileDetails;
  media: MediaState;
  amenities: AmenitiesState;
  draftState: DraftState;
  completedSteps: Record<PostPropertyStepKey, boolean>;
  submitLoading: boolean;
  submitError: string | null;
  editPropertyId: string | null;
};

