import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import {
  createListingAPI,
  updateListingAPI,
  type SellerListingPayload,
} from "../seller/sellerAPI";
import { fetchPropertyByIdAPI } from "../properties/propertyAPI";
import type { Property } from "../properties/propertyType";
import {
  clearPostPropertyDraft,
  loadPostPropertyDraft,
  savePostPropertyDraft,
} from "./postPropertyStorage";
import {
  isBackendPropertyType,
  type AmenitiesState,
  type BasicDetails,
  type LocationDetails,
  type MediaItem,
  type MediaState,
  type PostPropertyState,
  type PostPropertyStepKey,
  type ProfileDetails,
} from "./postPropertyTypes";

const emptyBasicDetails: BasicDetails = {
  listingType: "",
  category: "",
  propertyType: "",
  title: "",
  shortDescription: "",
  contactName: "",
  contactEmail: "",
  contactMobile: "",
  mobileVerified: false,
};

const emptyLocationDetails: LocationDetails = {
  state: "",
  city: "",
  district: "",
  tehsil: "",
  village: "",
  address: "",
  landmark: "",
  locality: "",
  surveyNumber: "",
  pinCode: "",
  latitude: null,
  longitude: null,
};

const emptyProfileDetails: ProfileDetails = {
  totalArea: null,
  areaUnit: "acre",
  price: null,
  negotiable: false,
  bedrooms: null,
  bathrooms: null,
  floor: "",
  furnishing: "",
  facing: "",
  parking: null,
  powerBackup: null,
  security: null,
  constructionAllowed: null,
  farmhouseBuilt: null,
  ownershipType: "",
  landRegistry: null,
  ownershipDocs: null,
  encumbrance: null,
  landUseType: "",
  waterAvailability: null,
  waterAvailabilityText: "",
  borewell: null,
  irrigation: null,
  borewellDepth: null,
  nearbySources: "",
  electricityAvailability: null,
  roadAccess: null,
  roadType: "",
  gated: null,
  airportDistance: null,
  railwayDistance: null,
  highwayDistance: null,
  cityCenterDistance: null,
  nearbySchools: "",
  nearbyHospitals: "",
  nearbyMarkets: "",
  soilType: "",
  soilQualityIndex: null,
  annualRainfall: null,
  irrigationSupport: null,
  farmingPercentage: null,
  suitableFor: [],
  roiPercent: null,
  appreciationRate: null,
  description: "",
};

const emptyMedia: MediaState = {
  images: [],
  documents: [],
  videoUrl: "",
  uploading: false,
  uploadError: null,
};

const emptyAmenities: AmenitiesState = {
  borewell: false,
  dripIrrigation: false,
  fencing: false,
  electricityConnection: false,
  farmRoad: false,
  nearbyHighway: false,
  storageFacility: false,
  security: false,
};

const initial: PostPropertyState = {
  basicDetails: emptyBasicDetails,
  locationDetails: emptyLocationDetails,
  profileDetails: emptyProfileDetails,
  media: emptyMedia,
  amenities: emptyAmenities,
  draftState: { lastSavedAt: null, isDirty: false },
  completedSteps: {
    basic: false,
    location: false,
    profile: false,
    media: false,
    amenities: false,
    review: false,
  },
  submitLoading: false,
  submitError: null,
  editPropertyId: null,
};

function hydrateInitialState(): PostPropertyState {
  const draft = loadPostPropertyDraft();
  if (!draft) return initial;
  return {
    ...initial,
    ...draft,
    basicDetails: { ...emptyBasicDetails, ...(draft.basicDetails ?? {}) },
    locationDetails: { ...emptyLocationDetails, ...(draft.locationDetails ?? {}) },
    profileDetails: { ...emptyProfileDetails, ...(draft.profileDetails ?? {}) },
    media: {
      ...emptyMedia,
      ...(draft.media ?? {}),
      images: draft.media?.images ?? [],
      documents: draft.media?.documents ?? [],
    },
    amenities: { ...emptyAmenities, ...(draft.amenities ?? {}) },
    draftState: {
      lastSavedAt: draft.draftState?.lastSavedAt ?? null,
      isDirty: false,
    },
    completedSteps: {
      ...initial.completedSteps,
      ...(draft.completedSteps ?? {}),
    },
  };
}

