import api from "../../lib/apiClient";
import type { User } from "../users/userType";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User & { role: NonNullable<User["role"]> };
}

export const loginAPI = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", payload);

  // Expecting shape: { token, user } (optionally wrapped in data)
  const data = res.data?.data ?? res.data;

  return {
    token: data.token,
    user: data.user,
  };
};

