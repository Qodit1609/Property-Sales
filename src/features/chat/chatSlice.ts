import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ChatNotification {
  _id: string;
  userId: string;
  type: "message";
  title: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatState {
  notifications: ChatNotification[];
  unreadCount: number;
}

const initialState: ChatState = {
  notifications: [],
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    addNotification(state, action: PayloadAction<ChatNotification>) {
      state.notifications = [action.payload, ...state.notifications];
    },
    setNotifications(state, action: PayloadAction<ChatNotification[]>) {
      state.notifications = action.payload;
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.map((notification) =>
        notification._id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
    },
    markAllNotificationsRead(state) {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
  },
});

export const {
  setUnreadCount,
  addNotification,
  setNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