function sanitizeForApi<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForApi(item))
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          !(typeof item === "string" && item.trim().toLowerCase() === "undefined")
      ) as T;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => [key, sanitizeForApi(nestedValue)] as const)
      .filter(([, nestedValue]) => {
        if (nestedValue === undefined) return false;
        if (typeof nestedValue === "string" && nestedValue.trim().toLowerCase() === "undefined") {
          return false;
        }
        if (
          nestedValue &&
          typeof nestedValue === "object" &&
          !Array.isArray(nestedValue) &&
          Object.keys(nestedValue as Record<string, unknown>).length === 0
        ) {
          return false;
        }
        return true;
      });

    return Object.fromEntries(entries) as T;
  }

  if (typeof value === "string" && value.trim().toLowerCase() === "undefined") {
    return undefined as T;
  }

  return value;
}

function isValidObjectId(value: string | null | undefined): value is string {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

export const submitPostProperty = createAsyncThunk<
  unknown,
  void,
  { state: RootState; rejectValue: string }
>("postProperty/submit", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().postProperty;

    const imageUrls = state.media.images.map((i) => i.url).filter(Boolean);

    if (!imageUrls.length) {
      return rejectWithValue("Please add at least one image before submitting.");
    }

    // Map UI category/subtype → backend enum (see Property-Sales-BE propertyModel.propertyType)
    const propertyType = (() => {
      const cat = state.basicDetails.category;
      const pt = state.basicDetails.propertyType.trim();
      if (pt && isBackendPropertyType(pt)) return pt;

      if (cat === "Agriculture Land") return "Agriculture Land";
      if (cat === "Farmhouse") return "Farmhouse";
      if (cat === "Agri Resort") return "Resort";
      if (cat === "Residential") {
        if (pt === "Plot" || pt === "House" || pt === "Apartment") return pt;
        return "House";
      }
      if (cat === "Commercial") return "Commercial";
      return "Farmhouse";
    })();

    const listingType: "sale" | "rent" =
      state.basicDetails.listingType === "rent" ? "rent" : "sale";

    // Map to existing backend payload shape used by seller listings.
    // Extended fields are persisted in the draft for now; backend integration
    // can be expanded later without changing the UI contract.
    const payload = {
      title: state.basicDetails.title,
      address: [
        state.locationDetails.address,
        state.locationDetails.landmark,
        state.locationDetails.locality,
        state.locationDetails.village,
        state.locationDetails.tehsil,
        state.locationDetails.district,
        state.locationDetails.city,
        state.locationDetails.state,
        state.locationDetails.pinCode,
      ]
        .filter(Boolean)
        .join(", "),
      city: state.locationDetails.city,
      state: state.locationDetails.state,
      pincode: state.locationDetails.pinCode,
      locality: state.locationDetails.locality,
      price: state.profileDetails.price ?? 0,
      size: state.profileDetails.totalArea ?? undefined,
      beds: state.profileDetails.bedrooms ?? undefined,
      baths: state.profileDetails.bathrooms ?? undefined,
      parking: state.profileDetails.parking == null ? undefined : state.profileDetails.parking ? 1 : 0,
      images: imageUrls,
      propertyType,
      listingType,
      description: state.profileDetails.description,
      shortDescription: state.basicDetails.shortDescription,
      latitude: state.locationDetails.latitude ?? 0,
      longitude: state.locationDetails.longitude ?? 0,
      area: state.profileDetails.totalArea ?? undefined,
      areaUnit: state.profileDetails.areaUnit,
      landSize: state.profileDetails.totalArea ?? undefined,
      location: {
        address: state.locationDetails.address,
        locality: state.locationDetails.locality,
        city: state.locationDetails.city,
        state: state.locationDetails.state,
        pincode: state.locationDetails.pinCode,
        distances: {
          airport: state.profileDetails.airportDistance ?? undefined,
          railway: state.profileDetails.railwayDistance ?? undefined,
          highway: state.profileDetails.highwayDistance ?? undefined,
          cityCenter: state.profileDetails.cityCenterDistance ?? undefined,
        },
        nearbyFacilities: {
          schools: state.profileDetails.nearbySchools
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          hospitals: state.profileDetails.nearbyHospitals
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          markets: state.profileDetails.nearbyMarkets
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        },
        coordinates:
          state.locationDetails.latitude != null && state.locationDetails.longitude != null
            ? { lat: state.locationDetails.latitude, lng: state.locationDetails.longitude }
            : undefined,
      },
      features: {
        parking: state.profileDetails.parking,
        powerBackup: state.profileDetails.powerBackup,
        security: state.profileDetails.security,
        constructionAllowed: state.profileDetails.constructionAllowed,
        farmhouseBuilt: state.profileDetails.farmhouseBuilt,
        facing: state.profileDetails.facing || undefined,
        floor: state.profileDetails.floor || undefined,
      },
      legal: {
        landRegistry: state.profileDetails.landRegistry,
        ownershipDocs: state.profileDetails.ownershipDocs,
        encumbrance: state.profileDetails.encumbrance,
        landUseType: state.profileDetails.landUseType || undefined,
        constructionAllowed: state.profileDetails.constructionAllowed,
      },
      waterResources: {
        borewell: state.profileDetails.borewell,
        borewellDepth: state.profileDetails.borewellDepth ?? undefined,
        waterAvailability: (() => {
          const raw = (state.profileDetails.waterAvailabilityText || "").trim().toLowerCase();
          if (raw === "high" || raw === "good") return "High";
          if (raw === "medium" || raw === "moderate") return "Medium";
          if (raw === "low" || raw === "limited" || raw === "poor") return "Low";
          if (state.profileDetails.waterAvailability == null) return undefined;
          return state.profileDetails.waterAvailability ? "High" : "Low";
        })(),
        irrigation: state.profileDetails.irrigation,
        nearbySources: state.profileDetails.nearbySources
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      },
      infrastructure: {
        electricityAvailable: state.profileDetails.electricityAvailability,
        roadAccess: state.profileDetails.roadAccess,
        roadType: state.profileDetails.roadType || undefined,
        fencing: state.amenities.fencing,
        gated: state.profileDetails.gated,
      },
      soilAndFarming: {
        soilType: state.profileDetails.soilType || undefined,
        soilQualityIndex: state.profileDetails.soilQualityIndex ?? undefined,
        cropSuitability: state.profileDetails.suitableFor,
        ...(state.profileDetails.annualRainfall != null || state.profileDetails.irrigationSupport != null
          ? {
              rainfallData: {
                annualRainfall: state.profileDetails.annualRainfall ?? undefined,
                irrigationSupport: state.profileDetails.irrigationSupport ?? undefined,
              },
            }
          : {}),
        farmingPercentage: state.profileDetails.farmingPercentage ?? undefined,
      },
      investment: {
        expectedROI: state.profileDetails.roiPercent ?? undefined,
        appreciationRate: state.profileDetails.appreciationRate ?? undefined,
      },
    };

    const cleanedPayload = sanitizeForApi(payload);

    const created = state.editPropertyId
      ? isValidObjectId(state.editPropertyId)
        ? await updateListingAPI(
          state.editPropertyId,
          cleanedPayload as unknown as Partial<SellerListingPayload>,
        )
        : (() => {
            throw new Error("Invalid property id for update");
          })()
      : await createListingAPI(cleanedPayload as unknown as SellerListingPayload);
    clearPostPropertyDraft();
    return created;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: unknown; status?: number };
      message?: string;
    };

    const data = err.response?.data;
    const serverMessage = (() => {
      if (data && typeof data === "object" && data !== null && "message" in data) {
        const m = (data as { message?: unknown }).message;
        if (typeof m === "string") return m;
      }
      if (typeof err.message === "string") return err.message;
      return null;
    })();

    const serverDataText = (() => {
      if (data == null) return null;
      if (typeof data === "string") return data;
      try {
        return JSON.stringify(data);
      } catch {
        return String(data);
      }
    })();

    const detail =
      serverMessage ??
      serverDataText ??
      (err.response?.status ? `Server error (${err.response.status})` : null) ??
      "Failed to submit property";
    const message = `Submission failed${err.response?.status ? ` (${err.response.status})` : ""}: ${detail}`;
    return rejectWithValue(message);
  }
});

