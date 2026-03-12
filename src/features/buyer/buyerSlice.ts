import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Property } from "../properties/propertyType";
import type {
  BuyerActivityItem,
  BuyerNotification,
  BuyerPreference,
} from "./buyerTypes";

export interface BuyerState {
  wishlist: Property[];
  compareList: Property[];
  cart: Property[];
  preferences: BuyerPreference;
  activity: BuyerActivityItem[];
  notifications: BuyerNotification[];
}

const initialState: BuyerState = {
  wishlist: [],
  compareList: [],
  cart: [],
  preferences: {
    locations: [],
    propertyTypes: [],
    amenities: [],
    listingTypes: [],
  },
  activity: [],
  notifications: [],
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

const buyerSlice = createSlice({
  name: "buyer",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Property>) {
      const exists = state.wishlist.some((p) => p._id === action.payload._id);
      if (!exists) {
        state.wishlist.push(action.payload);
        pushActivity(state, {
          type: "saved",
          propertyId: String(action.payload._id),
          title: action.payload.title ?? "Property",
        });
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.wishlist = state.wishlist.filter(
        (p) => String(p._id) !== action.payload
      );
    },
    addToCompare(state, action: PayloadAction<Property>) {
      const exists = state.compareList.some(
        (p) => p._id === action.payload._id
      );
      if (!exists) {
        state.compareList.push(action.payload);
        pushActivity(state, {
          type: "compare",
          propertyId: String(action.payload._id),
          title: action.payload.title ?? "Property",
        });
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareList = state.compareList.filter(
        (p) => String(p._id) !== action.payload
      );
    },
    addToCart(state, action: PayloadAction<Property>) {
      const exists = state.cart.some((p) => p._id === action.payload._id);
      if (!exists) {
        state.cart.push(action.payload);
        pushActivity(state, {
          type: "cart",
          propertyId: String(action.payload._id),
          title: action.payload.title ?? "Property",
        });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter((p) => String(p._id) !== action.payload);
    },
    moveWishlistToCart(state, action: PayloadAction<string>) {
      const property = state.wishlist.find(
        (p) => String(p._id) === action.payload
      );
      if (!property) return;

      const inCart = state.cart.some((p) => p._id === property._id);
      if (!inCart) {
        state.cart.push(property);
        pushActivity(state, {
          type: "cart",
          propertyId: String(property._id),
          title: property.title ?? "Property",
        });
      }
      state.wishlist = state.wishlist.filter(
        (p) => String(p._id) !== action.payload
      );
    },
    updatePreferences(state, action: PayloadAction<Partial<BuyerPreference>>) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addNotification(state, action: PayloadAction<Omit<BuyerNotification, "id" | "createdAt" | "read">>) {
      state.notifications.unshift({
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        read: false,
      });
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
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
      return initialState;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  addToCompare,
  removeFromCompare,
  addToCart,
  removeFromCart,
  moveWishlistToCart,
  updatePreferences,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearBuyerState,
} = buyerSlice.actions;

export default buyerSlice.reducer;

