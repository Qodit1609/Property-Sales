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

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async ({ page, limit }: { page: number; limit: number }) => {
    return await fetchPropertiesAPI(page, limit);
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchPropertyById",
  async (id: string) => {
    return await fetchPropertyByIdAPI(id);
  }
);

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
        state.error = action.error.message || "Failed to fetch properties";
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
          action.error.message || "Failed to fetch property";
      });
  },
});

export default propertySlice.reducer;
