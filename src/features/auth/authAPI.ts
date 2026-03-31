import api, { API_ENDPOINTS, withAuthApi } from "../../lib/apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./authTypes";
import { normalizeAuthUser } from "./roleUtils";

const unwrapAuthResponse = (payload: AuthResponse) => {
  const root = payload.data ?? payload;
  return {
    token: root.token ?? root.accessToken ?? null,
    user: normalizeAuthUser(root.user ?? null),
  };
};

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data, withAuthApi());
  return unwrapAuthResponse(response.data);
};

export const registerUser = async (data: RegisterRequest) => {
  // Validate role before sending
  const validRoles: RegisterRequest["role"][] = ["buyer", "seller", "agent"];
  if (!validRoles.includes(data.role)) {
    throw new Error(
      `Invalid role: ${data.role}. Must be one of: ${validRoles.join(", ")}`
    );
  }

  // Validate required fields
  if (!data.name?.trim()) {
    throw new Error("Name is required");
  }
  if (!data.email?.trim()) {
    throw new Error("Email is required");
  }
  if (!data.password || data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const response = await api.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    data,
    withAuthApi()
  );
  return unwrapAuthResponse(response.data);
};
