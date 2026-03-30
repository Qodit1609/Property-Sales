/** Application roles (aligned with backend; legacy `user` is normalized to `buyer` at the edge). */
export type AppRole = "buyer" | "seller" | "agent" | "admin";

/** Row in admin account list */
export interface ManagedAccount {
  id: string | number;
  name: string;
  email: string;
  role?: AppRole;
}
