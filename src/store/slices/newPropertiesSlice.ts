import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { API_ENDPOINTS } from "../../lib/apiClient";

export interface Property {
  id: string;
  title?: string;
  propertyType?: string;
  city?: string;
  price?: number;
  coverImage?: string;
  dealerName?: string;
  postedTime?: string;
}

interface NewPropertiesState {
  data: Property[];
  loading: boolean;
  error: string | null;
}

const initialState: NewPropertiesState = {
  data: [],
  loading: false,
  error: null,
};

const getStringValue = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
};

const getNumberValue = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const getRecord = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getErrorMessage = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  const data = getRecord(value);
  return getStringValue(data.message) ?? getStringValue(data.error);
};

const normalizeProperty = (payload: unknown, index: number): Property => {
  const raw = getRecord(payload);
  const location = getRecord(raw.location);

  return {
    id: getStringValue(raw.id) ?? getStringValue(raw._id) ?? `new-property-${index}`,
    title: getStringValue(raw.title) ?? undefined,
    propertyType: getStringValue(raw.propertyType) ?? undefined,
    city: getStringValue(raw.city) ?? getStringValue(location.city) ?? undefined,
    price: getNumberValue(raw.price),
    coverImage: getStringValue(raw.coverImage) ?? undefined,
    dealerName: getStringValue(raw.dealerName) ?? undefined,
    postedTime: getStringValue(raw.postedTime) ?? undefined,
  };
};

const extractArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const root = getRecord(payload);
  const directCandidates = [root.data, root.properties, root.items, root.results];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  const nestedData = getRecord(root.data);
  const nestedCandidates = [
    nestedData.data,
    nestedData.properties,
    nestedData.items,
    nestedData.results,
  ];

  for (const candidate of nestedCandidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

export const fetchNewProperties = createAsyncThunk<
  Property[],
  void,
  { rejectValue: string }
>("newProperties/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.NEW.PROPERTIES);
    return extractArray(response.data).map((item, index) => normalizeProperty(item, index));
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { data?: unknown } }).response?.data
    ) {
      const responseData = (error as { response?: { data?: unknown } }).response?.data;
      return rejectWithValue(getErrorMessage(responseData) ?? "Something went wrong");
    }

    return rejectWithValue("Something went wrong");
  }
});

const newPropertiesSlice = createSlice({
  name: "newProperties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNewProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default newPropertiesSlice.reducer;
