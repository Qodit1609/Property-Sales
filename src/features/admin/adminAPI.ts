import api from "../../lib/apiClient";
import type { User } from "../users/userType";
import type { Property } from "../properties/propertyType";


/* =========================
   USERS
========================= */

export const fetchAdminUsersAPI = async (): Promise<User[]> => {

  const res = await api.get("/admin/users");

  return res.data.data ?? res.data;

};

export const deleteAdminUserAPI = async (
  userId: string
): Promise<void> => {

  await api.delete(`/admin/users/${userId}`);

};



/* =========================
   ALL PROPERTIES (ADMIN)
========================= */

export const fetchAdminListingsAPI = async (): Promise<Property[]> => {

  // IMPORTANT CHANGE
  const res = await api.get("/properties/admin/all");

  return res.data.data ?? res.data;

};



/* =========================
   APPROVE PROPERTY
========================= */

export const approveListingAPI = async (
  id: string
): Promise<Property> => {

  const res = await api.put(`/properties/${id}/approve`);

  return res.data.data ?? res.data;

};



/* =========================
   REJECT PROPERTY
========================= */

export const rejectListingAPI = async (
  id: string
): Promise<Property> => {

  const res = await api.put(`/properties/${id}/reject`);

  return res.data.data ?? res.data;

};



/* =========================
   DELETE PROPERTY
========================= */

export const deleteListingAPI = async (
  id: string
): Promise<void> => {

  await api.delete(`/properties/${id}`);

};