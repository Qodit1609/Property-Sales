import api from "@/lib/apiClient";
import { API_ENDPOINTS, BASE_URL, TEMP_PROPERTY_API } from "@/lib/apiClient";
import type { HomeSectionsPayload } from "../models/homeTypes";

type HomeSectionsResponse = Partial<HomeSectionsPayload>;
type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export const getHomeSectionsFromAPI = async (): Promise<HomeSectionsResponse> => {
  // During local property API testing, avoid hitting unavailable production endpoint.
  if (BASE_URL === TEMP_PROPERTY_API) {
    return {};
  }

  const response = await api.get<HomeSectionsResponse | ApiEnvelope<HomeSectionsResponse>>(
    API_ENDPOINTS.HOME.SECTIONS,
  );
  const payload = response.data as ApiEnvelope<HomeSectionsResponse>;
  return payload?.data ?? (response.data as HomeSectionsResponse);
};
