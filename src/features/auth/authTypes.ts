import type { UserRole } from "../users/userType";

export interface User {
  id?: string | number;
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: UserRole;
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
  user?: User;
  data?: {
    token?: string;
    accessToken?: string;
    user?: User;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}
