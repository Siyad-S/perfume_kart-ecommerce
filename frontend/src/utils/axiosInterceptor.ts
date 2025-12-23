import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Extend the internal config to include our custom property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send cookies with every request
});

axiosInstance.interceptors.response.use(
  (response) => response.data, // unwrap response automatically
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // If access token expired → try refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint → backend resets cookies
        await axiosInstance.post("/auth/refresh", {}, { withCredentials: true });

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch {
        // Refresh failed → clear session and redirect
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
