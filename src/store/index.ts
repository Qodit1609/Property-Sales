import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "../features/properties/propertySlice";
import userReducer from "../features/users/userSlice";
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import sellerReducer from "../features/seller/sellerSlice";
import postPropertyReducer from "../features/postProperty/postPropertySlice";
import buyerReducer from "../features/buyer/buyerSlice";
import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    users: userReducer,
    auth: authReducer,
    admin: adminReducer,
    seller: sellerReducer,
    postProperty: postPropertyReducer,
    buyer: buyerReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
