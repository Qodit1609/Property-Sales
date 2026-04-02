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