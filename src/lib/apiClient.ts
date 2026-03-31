import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";

const PRODUCT_API_BASE_URL =
  import.meta.env.VITE_PRODUCT_API_BASE_URL ??
  "http://bhoomiwala-api.com.therapidhire.com/api";
export const TEMP_PROPERTY_API = "http://localhost:5000/api";
const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_BASE_URL ??
  (import.meta.env.DEV ? TEMP_PROPERTY_API : PRODUCT_API_BASE_URL);
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? TEMP_PROPERTY_API : PRODUCT_API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PROPERTY: {
    LIST: "/properties",
    MY_PROPERTIES: "/properties/my-properties/list",
    BY_ID: (id: string) => `/properties/${id}`,
    APPROVE: (id: string) => `/properties/${id}/approve`,
  },
  NEW: {
    PROPERTIES: "/property-cards/new",
  },
  HOME: {
    SECTIONS: "/home/sections",
  },
  MEDIA: {
    LIST: "/media",
  },
} as const;

const api = axios.create({
  baseURL: BASE_URL,
});

export const withAuthApi = (config: AxiosRequestConfig = {}): AxiosRequestConfig => ({
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
  (error: AxiosError<{ message?: string; code?: number; errors?: unknown }>) => {
    const data = error.response?.data;
    const base =
      data?.message ??
      (data?.code ? `Server error (code: ${data.code})` : error.message);
    const errs = data?.errors;
    const detail =
      Array.isArray(errs) && errs.length
        ? errs.map((e) => String(e)).join("; ")
        : null;
    const message = detail ? `${base}: ${detail}` : base;

    return Promise.reject(new Error(message));
  }
);

export default api;
export { PRODUCT_API_BASE_URL };

