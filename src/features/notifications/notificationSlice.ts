import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNotificationsAPI,
  markNotificationReadAPI,
} from "./notificationAPI";
import type { AppNotification } from "./notificationTypes";

interface NotificationsState {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  loading: false,
};

export const fetchNotifications = createAsyncThunk<
  { notifications: AppNotification[]; unreadCount: number },
  string,
  { rejectValue: string }
>("notifications/fetch", async (userId, { rejectWithValue }) => {
  try {
    return await fetchNotificationsAPI(userId);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return rejectWithValue(err.message ?? "Failed to fetch notifications");
  }
});

export const markNotificationRead = createAsyncThunk<
  AppNotification,
  string,
  { rejectValue: string }
>("notifications/markRead", async (id, { rejectWithValue }) => {
  try {
    return await markNotificationReadAPI(id);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return rejectWithValue(err.message ?? "Failed to mark notification as read");
  }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addLiveNotification(state, action: PayloadAction<AppNotification>) {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) return;
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotificationsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx >= 0) {
          const wasUnread = !state.items[idx].isRead;
          state.items[idx] = action.payload;
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      });
  },
});

export const { addLiveNotification, clearNotificationsState } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
