export type UserRole = "buyer" | "seller" | "agent" | "admin" | "user";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: UserRole;
}

