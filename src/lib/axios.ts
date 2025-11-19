// lib/axios.ts
import axios from "axios";
import { store } from "@/redux";
import { setCredentials, clearAuth } from "@/redux/slices/authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ===============
// API Instances
// ===============
/**
 * Axios instance for authenticated requests (requires access token)
 */
export const apiAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * Axios instance for public requests (login, register, public data)
 */
export const apiNoAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * Dedicated axios instance for refreshing tokens
 */
export const apiRefresh = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ===============
// Interceptors
// ===============

// Attach access token to Authorization header for apiAuth
apiAuth.interceptors.request.use(async (config) => {
  let token = store.getState().auth.token;

  console.log('[AXIOS INTERCEPTOR] Making request to:', config.url);
  console.log('[AXIOS INTERCEPTOR] Token from Redux:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  console.log('[AXIOS INTERCEPTOR] Full auth state:', store.getState().auth);

  // If token is not available yet, wait briefly for Redux to update (e.g., after login)
  if (!token) {
    console.log('[AXIOS INTERCEPTOR] No token found, waiting for Redux...');
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        unsubscribe();
        console.error('[AXIOS INTERCEPTOR] Timeout: No token found after 2s');
        reject(new Error("No token found in store"));
      }, 2000);

      const unsubscribe = store.subscribe(() => {
        token = store.getState().auth.token;
        if (token) {
          console.log('[AXIOS INTERCEPTOR] Token received from Redux subscription');
          clearTimeout(timeout);
          unsubscribe();
          resolve();
        }
      });
    });
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[AXIOS INTERCEPTOR] Authorization header set');
  } else {
    console.error('[AXIOS INTERCEPTOR] Failed to set Authorization header');
  }

  return config;
});

// Handle 401: attempt refresh token and retry the original request
apiAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Do not retry for auth endpoints
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // If 401 and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await apiRefresh.post("/auth/refresh-token");
        const { token, user } = res.data.data;

        // Persist new token to Redux
        store.dispatch(setCredentials({ token, user }));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiAuth(originalRequest);
      } catch (err) {
        // Refresh failed → clear auth and redirect to login
        store.dispatch(clearAuth());
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
