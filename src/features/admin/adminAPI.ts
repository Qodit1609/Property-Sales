import api from "../../lib/apiClient";
import type { User } from "../users/userType";
import type { Property } from "../properties/propertyType";

export const fetchAdminUsersAPI = async (): Promise<User[]> => {
  const res = await api.get("/admin/users");
  return res.data.data ?? res.data;
};

export const deleteAdminUserAPI = async (userId: string): Promise<void> => {
  await api.delete(`/admin/users/${userId}`);
};

export const fetchAdminListingsAPI = async (): Promise<Property[]> => {
  const res = await api.get("/properties");
  return res.data.data ?? res.data;
};

export const approveListingAPI = async (id: string): Promise<Property> => {
  const res = await api.patch(`/admin/listings/${id}/approve`);
  return res.data.data ?? res.data;
};

export const rejectListingAPI = async (id: string): Promise<Property> => {
  const res = await api.patch(`/admin/listings/${id}/reject`);
  return res.data.data ?? res.data;
};

export const deleteListingAPI = async (id: string): Promise<void> => {
  await api.delete(`/admin/listings/${id}`);
};

