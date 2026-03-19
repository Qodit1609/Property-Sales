import api from "../../lib/apiClient";
import type { Property } from "./propertyType";

const extractArray = (payload: unknown): Property[] => {
  if (Array.isArray(payload)) {
    return payload as Property[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const direct = [
    record.data,
    record.properties,
    record.items,
    record.results,
    record.docs,
  ];

  for (const candidate of direct) {
    if (Array.isArray(candidate)) {
      return candidate as Property[];
    }
  }

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    const nestedCandidates = [
      nested.data,
      nested.properties,
      nested.items,
      nested.results,
      nested.docs,
    ];
    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) {
        return candidate as Property[];
      }
    }
  }

  return [];
};

export const fetchPropertiesAPI = async (page: number, limit: number) => {
  const res = await api.get("/properties", {
    params: { page, limit },
  });
  const publicProperties = extractArray(res.data);

  if (publicProperties.length > 0) {
    return publicProperties;
  }

  // Fallback for authenticated users whose data is scoped to their account.
  try {
    const myRes = await api.get("/properties/my-properties/list");
    const myProperties = extractArray(myRes.data);
    if (myProperties.length > 0) {
      return myProperties;
    }
  } catch {
    // Keep silent: public listing may still legitimately be empty.
  }

  return publicProperties;
};

export const fetchPropertyByIdAPI = async (id: string) => {
  const res = await api.get(`/properties/${id}`);
  return res.data.data ?? res.data; // IMPORTANT: backend may wrap inside data
};
export const approvePropertyAPI = async (id: string) => {
  const res = await api.get(`/properties/${id}/approve`);
  return res.data.data ?? res.data; // IMPORTANT: backend may wrap inside data
};

