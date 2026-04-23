import type { PropertyMediaAsset } from "../features/media/mediaTypes";

/**
 * Groups Cloudinary URLs by property id (matches `property.id` / `property._id`).
 */
export function mapMediaToProperties(
  mediaList: PropertyMediaAsset[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};

  const sorted = [...mediaList].sort((a, b) => {
    const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
    const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (ta !== tb) {
      return ta - tb;
    }
    return 0;
  });

  for (const item of sorted) {
    const id = item.propertyId;
    if (!id || !item.url) {
      continue;
    }
    if (!map[id]) {
      map[id] = [];
    }
    if (!map[id].includes(item.url)) {
      map[id].push(item.url);
    }
  }

  return map;
}
