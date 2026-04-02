import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createListingAPI, type SellerListingPayload } from "../seller/sellerAPI";
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
  contactName: "",
  contactEmail: "",
  contactMobile: "",
  mobileVerified: false,
};

const emptyLocationDetails: LocationDetails = {
  state: "",
  city: "",
  tehsil: "",
  village: "",
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
  ownershipType: "",
  waterAvailability: null,
  electricityAvailability: null,
  roadAccess: null,
  soilType: "",
  suitableFor: [],
  description: "",
};

const emptyMedia: MediaState = {
  images: [],
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
    media: { ...emptyMedia, ...(draft.media ?? {}), images: draft.media?.images ?? [] },
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
    const payload: SellerListingPayload = {
      title: state.basicDetails.title,
      address: [
        state.locationDetails.locality,
        state.locationDetails.village,
        state.locationDetails.tehsil,
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
      images: imageUrls,
      propertyType,
      listingType,
      description: state.profileDetails.description,
      latitude: state.locationDetails.latitude ?? 0,
      longitude: state.locationDetails.longitude ?? 0,
    };

    const created = await createListingAPI(payload);
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
  setMediaUploading,
  setMediaUploadError,
  setVideoUrl,
  markStepCompleted,
  markDraftSaved,
  saveDraftNow,
  resetPostProperty,
} = postPropertySlice.actions;

export default postPropertySlice.reducer;

