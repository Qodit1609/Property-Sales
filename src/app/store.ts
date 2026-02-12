import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "../features/properties/propertySlice";
import userReducer from "../features/users/userSlice";

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
