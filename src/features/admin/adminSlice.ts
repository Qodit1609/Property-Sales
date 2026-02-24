import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../users/userType";
import type { Property } from "../properties/propertyType";
import {
  fetchAdminUsersAPI,
  deleteAdminUserAPI,
  fetchAdminListingsAPI,
  approveListingAPI,
  rejectListingAPI,
  deleteListingAPI,
} from "./adminAPI";

interface AdminState {
  users: User[];
  usersLoading: boolean;
  usersError: string | null;

  listings: Property[];
  listingsLoading: boolean;
  listingsError: string | null;

  actionLoading: boolean;
}

const initialState: AdminState = {
  users: [],
  usersLoading: false,
  usersError: null,
  listings: [],
  listingsLoading: false,
  listingsError: null,
  actionLoading: false,
};

export const fetchAdminUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await fetchAdminUsersAPI();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to fetch users";
    return rejectWithValue(message);
  }
});

export const fetchAdminListings = createAsyncThunk<
  Property[],
  void,
  { rejectValue: string }
>("admin/fetchListings", async (_, { rejectWithValue }) => {
  try {
    return await fetchAdminListingsAPI();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to fetch listings";
    return rejectWithValue(message);
  }
});

export const approveListing = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("admin/approveListing", async (id, { rejectWithValue }) => {
  try {
    return await approveListingAPI(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to approve listing";
    return rejectWithValue(message);
  }
});

export const rejectListing = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("admin/rejectListing", async (id, { rejectWithValue }) => {
  try {
    return await rejectListingAPI(id);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to reject listing";
    return rejectWithValue(message);
  }
});

export const deleteListingById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteListing", async (id, { rejectWithValue }) => {
  try {
    await deleteListingAPI(id);
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to delete listing";
    return rejectWithValue(message);
  }
});

export const deleteUserById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    await deleteAdminUserAPI(userId);
    return userId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to delete user";
    return rejectWithValue(message);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload ?? "Failed to fetch users";
      })

      // Listings
      .addCase(fetchAdminListings.pending, (state) => {
        state.listingsLoading = true;
        state.listingsError = null;
      })
      .addCase(fetchAdminListings.fulfilled, (state, action) => {
        state.listingsLoading = false;
        state.listings = action.payload;
      })
      .addCase(fetchAdminListings.rejected, (state, action) => {
        state.listingsLoading = false;
        state.listingsError = action.payload ?? "Failed to fetch listings";
      })

      // Approve
      .addCase(approveListing.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(approveListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.listings = state.listings.map((listing) =>
          listing._id === updated._id ? updated : listing
        );
      })
      .addCase(approveListing.rejected, (state) => {
        state.actionLoading = false;
      })

      // Reject
      .addCase(rejectListing.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(rejectListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.listings = state.listings.map((listing) =>
          listing._id === updated._id ? updated : listing
        );
      })
      .addCase(rejectListing.rejected, (state) => {
        state.actionLoading = false;
      })

      // Delete listing
      .addCase(deleteListingById.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteListingById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload
        );
      })
      .addCase(deleteListingById.rejected, (state) => {
        state.actionLoading = false;
      })

      // Delete user
      .addCase(deleteUserById.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users = state.users.filter(
          (user) => String(user.id) !== action.payload
        );
      })
      .addCase(deleteUserById.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export default adminSlice.reducer;

