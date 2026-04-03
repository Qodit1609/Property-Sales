import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Property } from "../properties/propertyType";
import { propertyToMeta } from "./propertyToMeta";
import type {
  BuyerActivityItem,
  BuyerNotification,
  BuyerPreference,
  BuyerPropertyMeta,
  SavedSearch,
} from "./buyerTypes";

const MAX_COMPARE = 3;
const MAX_RECENT = 10;

export interface BuyerState {
  wishlistIds: string[];
  compareIds: string[];
  cartIds: string[];
  recentIds: string[];
  entities: Record<string, BuyerPropertyMeta>;
  savedSearches: SavedSearch[];
  preferences: BuyerPreference;
  activity: BuyerActivityItem[];
  notifications: BuyerNotification[];
  compareNotice: string | null;
  compareHighlightDiff: boolean;
}

export const initialBuyerState: BuyerState = {
  wishlistIds: [],
  compareIds: [],
  cartIds: [],
  recentIds: [],
  entities: {},
  savedSearches: [],
  preferences: {
    locations: [],
    propertyTypes: [],
    amenities: [],
    listingTypes: [],
  },
  activity: [],
  notifications: [],
  compareNotice: null,
  compareHighlightDiff: false,
};

const pushActivity = (
  state: BuyerState,
  activity: Omit<BuyerActivityItem, "id" | "timestamp">
) => {
  state.activity.unshift({
    ...activity,
    id: nanoid(),
    timestamp: new Date().toISOString(),
  });

  if (state.activity.length > 200) {
    state.activity = state.activity.slice(0, 200);
  }
};

const upsertEntity = (state: BuyerState, property: Property) => {
  state.entities[property._id] = propertyToMeta(property);
};

const buyerSlice = createSlice({
  name: "buyer",
  initialState: initialBuyerState,
  reducers: {
    clearCompareNotice(state) {
      state.compareNotice = null;
    },
    setCompareHighlightDiff(state, action: PayloadAction<boolean>) {
      state.compareHighlightDiff = action.payload;
    },

    toggleWishlist(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      upsertEntity(state, action.payload);
      const idx = state.wishlistIds.indexOf(id);
      if (idx >= 0) {
        state.wishlistIds.splice(idx, 1);
      } else {
        state.wishlistIds.push(id);
        pushActivity(state, {
          type: "saved",
          propertyId: id,
          title: action.payload.title ?? "Property",
        });
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.wishlistIds = state.wishlistIds.filter((x) => x !== id);
    },

    toggleCompare(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      upsertEntity(state, action.payload);
      const idx = state.compareIds.indexOf(id);
      if (idx >= 0) {
        state.compareIds.splice(idx, 1);
        state.compareNotice = null;
        return;
      }
      if (state.compareIds.length >= MAX_COMPARE) {
        state.compareNotice = `You can compare up to ${MAX_COMPARE} properties. Remove one to add another.`;
        return;
      }
      state.compareIds.push(id);
      pushActivity(state, {
        type: "compare",
        propertyId: id,
        title: action.payload.title ?? "Property",
      });
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareIds = state.compareIds.filter((x) => x !== action.payload);
    },
    clearCompare(state) {
      state.compareIds = [];
      state.compareNotice = null;
    },

    toggleCart(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      upsertEntity(state, action.payload);
      const idx = state.cartIds.indexOf(id);
      if (idx >= 0) {
        state.cartIds.splice(idx, 1);
      } else {
        state.cartIds.push(id);
        pushActivity(state, {
          type: "cart",
          propertyId: id,
          title: action.payload.title ?? "Property",
        });
      }
    },
    addToCart(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      if (state.cartIds.includes(id)) return;
      upsertEntity(state, action.payload);
      state.cartIds.push(id);
      pushActivity(state, {
        type: "cart",
        propertyId: id,
        title: action.payload.title ?? "Property",
      });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartIds = state.cartIds.filter((x) => x !== action.payload);
    },
    clearCart(state) {
      state.cartIds = [];
    },

    /** Legacy-compatible name: adds to cart and removes from wishlist. */
    moveWishlistToCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      const meta = state.entities[id];
      state.wishlistIds = state.wishlistIds.filter((x) => x !== id);
      if (!state.cartIds.includes(id)) {
        state.cartIds.push(id);
        pushActivity(state, {
          type: "cart",
          propertyId: id,
          title: meta?.title ?? "Property",
        });
      }
    },

    recordPropertyView(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      upsertEntity(state, action.payload);
      state.recentIds = state.recentIds.filter((x) => x !== id);
      state.recentIds.unshift(id);
      if (state.recentIds.length > MAX_RECENT) {
        state.recentIds = state.recentIds.slice(0, MAX_RECENT);
      }
      pushActivity(state, {
        type: "viewed",
        propertyId: id,
        title: action.payload.title ?? "Property",
      });
    },

    addSavedSearch(state, action: PayloadAction<Omit<SavedSearch, "id" | "createdAt">>) {
      state.savedSearches.unshift({
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      });
      if (state.savedSearches.length > 50) {
        state.savedSearches = state.savedSearches.slice(0, 50);
      }
    },
    removeSavedSearch(state, action: PayloadAction<string>) {
      state.savedSearches = state.savedSearches.filter((s) => s.id !== action.payload);
    },

    /** Back-compat: same as toggleWishlist when adding; used from cart page. */
    addToWishlist(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      if (state.wishlistIds.includes(id)) return;
      upsertEntity(state, action.payload);
      state.wishlistIds.push(id);
      pushActivity(state, {
        type: "saved",
        propertyId: id,
        title: action.payload.title ?? "Property",
      });
    },
    /** Back-compat: compare add without toggle semantics. */
    addToCompare(state, action: PayloadAction<Property>) {
      const id = action.payload._id;
      upsertEntity(state, action.payload);
      if (state.compareIds.includes(id)) return;
      if (state.compareIds.length >= MAX_COMPARE) {
        state.compareNotice = `You can compare up to ${MAX_COMPARE} properties.`;
        return;
      }
      state.compareIds.push(id);
      pushActivity(state, {
        type: "compare",
        propertyId: id,
        title: action.payload.title ?? "Property",
      });
    },

    updatePreferences(state, action: PayloadAction<Partial<BuyerPreference>>) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addNotification(
      state,
      action: PayloadAction<Omit<BuyerNotification, "id" | "createdAt" | "read">>
    ) {
      state.notifications.unshift({
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        read: false,
      });
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    clearBuyerState() {
      return initialBuyerState;
    },
  },
});

export const {
  clearCompareNotice,
  setCompareHighlightDiff,
  toggleWishlist,
  removeFromWishlist,
  toggleCompare,
  removeFromCompare,
  clearCompare,
  toggleCart,
  addToCart,
  removeFromCart,
  clearCart,
  moveWishlistToCart,
  recordPropertyView,
  addSavedSearch,
  removeSavedSearch,
  addToWishlist,
  addToCompare,
  updatePreferences,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearBuyerState,
} = buyerSlice.actions;

export default buyerSlice.reducer;
