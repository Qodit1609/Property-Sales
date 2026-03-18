import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/apiClient";

export interface UIConfig {
  [key: string]: any;
}

interface UIConfigState {
  values: UIConfig;
  loading: boolean;
  error: string | null;
}

const initialState: UIConfigState = {
  values: {},
  loading: false,
  error: null,
};

// Async thunk to fetch UI config from backend
export const fetchUIConfig = createAsyncThunk(
  "uiConfig/fetchUIConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/ui-config");
      return response.data.data; // Returns the formatted config object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch UI config");
    }
  }
);

const uiConfigSlice = createSlice({
  name: "uiConfig",
  initialState,
  reducers: {
    // Optional: set config manually (useful for testing or manual updates)
    setUIConfig: (state, action) => {
      state.values = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUIConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUIConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.values = action.payload;
      })
      .addCase(fetchUIConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUIConfig } = uiConfigSlice.actions;
export default uiConfigSlice.reducer;
