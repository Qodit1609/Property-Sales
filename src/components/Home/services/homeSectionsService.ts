import api from "@/lib/apiClient";
import type { HomeSectionsPayload } from "../models/homeTypes";

type HomeSectionsResponse = Partial<HomeSectionsPayload>;

export const getHomeSectionsFromAPI = async (): Promise<HomeSectionsResponse> => {
  const response = await api.get<HomeSectionsResponse>("/home/sections");
  return response.data;
};
