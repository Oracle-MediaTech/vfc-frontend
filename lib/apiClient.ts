import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Backend always runs on port 3030 on the same host the user is browsing
// from — we reuse the page's hostname so the API URL tracks the laptop's
// current LAN IP without rebuilds. Works for localhost, LAN IP, or any host.
const BACKEND_PORT = 3030;

function resolveApiUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:${BACKEND_PORT}/api/v1`;
  }
  // SSR / build-time fallback (no requests fire here anyway in static export)
  return "";
}

const apiClient: AxiosInstance = axios.create({
  baseURL: resolveApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ✅ Request interceptor
apiClient.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
=======
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
>>>>>>> 9b868b3481ec521de7f6ab175aab422f65b58676
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
<<<<<<< HEAD
  (error: AxiosError) => Promise.reject(error)
=======
  (error: AxiosError) => Promise.reject(error),
>>>>>>> 9b868b3481ec521de7f6ab175aab422f65b58676
);

// ✅ Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
<<<<<<< HEAD
  }
=======
  },
>>>>>>> 9b868b3481ec521de7f6ab175aab422f65b58676
);

export default apiClient;