import { API_URL } from "@/lib/utils";
import NProgress from "./nprogress.config";
import { forceLogout } from "@/utils/logout";
import axios, { type AxiosInstance } from "axios";

// Global flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const commonHeaders = {
  "Content-Type": "application/json",
};

export const unauthorizedAPI: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: commonHeaders,
  withCredentials: true,
});

export const authorizedAPI: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: commonHeaders,
  withCredentials: true,
});

// NProgress interceptors for unauthorizedAPI
unauthorizedAPI.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

unauthorizedAPI.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// NProgress interceptors for authorizedAPI
authorizedAPI.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Request interceptor - cookies are sent automatically with withCredentials: true
// No need to add Authorization header since we're using HTTP-only cookies
authorizedAPI.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
authorizedAPI.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    NProgress.done();
    const originalRequest = error.config;

    // Handle network errors
    if (error.request && !error.response) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;

    // Handle token expiration (401 errors)
    if (status === 401 && !originalRequest._retry) {
      // Don't try to refresh if this is already a refresh token request
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        forceLogout();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Create a new request config to avoid infinite loops
            const retryConfig = { ...originalRequest };
            delete retryConfig._retry; // Remove retry flag for fresh attempt
            return authorizedAPI(retryConfig);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using cookies
        await unauthorizedAPI.post("/auth/refresh-token", {});

        // If refresh successful, process queued requests
        processQueue(null, null);

        // Retry the original request with the new token
        // Create a new request config to avoid infinite loops
        const retryConfig = { ...originalRequest };
        delete retryConfig._retry; // Remove retry flag for fresh attempt
        return authorizedAPI(retryConfig);
      } catch (refreshError) {
        // Refresh failed, process queue with error and logout
        processQueue(refreshError, null);
        forceLogout();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If we've already retried or it's not a 401, reject the error
    return Promise.reject(error);
  }
);
