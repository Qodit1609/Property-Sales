import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser as loginUserAPI, registerUser as registerUserAPI } from "./authAPI";
import type { LoginRequest, RegisterRequest, AuthUser } from "./authTypes";
import { normalizeAuthUser } from "./roleUtils";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const readPersistedAuth = () => {
  if (typeof window === "undefined") {
    return { token: null as string | null, user: null as AuthUser | null };
  }

  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    const parsed = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
    const user = normalizeAuthUser(parsed);
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuth = (token: string | null, user: AuthUser | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (user) {
    const normalized = normalizeAuthUser(user);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalized));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

const persisted = readPersistedAuth();

const initialState: AuthState = {
  user: persisted.user,
  token: persisted.token,
  loading: false,
  error: null,
  isAuthenticated: Boolean(persisted.token && persisted.user),
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export const registerUser = createAsyncThunk<
  { token: string | null; user: AuthUser | null },
  RegisterRequest,
  { rejectValue: string }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    return await registerUserAPI(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to register"));
  }
});

export const loginUser = createAsyncThunk<
  { token: string | null; user: AuthUser | null },
  LoginRequest,
  { rejectValue: string }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    return await loginUserAPI(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to login"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      persistAuth(null, null);
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = normalizeAuthUser(action.payload.user);
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token && action.payload.user);
        persistAuth(action.payload.token, state.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to register";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = normalizeAuthUser(action.payload.user);
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token && action.payload.user);
        persistAuth(action.payload.token, state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to login";
      });
  },
});

export const { logout, resetError } = authSlice.actions;

export { loginUser as login, registerUser as register };

export default authSlice.reducer;
