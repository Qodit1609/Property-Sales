import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../users/userType";
import { loginAPI, registerAPI } from "./authAPI";
import type { LoginPayload, AuthResponse, RegisterPayload } from "./authAPI";

interface AuthUser extends User {
  role: NonNullable<User["role"]>;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  try {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    return {
      token: storedToken,
      user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
      isAuthenticated: Boolean(storedToken && storedUser),
      loading: false,
      error: null,
    };
  } catch {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

export const login = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await loginAPI(payload);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to login";
    return rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await registerAPI(payload);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message ?? "Failed to register";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    },
    setAuthFromStorage(
      state,
      action: PayloadAction<{ token: string | null; user: AuthUser | null }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = Boolean(action.payload.token && action.payload.user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", action.payload.token);
          localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to login";
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", action.payload.token);
          localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to register";
      });
  },
});

export const { logout, setAuthFromStorage } = authSlice.actions;

export default authSlice.reducer;

