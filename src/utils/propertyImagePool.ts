import type { MediaOrphan, PropertyMediaAsset } from "../features/media/mediaTypes";

/** Deduped ordered list of all Cloudinary (or absolute) URLs from GET /api/media. */
export function collectCloudinaryUrlPool(
  items: PropertyMediaAsset[],
  orphans: MediaOrphan[],
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const it of items) {
    if (it.url && /^https?:\/\//i.test(it.url) && !seen.has(it.url)) {
      seen.add(it.url);
      out.push(it.url);
    }
  }
  for (const o of orphans) {
    if (o.url && /^https?:\/\//i.test(o.url) && !seen.has(o.url)) {
      seen.add(o.url);
      out.push(o.url);
    }
  }
  return out;
}

/**
 * Deterministic slice of `count` URLs from the pool for a property id (stable across navigations).
 */
export function pickCyclicImagesForProperty(
  propertyId: string,
  pool: string[],
  count: number,
): string[] {
  if (!pool.length || count <= 0) {
    return [];
  }
  const L = pool.length;
  let h = 2166136261;
  for (let i = 0; i < propertyId.length; i++) {
    h ^= propertyId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const start = Math.abs(h) % L;
  return Array.from({ length: count }, (_, k) => pool[(start + k) % L]);
}
