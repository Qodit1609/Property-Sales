import api from "@/lib/apiClient";
import { BASE_URL, TEMP_PROPERTY_API } from "@/lib/apiClient";
import type { HomeSectionsPayload } from "../models/homeTypes";

type HomeSectionsResponse = Partial<HomeSectionsPayload>;

export const getHomeSectionsFromAPI = async (): Promise<HomeSectionsResponse> => {
  // During local property API testing, avoid hitting unavailable production endpoint.
  if (BASE_URL === TEMP_PROPERTY_API) {
    return {};
  }

  const response = await api.get<HomeSectionsResponse>("/home/sections");
  return response.data;
};
