/**
 * Authentication Helper Utilities
 * Provides helper functions for managing authentication tokens and making authenticated API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

/**
 * Get authentication token from storage
 * Checks both localStorage and sessionStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check localStorage first (for "remember me" functionality)
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return localToken;
  }

  // Fallback to sessionStorage (for current session only)
  const sessionToken = sessionStorage.getItem('token');
  return sessionToken;
}

/**
 * Get user ID from storage
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try to get from user object in localStorage
  const userDataStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      return userData.id || userData.userId || null;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  // Fallback: check for userId directly
  return localStorage.getItem('userId') || sessionStorage.getItem('userId');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Save authentication token to storage
 */
export function saveAuthToken(token: string, remember: boolean = true): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
}

/**
 * Remove authentication token from storage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  localStorage.removeItem('userId');
  sessionStorage.removeItem('userId');
}

/**
 * Get authentication headers for API calls
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Make an authenticated API call to the API
 * 
 * @param endpoint - The endpoint path (e.g., '/notifications/device/register')
 * @param options - Fetch options (method, body, etc.)
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns Response from the API
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add authentication if required
  if (requireAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle response
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));

    throw new Error(errorData.message || `API call failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  /**
   * GET request
   */
  get: async <T = any>(endpoint: string, requireAuth: boolean = true): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'GET' }, requireAuth);
  },

  /**
   * POST request
   */
  post: async <T = any>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<T> => {
    return apiCall<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      requireAuth
    );
  },

  /**
   * PUT request
   */
  put: async <T = any>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<T> => {
    return apiCall<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      requireAuth
    );
  },

  /**
   * PATCH request
   */
  patch: async <T = any>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<T> => {
    return apiCall<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      requireAuth
    );
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<T> => {
    return apiCall<T>(
      endpoint,
      {
        method: 'DELETE',
        body: data ? JSON.stringify(data) : undefined,
      },
      requireAuth
    );
  },
};

/**
 * Get API base URL
 */
export function getApiUrl(): string {
  return API_URL;
}