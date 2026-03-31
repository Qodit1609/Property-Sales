/** Normalized row from GET /api/media?tag=property (Cloudinary-backed assets). */
export interface PropertyMediaAsset {
  propertyId: string;
  url: string;
  createdAt?: string;
}

/** Media rows with a CDN URL but no propertyId yet (still usable with list-order fallback). */
export interface MediaOrphan {
  url: string;
  createdAt?: string;
}
