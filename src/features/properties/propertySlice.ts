import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPropertiesAPI, fetchPropertyByIdAPI } from "./propertyAPI";
import type { Property } from "./propertyType";

interface PropertyState {
  data: Property[];
  loading: boolean;
  error: string | null;

  selectedProperty: Property | null;
  selectedLoading: boolean;
  selectedError: string | null;
}

const initialState: PropertyState = {
  data: [],
  loading: false,
  error: null,

  selectedProperty: null,
  selectedLoading: false,
  selectedError: null,
};

export const fetchProperties = createAsyncThunk<
  Property[],
  { page: number; limit: number },
  { rejectValue: string }
>("properties/fetchProperties", async ({ page, limit }, { rejectWithValue }) => {
  try {
    return await fetchPropertiesAPI(page, limit);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch properties";
    return rejectWithValue(message);
  }
});

export const fetchPropertyById = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("properties/fetchPropertyById", async (id, { rejectWithValue }) => {
  try {
    return await fetchPropertyByIdAPI(id);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch property details";
    return rejectWithValue(message);
  }
});

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch properties";
      })

      // Single Property
      .addCase(fetchPropertyById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError =
          action.payload ?? "Failed to fetch property details";
      });
  },
});

export default propertySlice.reducer;
