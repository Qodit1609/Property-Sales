import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "../features/properties/propertySlice";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import sellerReducer from "../features/seller/sellerSlice";
import postPropertyReducer from "../features/postProperty/postPropertySlice";
import buyerReducer from "../features/buyer/buyerSlice";
import newPropertiesReducer from "../store/slices/newPropertiesSlice";
import mediaReducer from "../features/media/mediaSlice";
import notificationsReducer from "../features/notifications/notificationSlice";
import {
  loadLegacyBuyerState,
  loadPersistedBuyerState,
  persistBuyerState,
} from "../features/buyer/buyerPersist";
import { initialBuyerState, setBuyerState } from "../features/buyer/buyerSlice";
import type { AuthUser } from "../features/auth/authTypes";

const AUTH_USER_KEY = "auth_user";

const getBuyerStorageOwner = (user: AuthUser | null | undefined): string => {
  if (!user) return "guest";
  const candidate = user._id ?? user.id ?? user.email ?? user.mobile;
  const normalized = candidate == null ? "" : String(candidate).trim().toLowerCase();
  return normalized || "guest";
};

const readInitialBuyerOwner = (): string => {
  if (typeof window === "undefined") return "guest";
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    const user = raw ? (JSON.parse(raw) as AuthUser) : null;
    return getBuyerStorageOwner(user);
  } catch {
    return "guest";
  }
};

const initialBuyerOwner = readInitialBuyerOwner();
const persistedBuyer = loadPersistedBuyerState(initialBuyerOwner) ?? loadLegacyBuyerState();

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    media: mediaReducer,
    auth: authReducer,
    admin: adminReducer,
    seller: sellerReducer,
    postProperty: postPropertyReducer,
    buyer: buyerReducer,
    notifications: notificationsReducer,
    newProperties: newPropertiesReducer,
  },
  preloadedState: persistedBuyer ? { buyer: persistedBuyer } : undefined,
});

let persistTimer: ReturnType<typeof setTimeout> | undefined;
let activeBuyerOwner = getBuyerStorageOwner(store.getState().auth.user);
let isHydratingBuyer = false;

store.subscribe(() => {
  if (isHydratingBuyer) return;
  const state = store.getState();
  const currentOwner = getBuyerStorageOwner(state.auth.user);
  if (currentOwner !== activeBuyerOwner) {
    activeBuyerOwner = currentOwner;
    const buyerState = loadPersistedBuyerState(currentOwner) ?? initialBuyerState;
    isHydratingBuyer = true;
    store.dispatch(setBuyerState(buyerState));
    isHydratingBuyer = false;
    return;
  }

  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const latestState = store.getState();
    persistBuyerState(latestState.buyer, getBuyerStorageOwner(latestState.auth.user));
  }, 400);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