const categoryFromPropertyType = (propertyType: string): BasicDetails["category"] => {
  if (propertyType === "Agriculture Land" || propertyType === "Farmland") {
    return "Agriculture Land";
  }
  if (propertyType === "Resort") return "Agri Resort";
  if (["Plot", "House", "Apartment", "Flat", "Villa"].includes(propertyType)) {
    return "Residential";
  }
  if (propertyType === "Commercial") return "Commercial";
  return "Farmhouse";
};

const mapPropertyToEditState = (property: Property): PostPropertyState => {
  const category = categoryFromPropertyType(property.propertyType ?? "");
  const mapDetails = property.location ?? {};
  const mapCoordinates = Array.isArray(mapDetails.coordinates)
    ? { lat: mapDetails.coordinates[0], lng: mapDetails.coordinates[1] }
    : mapDetails.coordinates;
  const images = (property.media?.images ?? property.images ?? []).filter(Boolean);
  const amenities = property.amenities ?? [];
  const hasAmenity = (key: string) => amenities.some((value) => value.toLowerCase().includes(key));
  const rawArea = property.area ?? property.landSize ?? null;
  const totalArea =
    typeof rawArea === "number"
      ? rawArea
      : typeof rawArea === "string"
      ? Number(rawArea) || null
      : null;
  const areaUnit = ["acre", "hectare", "sqft"].includes(property.areaUnit ?? "")
    ? (property.areaUnit as ProfileDetails["areaUnit"])
    : "acre";

  return {
    ...initial,
    basicDetails: {
      ...emptyBasicDetails,
      listingType: property.listingType === "rent" ? "rent" : "sell",
      category,
      propertyType: property.propertyType ?? "",
      title: property.title ?? "",
      shortDescription: property.shortDescription ?? "",
      contactName:
        property.ownerDetails?.name ??
        property.dealer?.name ??
        property.seller?.name ??
        "",
      contactEmail: property.seller?.email ?? "",
      contactMobile:
        property.ownerDetails?.phone ??
        property.dealer?.phone ??
        property.seller?.phone ??
        "",
    },
    locationDetails: {
      ...emptyLocationDetails,
      state: mapDetails.state ?? "",
      city: mapDetails.city ?? "",
      district: "",
      locality: mapDetails.locality ?? "",
      address: mapDetails.address ?? property.address ?? "",
      landmark: "",
      pinCode: mapDetails.pincode ?? "",
      latitude: mapCoordinates?.lat ?? null,
      longitude: mapCoordinates?.lng ?? null,
    },
    profileDetails: {
      ...emptyProfileDetails,
      totalArea,
      areaUnit,
      price: property.price ?? null,
      bedrooms:
        typeof property.bedrooms === "number"
          ? property.bedrooms
          : typeof property.beds === "number"
          ? property.beds
          : null,
      bathrooms:
        typeof property.bathrooms === "number"
          ? property.bathrooms
          : typeof property.baths === "number"
          ? property.baths
          : null,
      floor: String(property.features?.floor ?? property.floor ?? ""),
      furnishing: "",
      facing: String(property.features?.facing ?? property.facing ?? ""),
      parking:
        typeof property.features?.parking === "boolean"
          ? property.features.parking
          : typeof property.parking === "number"
          ? property.parking > 0
          : null,
      powerBackup:
        typeof property.features?.powerBackup === "boolean" ? property.features.powerBackup : null,
      security: typeof property.features?.security === "boolean" ? property.features.security : null,
      constructionAllowed:
        typeof property.features?.constructionAllowed === "boolean"
          ? property.features.constructionAllowed
          : typeof property.legal?.constructionAllowed === "boolean"
          ? property.legal.constructionAllowed
          : null,
      farmhouseBuilt:
        typeof property.features?.farmhouseBuilt === "boolean" ? property.features.farmhouseBuilt : null,
      landRegistry:
        typeof property.legal?.landRegistry === "boolean" ? property.legal.landRegistry : null,
      ownershipDocs:
        typeof property.legal?.ownershipDocs === "boolean" ? property.legal.ownershipDocs : null,
      encumbrance:
        typeof property.legal?.encumbrance === "boolean" ? property.legal.encumbrance : null,
      landUseType: property.legal?.landUseType ?? "",
      waterAvailability:
        typeof property.waterResources?.waterAvailability === "string"
          ? property.waterResources.waterAvailability.toLowerCase() === "good"
          : null,
      waterAvailabilityText: property.waterResources?.waterAvailability ?? "",
      borewell: typeof property.waterResources?.borewell === "boolean" ? property.waterResources.borewell : null,
      irrigation: typeof property.waterResources?.irrigation === "boolean" ? property.waterResources.irrigation : null,
      borewellDepth: property.waterResources?.borewellDepth ?? null,
      nearbySources: (property.waterResources?.nearbySources ?? []).join(", "),
      electricityAvailability:
        typeof property.infrastructure?.electricityAvailable === "boolean"
          ? property.infrastructure.electricityAvailable
          : null,
      roadAccess:
        typeof property.infrastructure?.roadAccess === "boolean"
          ? property.infrastructure.roadAccess
          : null,
      roadType: property.infrastructure?.roadType ?? "",
      gated: typeof property.infrastructure?.gated === "boolean" ? property.infrastructure.gated : null,
      airportDistance: property.location?.distances?.airport ?? property.infrastructure?.distances?.airport ?? null,
      railwayDistance:
        property.location?.distances?.railway ??
        property.location?.distances?.railwayStation ??
        property.infrastructure?.distances?.railway ??
        null,
      highwayDistance: property.location?.distances?.highway ?? property.infrastructure?.distances?.highway ?? null,
      cityCenterDistance:
        property.location?.distances?.cityCenter ?? property.infrastructure?.distances?.cityCenter ?? null,
      nearbySchools:
        (property.location?.nearbyFacilities?.schools ??
          property.infrastructure?.nearbyFacilities?.schools ??
          []
        ).join(", "),
      nearbyHospitals:
        (property.location?.nearbyFacilities?.hospitals ??
          property.infrastructure?.nearbyFacilities?.hospitals ??
          []
        ).join(", "),
      nearbyMarkets:
        (property.location?.nearbyFacilities?.markets ??
          property.infrastructure?.nearbyFacilities?.markets ??
          []
        ).join(", "),
      soilType: (property.soilType as ProfileDetails["soilType"]) ?? "",
      soilQualityIndex: property.soilAndFarming?.soilQualityIndex ?? null,
      annualRainfall:
        typeof property.soilAndFarming?.rainfallData === "object"
          ? property.soilAndFarming.rainfallData?.annualRainfall ?? null
          : null,
      irrigationSupport:
        typeof property.soilAndFarming?.rainfallData === "object"
          ? property.soilAndFarming.rainfallData?.irrigationSupport ?? null
          : null,
      farmingPercentage:
        property.soilAndFarming?.farmingPercentage ?? property.soilAndFarming?.farmingPercent ?? null,
      suitableFor: (property.soilAndFarming?.cropSuitability ?? []).filter(
        (value): value is ProfileDetails["suitableFor"][number] =>
          ["Farming", "Resort", "Investment", "Farmhouse"].includes(value)
      ),
      roiPercent: property.investment?.expectedROI ?? property.analytics?.roiPercent ?? property.roiPercent ?? null,
      appreciationRate: property.investment?.appreciationRate ?? property.analytics?.appreciationRate ?? null,
      description: property.description ?? "",
    },
    media: {
      ...emptyMedia,
      images: images.map((url, index) => ({
        id: `edit-${index}-${Date.now()}`,
        url,
        source: "remote",
      })),
      videoUrl: property.media?.videos?.[0] ?? "",
    },
    amenities: {
      borewell: hasAmenity("borewell"),
      dripIrrigation: hasAmenity("drip"),
      fencing: hasAmenity("fencing"),
      electricityConnection: hasAmenity("electric"),
      farmRoad: hasAmenity("road"),
      nearbyHighway: hasAmenity("highway"),
      storageFacility: hasAmenity("storage"),
      security: hasAmenity("security"),
    },
    completedSteps: {
      basic: true,
      location: true,
      profile: true,
      media: true,
      amenities: true,
      review: false,
    },
    draftState: { lastSavedAt: null, isDirty: false },
    submitLoading: false,
    submitError: null,
    editPropertyId: property._id,
  };
};

