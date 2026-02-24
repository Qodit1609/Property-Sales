export type UserRole = "admin" | "seller";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: UserRole;
}

