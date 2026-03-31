import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ManagedAccount } from "../auth/roleTypes";
import type { Property } from "../properties/propertyType";
import {
  fetchAdminUsersAPI,
  deleteAdminUserAPI,
  fetchAdminListingsAPI,
  fetchAllAdminListingsAPI,
  approveListingAPI,
  rejectListingAPI,
  deleteListingAPI,
  createAdminPropertyAPI,
  updateAdminPropertyAPI,
  type AdminListingsParams,
  type AdminListingsPagination,
  type AdminCreatePropertyPayload,
  type AdminUpdatePropertyPayload,
} from "./adminAPI";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface AdminState {
  users: ManagedAccount[];
  usersLoading: boolean;
  usersError: string | null;

  listings: Property[];
  listingsLoading: boolean;
  listingsError: string | null;
  listingsPagination: AdminListingsPagination;

  actionLoading: boolean;
  mutationError: string | null;

  notifications: AdminNotification[];
}

const defaultPagination = (): AdminListingsPagination => ({
  total: 0,
  page: 1,
  pages: 1,
  perPage: 10,
});

const initialState: AdminState = {
  users: [],
  usersLoading: false,
  usersError: null,

  listings: [],
  listingsLoading: false,
  listingsError: null,
  listingsPagination: defaultPagination(),

  actionLoading: false,
  mutationError: null,

  notifications: [],
};

export const fetchAdminUsers = createAsyncThunk<
  ManagedAccount[],
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
  Awaited<ReturnType<typeof fetchAdminListingsAPI>>,
  AdminListingsParams | void,
  { rejectValue: string }
>("admin/fetchListings", async (params, { rejectWithValue }) => {
  try {
    return await fetchAdminListingsAPI(
      params ?? { page: 1, limit: 100 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    const message = err.message ?? "Failed to fetch listings";
    return rejectWithValue(message);
  }
});

/** Loads all property rows for admin (paginates at 100 per request — server max). */
export const fetchAdminListingsAllPages = createAsyncThunk<
  Awaited<ReturnType<typeof fetchAllAdminListingsAPI>>,
  void,
  { rejectValue: string }
>("admin/fetchListingsAllPages", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllAdminListingsAPI();
  } catch (error: unknown) {
    const err = error as { message?: string };
    const message = err.message ?? "Failed to fetch listings";
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
    const err = error as { message?: string };
    const message = err.message ?? "Failed to approve listing";
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
    const err = error as { message?: string };
    const message = err.message ?? "Failed to reject listing";
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
    const err = error as { message?: string };
    const message = err.message ?? "Failed to delete listing";
    return rejectWithValue(message);
  }
});

export const createAdminProperty = createAsyncThunk<
  Property,
  AdminCreatePropertyPayload,
  { rejectValue: string }
>("admin/createProperty", async (payload, { rejectWithValue }) => {
  try {
    return await createAdminPropertyAPI(payload);
  } catch (error: unknown) {
    const err = error as { message?: string };
    const message = err.message ?? "Failed to create property";
    return rejectWithValue(message);
  }
});

export const updateAdminProperty = createAsyncThunk<
  Property,
  { id: string; payload: AdminUpdatePropertyPayload },
  { rejectValue: string }
>("admin/updateProperty", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateAdminPropertyAPI(id, payload);
  } catch (error: unknown) {
    const err = error as { message?: string };
    const message = err.message ?? "Failed to update property";
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
  reducers: {
    clearAdminMutationError(state) {
      state.mutationError = null;
    },
    addAdminNotification(
      state,
      action: PayloadAction<Omit<AdminNotification, "id" | "createdAt" | "read">>
    ) {
      state.notifications.unshift({
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        read: false,
      });
      if (state.notifications.length > 200) {
        state.notifications = state.notifications.slice(0, 200);
      }
    },
    markAdminNotificationRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    markAllAdminNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(fetchAdminListings.pending, (state) => {
        state.listingsLoading = true;
        state.listingsError = null;
      })
      .addCase(fetchAdminListings.fulfilled, (state, action) => {
        state.listingsLoading = false;
        state.listings = action.payload.items;
        state.listingsPagination = action.payload.pagination;
      })
      .addCase(fetchAdminListings.rejected, (state, action) => {
        state.listingsLoading = false;
        state.listingsError = action.payload ?? "Failed to fetch listings";
      })

      .addCase(fetchAdminListingsAllPages.pending, (state) => {
        state.listingsLoading = true;
        state.listingsError = null;
      })
      .addCase(fetchAdminListingsAllPages.fulfilled, (state, action) => {
        state.listingsLoading = false;
        state.listings = action.payload.items;
        state.listingsPagination = action.payload.pagination;
      })
      .addCase(fetchAdminListingsAllPages.rejected, (state, action) => {
        state.listingsLoading = false;
        state.listingsError = action.payload ?? "Failed to fetch listings";
      })

      .addCase(approveListing.pending, (state) => {
        state.actionLoading = true;
        state.mutationError = null;
      })
      .addCase(approveListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.listings = state.listings.map((listing) =>
          listing._id === updated._id ? updated : listing
        );
      })
      .addCase(approveListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.mutationError = action.payload ?? "Approve failed";
      })

      .addCase(rejectListing.pending, (state) => {
        state.actionLoading = true;
        state.mutationError = null;
      })
      .addCase(rejectListing.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.listings = state.listings.map((listing) =>
          listing._id === updated._id ? updated : listing
        );
      })
      .addCase(rejectListing.rejected, (state, action) => {
        state.actionLoading = false;
        state.mutationError = action.payload ?? "Reject failed";
      })

      .addCase(deleteListingById.pending, (state) => {
        state.actionLoading = true;
        state.mutationError = null;
      })
      .addCase(deleteListingById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload
        );
        state.listingsPagination.total = Math.max(
          0,
          state.listingsPagination.total - 1
        );
      })
      .addCase(deleteListingById.rejected, (state, action) => {
        state.actionLoading = false;
        state.mutationError = action.payload ?? "Delete failed";
      })

      .addCase(createAdminProperty.pending, (state) => {
        state.actionLoading = true;
        state.mutationError = null;
      })
      .addCase(createAdminProperty.fulfilled, (state, action) => {
        state.actionLoading = false;
        const p = action.payload;
        state.notifications.unshift({
          id: nanoid(),
          title: "New property added",
          message: `${p.title ?? "A listing"} has been added.`,
          createdAt: new Date().toISOString(),
          read: false,
        });
        if (state.notifications.length > 200) {
          state.notifications = state.notifications.slice(0, 200);
        }
      })
      .addCase(createAdminProperty.rejected, (state, action) => {
        state.actionLoading = false;
        state.mutationError = action.payload ?? "Create failed";
      })

      .addCase(updateAdminProperty.pending, (state) => {
        state.actionLoading = true;
        state.mutationError = null;
      })
      .addCase(updateAdminProperty.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.listings = state.listings.map((listing) =>
          listing._id === updated._id ? updated : listing
        );
      })
      .addCase(updateAdminProperty.rejected, (state, action) => {
        state.actionLoading = false;
        state.mutationError = action.payload ?? "Update failed";
      })

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

export const {
  clearAdminMutationError,
  addAdminNotification,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} = adminSlice.actions;
export default adminSlice.reducer;
