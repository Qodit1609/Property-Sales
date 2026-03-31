import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Property } from "../properties/propertyType";
import {
  fetchMyListingsAPI,
  createListingAPI,
  updateListingAPI,
  deleteMyListingAPI,
  type SellerListingPayload,
} from "./sellerAPI";

interface SellerState {
  listings: Property[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}

const initialState: SellerState = {
  listings: [],
  loading: false,
  error: null,
  actionLoading: false,
};

export const fetchMyListings = createAsyncThunk<
  Property[],
  void,
  { rejectValue: string }
>("seller/fetchMyListings", async (_, { rejectWithValue }) => {
  try {
    return await fetchMyListingsAPI();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to fetch your listings";
    return rejectWithValue(message);
  }
});

export const createListing = createAsyncThunk<
  Property,
  SellerListingPayload,
  { rejectValue: string }
>("seller/createListing", async (payload, { rejectWithValue }) => {
  try {
    return await createListingAPI(payload);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to create listing";
    return rejectWithValue(message);
  }
});

export const updateListing = createAsyncThunk<
  Property,
  { id: string; payload: Partial<SellerListingPayload> },
  { rejectValue: string }
>("seller/updateListing", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateListingAPI(id, payload);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to update listing";
    return rejectWithValue(message);
  }
});

export const deleteListing = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("seller/deleteListing", async (id, { rejectWithValue }) => {
  try {
    await deleteMyListingAPI(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to delete listing";
    return rejectWithValue(message);
  }
});

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch your listings";
      })

      .addCase(createListing.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.listings.unshift(action.payload);
      })
      .addCase(createListing.rejected, (state) => {
        state.actionLoading = false;
      })

      .addCase(updateListing.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.listings = state.listings.map((listing) =>
          listing._id === updated._id ? updated : listing
        );
      })
      .addCase(updateListing.rejected, (state) => {
        state.actionLoading = false;
      })

      .addCase(deleteListing.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload
        );
      })
      .addCase(deleteListing.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export default sellerSlice.reducer;

