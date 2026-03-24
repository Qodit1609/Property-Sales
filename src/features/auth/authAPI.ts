import api, { withAuthApi } from "../../lib/apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./authTypes";

const unwrapAuthResponse = (payload: AuthResponse) => {
  const root = payload.data ?? payload;
  return {
    token: root.token ?? root.accessToken ?? null,
    user: root.user ?? null,
  };
};

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>("/auth/login", data, withAuthApi());
  return unwrapAuthResponse(response.data);
};

export const registerUser = async (data: RegisterRequest) => {
  const payload = {
    ...data,
    role: data.role === "buyer" ? "user" : data.role,
  };

  const response = await api.post<AuthResponse>(
    "/auth/register",
    payload,
    withAuthApi()
  );
  return unwrapAuthResponse(response.data);
};

