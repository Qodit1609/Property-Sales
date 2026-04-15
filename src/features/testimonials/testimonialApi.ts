import api from "@/lib/apiClient";
import type {
  CreateTestimonialRequest,
  Testimonial,
} from "./testimonialTypes";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

const readData = <T>(value: T | ApiEnvelope<T>): T => {
  const payload = value as ApiEnvelope<T>;
  return payload?.data ?? (value as T);
};

export const createTestimonial = async (input: CreateTestimonialRequest) => {
  const response = await api.post<Testimonial | ApiEnvelope<Testimonial>>(
    "/testimonials",
    input
  );
  return readData(response.data);
};

export const getTestimonials = async () => {
  const response = await api.get<Testimonial[] | ApiEnvelope<Testimonial[]>>(
    "/testimonials"
  );
  return readData(response.data) ?? [];
};

export const getApprovedTestimonials = async () => {
  const response = await api.get<Testimonial[] | ApiEnvelope<Testimonial[]>>(
    "/testimonials/approved"
  );
  return readData(response.data) ?? [];
};

export const approveTestimonial = async (id: string) => {
  const response = await api.patch<Testimonial | ApiEnvelope<Testimonial>>(
    `/testimonials/${id}/approve`
  );
  return readData(response.data);
};

export const rejectTestimonial = async (id: string) => {
  const response = await api.patch<Testimonial | ApiEnvelope<Testimonial>>(
    `/testimonials/${id}/reject`
  );
  return readData(response.data);
};

export const deleteTestimonial = async (id: string) => {
  await api.delete(`/testimonials/${id}`);
};
