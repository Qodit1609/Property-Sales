import type { AuthUser } from "../features/auth/authTypes";
import type { Property } from "../features/properties/propertyType";
import type { SellerListingPayload } from "../features/seller/sellerAPI";

export type NormalizedListingStatus = "approved" | "rejected" | "pending";

/** Display status for seller UI (includes sold). */
export type SellerListingDisplayStatus =
  | NormalizedListingStatus
  | "sold"
  | "deactivated";

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

/** Resolves badge row status: pending / approved / rejected / sold */
export function getSellerListingDisplayStatus(
  p: Property
): SellerListingDisplayStatus {
  const approvalRaw =
    p.statusDetails?.approvalStatus ??
    (typeof p.status === "string" ? p.status : null);
  const approval = (approvalRaw ?? "").toString().trim().toLowerCase();
  if (approval === "sold") return "sold";
  if (approval === "deactivated" || approval === "inactive") return "deactivated";
  const avail = (p.availabilityStatus ?? "").toString().trim().toLowerCase();
  if (avail === "sold" || avail === "unavailable") return "sold";
  if (avail === "deactivated" || avail === "inactive" || avail === "hidden") return "deactivated";
  return normalizeListingStatus(p.status ?? p.statusDetails?.approvalStatus);
}

export function extractPropertyLatLng(p: Property): { lat: number; lng: number } {
  const coords = p.location?.coordinates;
  if (coords && typeof coords === "object" && !Array.isArray(coords)) {
    const o = coords as { lat?: unknown; lng?: unknown };
    const lat = Number(o.lat);
    const lng = Number(o.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  const gj = p.location?.geoJSON?.coordinates;
  if (Array.isArray(gj) && gj.length >= 2) {
    const lng = Number(gj[0]);
    const lat = Number(gj[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  return { lat: 0, lng: 0 };
}

/** Build create payload for duplicate listing (best-effort; same shape as post flow). */
export function buildDuplicateListingPayload(p: Property): SellerListingPayload {
  const images =
    (p.images?.length ? p.images : undefined) ??
    p.media?.images ??
    [];
  const baseTitle = (p.title?.trim() || "Listing").slice(0, 180);
  const { lat, lng } = extractPropertyLatLng(p);
  const address =
    p.location?.address?.trim() ||
    p.address?.trim() ||
    p.locationText?.trim() ||
    "Location not set";

  return {
    title: `${baseTitle} (copy)`,
    address,
    price: typeof p.price === "number" && Number.isFinite(p.price) ? p.price : 0,
    images: images.filter(Boolean).slice(0, 24),
    propertyType: p.propertyType || "Farmhouse",
    listingType: p.listingType === "rent" ? "rent" : "sale",
    description: p.description || p.shortDescription || "",
    latitude: lat,
    longitude: lng,
    location: p.location?.city ?? p.location?.locality ?? undefined,
  };
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
