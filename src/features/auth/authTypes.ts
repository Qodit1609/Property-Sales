import type { AppRole } from "./roleTypes";

export interface AuthUser {
  id?: string | number;
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: AppRole;
  [key: string]: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller" | "agent";
  mobile?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: AuthUser;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}
