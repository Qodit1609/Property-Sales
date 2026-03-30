export interface Property {
  _id: string;
  /** Owner user id when present (admin APIs, seeded data). */
  sellerId?: string | null;
  title: string;
  description: string;
  shortDescription?: string;
  address: string;
  locationText?: string;
  price: number;
  images: string[];
  videos?: string[];
  propertyType: string;
  listingType?: "sale" | "rent" | string;
  status?: string;
  size?: number;
  area?: number;
  areaUnit?: "sqft" | "acre" | "bigha" | string;
  landSize?: number | string;
  landUnit?: "sqft" | "acre" | "bigha" | string;
  beds?: number | string;
  baths?: number | string;
  parking?: number | string;
  bedrooms?: number;
  bathrooms?: number;
  distanceFromIndore?: number;
  tags?: string[];
  amenities?: string[];
  createdAt?: string;
  postedAt?: string;
  featured?: boolean;
  verified?: boolean;
  ownerDetails?: {
    name: string;
    phone: string;
    type?: string;
    verified?: boolean;
  };

  dealer?: {
    name?: string;
    phone?: string;
    type?: string;
    verified?: boolean;
  };

  seller?: {
    name?: string;
    phone?: string;
    email?: string;
    verified?: boolean;
  };

  media?: {
    images?: string[];
    videos?: string[];
    droneView?: string | string[];
    mapPreview?: string;
    mapScreenshot?: string;
    gallery?: string[];
    videoUrl?: string;
  };

  features?: {
    parking?: string | number | boolean;
    powerBackup?: string | boolean;
    security?: string | boolean;
    constructionAllowed?: string | boolean;
    farmhouseBuilt?: string | boolean;
    facing?: string;
    floor?: string | number;
  };

  infrastructure?: {
    distances?: {
      airport?: number;
      railway?: number;
      railwayStation?: number;
      highway?: number;
      cityCenter?: number;
    };
    nearbyFacilities?: {
      schools?: string[];
      hospitals?: string[];
      markets?: string[];
      roads?: string[];
    };
    electricityAvailable?: string | boolean;
    roadAccess?: string | boolean;
    roadType?: string;
    fencing?: string | boolean;
    gated?: string | boolean;
  };

  legal?: {
    landRegistry?: string | boolean;
    landRegistryAvailable?: string | boolean;
    ownershipDocs?: string | boolean;
    ownershipDocuments?: string | boolean;
    encumbrance?: string | boolean;
    encumbranceFree?: string | boolean;
    landUseType?: string;
    constructionAllowed?: string | boolean;
  };

  soilAndFarming?: {
    soilType?: string;
    soilQualityIndex?: number;
    cropSuitability?: string[];
    rainfallData?:
      | string
      | {
          annualRainfall?: number;
          irrigationSupport?: boolean;
        };
    soilReportAvailable?: string | boolean;
    farmingPercent?: number;
    farmingPercentage?: number;
  };

  waterResources?: {
    borewell?: string | boolean;
    borewellAvailable?: string | boolean;
    borewellDepth?: number;
    waterAvailability?: string;
    irrigation?: string | boolean;
    irrigationSystem?: string | boolean;
    nearbySources?: string[];
    nearbyWaterSources?: string[];
    waterCertificateAvailable?: string | boolean;
  };

  analytics?: {
    views?: number;
    saves?: number;
    contactClicks?: number;
    roiPercent?: number;
    appreciationRate?: number;
    pricePerSqft?: number;
  };

  topography?: {
    slope?: string;
    elevation?: number;
  };

  climateRisk?: {
    floodRisk?: boolean;
    droughtRisk?: boolean;
  };

  investment?: {
    expectedROI?: number;
    appreciationRate?: number;
  };

  pricePerSqft?: number;
  mapLink?: string;
  facing?: string;
  floor?: string | number;
  roiPercent?: number;
  soilType?: string;

  location?: {
    address?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
    googleMapLink?: string;
    mapPreview?: string;
    distances?: {
      airport?: number;
      railway?: number;
      railwayStation?: number;
      highway?: number;
      cityCenter?: number;
    };
    nearbyFacilities?: {
      schools?: string[];
      hospitals?: string[];
      markets?: string[];
      roads?: string[];
    };
    geoJSON?: {
      type?: string;
      coordinates?: number[];
    };
    coordinates?: {
      lat?: number;
      lng?: number;
    } | [number, number];
  };

  statusDetails?: {
    featured?: boolean;
    verified?: boolean;
    isActive?: boolean;
    approvalStatus?: string;
    postedAt?: string;
  };
  availabilityStatus?: string;
}
