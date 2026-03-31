import api, { API_ENDPOINTS } from "../../lib/apiClient";
import type { MediaOrphan, PropertyMediaAsset } from "./mediaTypes";

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

/** Mongo extended JSON / ObjectId / plain string */
function toIdString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "object" && value !== null && "$oid" in value) {
    const oid = (value as { $oid?: unknown }).$oid;
    if (typeof oid === "string" && oid.trim()) {
      return oid.trim();
    }
  }
  const nested = toRecord(value);
  const inner = nested._id ?? nested.id;
  if (typeof inner === "string" && inner.trim()) {
    return inner.trim();
  }
  if (inner && typeof inner === "object" && "$oid" in (inner as object)) {
    const oid = (inner as { $oid?: string }).$oid;
    if (typeof oid === "string" && oid.trim()) {
      return oid.trim();
    }
  }
  return undefined;
}

function extractImageUrl(o: Record<string, unknown>): string {
  const raw = o.cloudinaryUrl ?? o.secure_url ?? o.url ?? o.src;
  return typeof raw === "string" ? raw.trim() : "";
}

function normalizeMediaAsset(raw: unknown): PropertyMediaAsset | null {
  const o = toRecord(raw);
  const ref =
    o.propertyId ??
    o.refId ??
    o.listingId ??
    o.property_id ??
    toIdString(o.property);
  const propertyId = toIdString(ref);
  const url = extractImageUrl(o);
  if (!propertyId || !url || !/^https?:\/\//i.test(url)) {
    return null;
  }

  const createdAt = o.createdAt;
  return {
    propertyId,
    url,
    createdAt: typeof createdAt === "string" ? createdAt : undefined,
  };
}

function toOrphan(raw: unknown): MediaOrphan | null {
  const o = toRecord(raw);
  const url = extractImageUrl(o);
  if (!url || !/^https?:\/\//i.test(url)) {
    return null;
  }
  const createdAt = o.createdAt;
  return {
    url,
    createdAt: typeof createdAt === "string" ? createdAt : undefined,
  };
}

function extractMediaAssets(payload: unknown): unknown[] {
  const root = toRecord(payload);

  const fromData = toRecord(root.data);
  if (Array.isArray(fromData.mediaAssets)) {
    return fromData.mediaAssets;
  }
  if (Array.isArray(fromData.items)) {
    return fromData.items;
  }

  if (Array.isArray(root.mediaAssets)) {
    return root.mediaAssets;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

export interface FetchPropertyMediaResult {
  linked: PropertyMediaAsset[];
  orphans: MediaOrphan[];
}

/**
 * GET /api/media?tag=property — Cloudinary URLs; rows may omit propertyId (orphans).
 */
export async function fetchPropertyMediaAPI(): Promise<FetchPropertyMediaResult> {
  const res = await api.get(API_ENDPOINTS.MEDIA.LIST, {
    params: {
      tag: "property",
      limit: 500,
      skip: 0,
    },
  });

  const rawList = extractMediaAssets(res.data);
  const linked: PropertyMediaAsset[] = [];
  const orphans: MediaOrphan[] = [];

  for (const item of rawList) {
    const normalized = normalizeMediaAsset(item);
    if (normalized) {
      linked.push(normalized);
      continue;
    }
    const orphan = toOrphan(item);
    if (orphan) {
      orphans.push(orphan);
    }
  }

  return { linked, orphans };
}
