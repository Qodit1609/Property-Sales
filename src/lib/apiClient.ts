import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

const PRODUCT_API_BASE_URL =
  import.meta.env.VITE_PRODUCT_API_BASE_URL ??
  "http://bhoomiwala-api.com.therapidhire.com/api";
export const TEMP_PROPERTY_API = "http://localhost:5000/api";
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? TEMP_PROPERTY_API : PRODUCT_API_BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: number }>) => {
    const data = error.response?.data;
    const message =
      data?.message ??
      (data?.code ? `Server error (code: ${data.code})` : error.message);

    return Promise.reject(new Error(message));
  }
);

export default api;
export { PRODUCT_API_BASE_URL };

