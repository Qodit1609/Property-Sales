import api from "../../lib/apiClient";
import type { Property } from "../properties/propertyType";

export interface SellerListingPayload {
  title: string;
  address: string;
  price: number;
  images: string[];
  propertyType: string;
  description?: string;
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

  // Response format: { success, message, data: { count, properties } }
  const responseData = res.data?.data ?? res.data;
  
  // Return properties array or empty array as fallback
  return Array.isArray(responseData?.properties) ? responseData.properties : (Array.isArray(responseData) ? responseData : []);
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