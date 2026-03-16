import api from "../../lib/apiClient";
import type { User } from "../users/userType";

export interface LoginPayload {
  email: string;
  password: string;
}

export type RegisterRole = "buyer" | "seller" | "agent";

export interface RegisterPayload {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: RegisterRole;
  // Optional role-specific fields (backend may ignore if unsupported)
  propertyFocusType?: string; // seller
  experienceYears?: number; // agent
  investmentInterest?: string; // buyer
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

export const registerAPI = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", payload);

  // Expecting shape: { token, user } (optionally wrapped in data)
  const data = res.data?.data ?? res.data;

  return {
    token: data.token,
    user: data.user,
  };
};

