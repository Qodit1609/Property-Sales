import api from "../../lib/apiClient";

export const fetchPropertiesAPI = async (page: number, limit: number) => {
  const res = await api.get("/properties", {
    params: { page, limit },
  });

  // Backend may return { data: [...] } or plain array
  return res.data.data ?? res.data;
};

export const fetchPropertyByIdAPI = async (id: string) => {
  const res = await api.get(`/properties/${id}`);
  return res.data.data ?? res.data; // IMPORTANT: backend may wrap inside data
};
export const approvePropertyAPI = async (id: string) => {
  const res = await api.get(`/properties/${id}/approve`);
  return res.data.data ?? res.data; // IMPORTANT: backend may wrap inside data
};

