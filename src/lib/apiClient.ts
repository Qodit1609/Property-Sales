import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";

// API endpoints - use import.meta.env for Vite
const PRODUCT_API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: PRODUCT_API_BASE_URL,
});

export const withAuthApi = (
  config: AxiosRequestConfig = {}
): AxiosRequestConfig => ({
  ...config,
  baseURL: AUTH_API_BASE_URL,
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

