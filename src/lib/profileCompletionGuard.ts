import type { AuthUser } from "../features/auth/authTypes";
import { loadBuyerProfile } from "./buyerProfileStorage";
import { loadSellerProfile } from "./sellerProfileStorage";

export function getMandatoryProfilePathForRole(role: AuthUser["role"] | undefined): string | null {
  if (role === "seller") return "/seller/profile";
  if (role === "buyer") return "/buyer/account";
  return null;
}

export function getDashboardPathForRole(role: AuthUser["role"] | undefined): string {
  if (role === "seller") return "/seller/dashboard";
  if (role === "buyer") return "/buyer/dashboard";
  if (role === "admin") return "/admin";
  if (role === "agent") return "/agent/dashboard";
  return "/";
}

function getSellerProfileCompletion(user: AuthUser): number {
  const stored = loadSellerProfile(user.email);
  const checks = [
    (stored?.displayName ?? user.name ?? "").trim(),
    (stored?.phone ?? (user.mobile as string | undefined) ?? "").trim(),
    (stored?.pan ?? "").trim(),
    (stored?.aadhaar ?? "").trim(),
    (stored?.company ?? "").trim(),
    (stored?.city ?? "").trim(),
    (stored?.gstin ?? "").trim(),
    (stored?.bio ?? "").trim(),
    (stored?.profilePhotoUrl ?? "").trim(),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

function getBuyerProfileCompletion(user: AuthUser): number {
  const stored = loadBuyerProfile(user.email);
  const checks = [(stored?.profilePhotoUrl ?? "").trim()];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export function isProfileCompletionMandatory(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === "admin") return false;
  if (user.role === "seller") return getSellerProfileCompletion(user) < 100;
  if (user.role === "buyer") return getBuyerProfileCompletion(user) < 100;
  return false;
}
