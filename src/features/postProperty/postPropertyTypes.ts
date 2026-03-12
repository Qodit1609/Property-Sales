export type ListingType = "sell" | "rent";

export type PropertyCategory =
  | "Agriculture Land"
  | "Farmhouse"
  | "Agri Resort"
  | "Residential"
  | "Commercial";

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
  contactName: string;
  contactEmail: string;
  contactMobile: string;
  mobileVerified: boolean;
};

export type LocationDetails = {
  state: string;
  city: string;
  tehsil: string;
  village: string;
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
  ownershipType: OwnershipType | "";
  waterAvailability: boolean | null;
  electricityAvailability: boolean | null;
  roadAccess: boolean | null;
  soilType: SoilType | "";
  suitableFor: SuitableFor[];
  description: string;
};

export type MediaItem = {
  id: string;
  url: string; // local preview or uploaded URL
  source: "local" | "remote";
  fileName?: string;
  sizeBytes?: number;
  mimeType?: string;
};

export type MediaState = {
  images: MediaItem[];
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
};

