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
import { loadPersistedBuyerState, persistBuyerState } from "../features/buyer/buyerPersist";

const persistedBuyer = loadPersistedBuyerState();

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
store.subscribe(() => {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistBuyerState(store.getState().buyer);
  }, 400);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
