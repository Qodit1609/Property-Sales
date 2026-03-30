import type { AuthUser } from "../features/auth/authTypes";
import type { Property } from "../features/properties/propertyType";

export type NormalizedListingStatus = "approved" | "rejected" | "pending";

export function getSellerId(user: AuthUser | null | undefined): string | undefined {
  if (!user) return undefined;
  if (typeof user._id === "string" && user._id) return user._id;
  if (typeof user.id === "string" && user.id) return user.id;
  if (typeof user.id === "number") return String(user.id);
  return undefined;
}

export function normalizeListingStatus(
  status?: string | null | Record<string, unknown>
): NormalizedListingStatus {
  if (status && typeof status === "object") {
    const nested =
      (status as { approvalStatus?: unknown }).approvalStatus ??
      (status as { status?: unknown }).status;
    if (typeof nested === "string") {
      return normalizeListingStatus(nested);
    }
  }
  const s = (typeof status === "string" ? status : "").trim().toLowerCase();
  if (
    s === "approved" ||
    s === "active" ||
    s === "published" ||
    s === "verified"
  ) {
    return "approved";
  }
  if (s === "rejected" || s === "declined" || s === "denied") {
    return "rejected";
  }
  return "pending";
}

export function sortPropertiesByRecency(listings: Property[]): Property[] {
  const time = (p: Property) => {
    const raw =
      p.statusDetails?.postedAt ??
      p.postedAt ??
      p.createdAt ??
      "";
    const t = Date.parse(raw);
    return Number.isFinite(t) ? t : 0;
  };
  return [...listings].sort((a, b) => time(b) - time(a));
}
