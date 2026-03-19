import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://bhoomiwala-api.com.therapidhire.com/api",
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

