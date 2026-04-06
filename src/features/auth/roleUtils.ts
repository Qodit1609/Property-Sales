import type { AppRole } from "./roleTypes";
import type { AuthUser } from "./authTypes";

const LEGACY_BUYER_ALIASES: Record<string, AppRole> = {
  user: "buyer",
  customer: "buyer",
  member: "buyer",
};

const ADMIN_ALIASES = new Set(["superadmin", "super_admin", "super-admin", "super admin"]);

/**
 * Maps API / stored role strings to `AppRole`. Legacy buyer role `user` becomes `buyer`.
 */
export function normalizeRoleValue(role: unknown): AppRole | undefined {
  if (role == null) return undefined;
  let s = String(role).trim().toLowerCase();
  if (!s) return undefined;
  if (s.startsWith("role_")) s = s.slice(5);
  const mapped = LEGACY_BUYER_ALIASES[s];
  if (mapped) return mapped;
  if (ADMIN_ALIASES.has(s)) return "admin";
  if (s === "buyer" || s === "seller" || s === "agent" || s === "admin") {
    return s;
  }
  return undefined;
}

function pickRawRole(user: AuthUser): unknown {
  const u = user as Record<string, unknown>;
  return user.role ?? u.userType ?? u.user_role ?? u.type;
}

export function normalizeAuthUser(user: AuthUser | null | undefined): AuthUser | null {
  if (!user) return null;
  const role = normalizeRoleValue(pickRawRole(user));
  return { ...user, role };
}
