import api, { API_ENDPOINTS } from "@/lib/apiClient";

export type SubmitInquiryPayload = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
};

export const submitInquiryAPI = async (payload: SubmitInquiryPayload) => {
  const response = await api.post(API_ENDPOINTS.CONTACT.INQUIRIES, payload);
  return response.data;
};
