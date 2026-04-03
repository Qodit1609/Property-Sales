/** Minimal cached fields for lists; full rows come from API when available. */
export interface BuyerPropertyMeta {
  propertyId: string;
  title: string;
  price: number;
  image?: string;
  location?: string;
  status?: string;
  propertyType?: string;
}

export interface SavedSearch {
  id: string;
  label: string;
  /** Serializable filter snapshot (e.g. dashboard query + path). */
  filter: Record<string, string | number | boolean | undefined>;
  createdAt: string;
}

export interface BuyerPreference {
  locations: string[];
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  propertyTypes: string[];
  amenities: string[];
  listingTypes: ("sell" | "rent")[];
}

export interface BuyerActivityItem {
  id: string;
  type:
    | "viewed"
    | "saved"
    | "enquiry"
    | "callback"
    | "visit"
    | "cart"
    | "compare";
  propertyId: string;
  title: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export interface BuyerNotification {
  id: string;
  title: string;
  message: string;
  type: "price_drop" | "new_property" | "seller_reply" | "system";
  createdAt: string;
  read: boolean;
}

