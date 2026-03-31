import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  unreadCount: number;
}

const initialState: ChatState = {
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
  },
});

export const { setUnreadCount } = chatSlice.actions;

export default chatSlice.reducer;
