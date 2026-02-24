import api from "../../lib/apiClient";
import type { Property } from "../properties/propertyType";

export interface SellerListingPayload {
  title: string;
  address: string;
  price: number;
  images: string[];
  propertyType: string;
  size?: number;
  beds?: number | string;
  baths?: number | string;
  parking?: number | string;
}

export const fetchMyListingsAPI = async (): Promise<Property[]> => {
  const res = await api.get("/properties");
  return res.data.data ?? res.data;
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