export const loadEditProperty = createAsyncThunk<
  PostPropertyState,
  string,
  { rejectValue: string }
>("postProperty/loadEditProperty", async (id, { rejectWithValue }) => {
  try {
    if (!isValidObjectId(id)) {
      return rejectWithValue("Invalid property id");
    }
    const property = await fetchPropertyByIdAPI(id);
    return mapPropertyToEditState(property);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return rejectWithValue(err.message ?? "Failed to load property for edit");
  }
});

const postPropertySlice = createSlice({
  name: "postProperty",
  initialState: hydrateInitialState(),
  reducers: {
    hydrateFromAuth(
      state,
      action: PayloadAction<{ name?: string; email?: string }>
    ) {
      state.basicDetails.contactName =
        state.basicDetails.contactName || action.payload.name || "";
      state.basicDetails.contactEmail =
        state.basicDetails.contactEmail || action.payload.email || "";
    },
    updateBasicDetails(state, action: PayloadAction<Partial<BasicDetails>>) {
      state.basicDetails = { ...state.basicDetails, ...action.payload };
      state.draftState.isDirty = true;
    },
    updateLocationDetails(
      state,
      action: PayloadAction<Partial<LocationDetails>>
    ) {
      state.locationDetails = { ...state.locationDetails, ...action.payload };
      state.draftState.isDirty = true;
    },
    updateProfileDetails(state, action: PayloadAction<Partial<ProfileDetails>>) {
      state.profileDetails = { ...state.profileDetails, ...action.payload };
      state.draftState.isDirty = true;
    },
    setAmenities(state, action: PayloadAction<Partial<AmenitiesState>>) {
      state.amenities = { ...state.amenities, ...action.payload };
      state.draftState.isDirty = true;
    },
    addImages(state, action: PayloadAction<MediaItem[]>) {
      state.media.images = [...state.media.images, ...action.payload];
      state.draftState.isDirty = true;
    },
    removeImage(state, action: PayloadAction<string>) {
      state.media.images = state.media.images.filter((i) => i.id !== action.payload);
      state.draftState.isDirty = true;
    },
    setDocuments(state, action: PayloadAction<MediaItem[]>) {
      state.media.documents = action.payload;
      state.draftState.isDirty = true;
    },
    setMediaUploading(state, action: PayloadAction<boolean>) {
      state.media.uploading = action.payload;
    },
    setMediaUploadError(state, action: PayloadAction<string | null>) {
      state.media.uploadError = action.payload;
    },
    setVideoUrl(state, action: PayloadAction<string>) {
      state.media.videoUrl = action.payload;
      state.draftState.isDirty = true;
    },
    markStepCompleted(state, action: PayloadAction<PostPropertyStepKey>) {
      state.completedSteps[action.payload] = true;
      state.draftState.isDirty = true;
    },
    markDraftSaved(state) {
      state.draftState.lastSavedAt = Date.now();
      state.draftState.isDirty = false;
      savePostPropertyDraft(state);
    },
    saveDraftNow(state) {
      state.draftState.lastSavedAt = Date.now();
      state.draftState.isDirty = false;
      savePostPropertyDraft(state);
    },
    resetPostProperty(state) {
      Object.assign(state, initial);
      clearPostPropertyDraft();
    },
    setEditPropertyId(state, action: PayloadAction<string | null>) {
      state.editPropertyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPostProperty.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitPostProperty.fulfilled, (state) => {
        state.submitLoading = false;
        state.submitError = null;
        Object.assign(state, initial);
      })
      .addCase(submitPostProperty.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload ?? "Failed to submit property";
      })
      .addCase(loadEditProperty.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(loadEditProperty.fulfilled, (_state, action) => {
        return action.payload;
      })
      .addCase(loadEditProperty.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload ?? "Failed to load property";
      });
  },
});

export const {
  hydrateFromAuth,
  updateBasicDetails,
  updateLocationDetails,
  updateProfileDetails,
  setAmenities,
  addImages,
  removeImage,
  setDocuments,
  setMediaUploading,
  setMediaUploadError,
  setVideoUrl,
  markStepCompleted,
  markDraftSaved,
  saveDraftNow,
  resetPostProperty,
  setEditPropertyId,
} = postPropertySlice.actions;

export default postPropertySlice.reducer;

