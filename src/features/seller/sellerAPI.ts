import api from "../../lib/apiClient";
import type { Property } from "../properties/propertyType";
import { mapPropertyListPayload } from "../properties/propertyAPI";

export interface SellerListingPayload {
  title: string;
  address: string;
  price: number;
  images: string[];
  propertyType: string;
  /** Backend expects `sale` | `rent` (UI uses sell/rent) */
  listingType: "sale" | "rent";
  description?: string;
  /** Structured fields for propertyModel.location */
  city?: string;
  state?: string;
  pincode?: string;
  locality?: string;
  latitude?: number | string;
  longitude?: number | string;
  location?: string;
  size?: number;
  beds?: string | number;
  baths?: string | number;
  parking?: string | number;
}

export interface UploadPropertyImagePayload {
  file: File;
  tag?: string;
  name?: string;
  altText?: string;
  onUploadProgress?: (percent: number) => void;
}

export const fetchMyListingsAPI = async (): Promise<Property[]> => {
  const res = await api.get("/properties/my-properties/list");
  return mapPropertyListPayload(res.data);
};

export const createListingAPI = async (
  payload: SellerListingPayload
): Promise<Property> => {

  const res = await api.post("/properties", payload);

  return res.data.data ?? res.data;
};

export const updateListingAPI = async (
  id: string,
  payload: Partial<SellerListingPayload>
): Promise<Property> => {

  const res = await api.put(`/properties/${id}`, payload);

  return res.data.data ?? res.data;
};

export const deleteMyListingAPI = async (id: string): Promise<void> => {

  await api.delete(`/properties/${id}`);
};

export const uploadPropertyImageAPI = async (
  payload: UploadPropertyImagePayload
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.tag) formData.append("tag", payload.tag);
  if (payload.name) formData.append("name", payload.name);
  if (payload.altText) formData.append("altText", payload.altText);

  const res = await api.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (!payload.onUploadProgress) return;
      const total = event.total ?? payload.file.size;
      const percent = total > 0 ? Math.min(100, Math.round((event.loaded * 100) / total)) : 0;
      payload.onUploadProgress(percent);
    },
  });

  const data = (res.data ?? {}) as {
    data?: { url?: string; mediaAsset?: { cloudinaryUrl?: string } };
    url?: string;
  };

  const url = data.data?.url ?? data.data?.mediaAsset?.cloudinaryUrl ?? data.url;
  if (!url) {
    throw new Error("Upload succeeded but no image URL was returned.");
  }

  return url;
};