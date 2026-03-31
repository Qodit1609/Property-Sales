import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPropertyMediaAPI } from "./mediaAPI";
import type { MediaOrphan, PropertyMediaAsset } from "./mediaTypes";

interface MediaState {
  items: PropertyMediaAsset[];
  /** Cloudinary URLs with no propertyId — merged into the map by property list order (see selectors). */
  orphans: MediaOrphan[];
  loading: boolean;
  error: string | null;
}

const initialState: MediaState = {
  items: [],
  orphans: [],
  loading: false,
  error: null,
};

export const fetchPropertyMedia = createAsyncThunk<
  Awaited<ReturnType<typeof fetchPropertyMediaAPI>>,
  void,
  { rejectValue: string }
>("media/fetchPropertyMedia", async (_, { rejectWithValue }) => {
  try {
    return await fetchPropertyMediaAPI();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load property images";
    return rejectWithValue(message);
  }
});

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.linked;
        state.orphans = action.payload.orphans;
      })
      .addCase(fetchPropertyMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load property images";
      });
  },
});

export default mediaSlice.reducer;
