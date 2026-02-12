import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersAPI } from "./userAPI";
import type { User } from "./userType";

// ⭐ State Type
interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
};

// ⭐ Async Thunk
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    return await fetchUsersAPI();
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error occurred";
      });
  },
});

export default userSlice.reducer;
