import axios, { type InternalAxiosRequestConfig } from "axios";

// Shared Axios client that automatically attaches JWT token
// from localStorage as Authorization: Bearer <token>
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Ensure headers object exists, then safely assign Authorization
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

