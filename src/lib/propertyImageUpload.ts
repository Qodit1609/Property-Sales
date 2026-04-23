export const MAX_PROPERTY_IMAGES = 5;
export const MAX_PROPERTY_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_PROPERTY_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function makeMediaItemId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function sha256Hex(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
