import { API_CONFIG, ENDPOINTS } from '@/config/api';

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  [key: string]: string | T | undefined;
}

/**
 * Make an API request with automatic token handling
 */
export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshed = await refreshAccessToken(refreshToken);
          if (refreshed) {
            // Retry the request with new token
            headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
            const retryResponse = await fetch(url, { ...fetchOptions, headers });
            return handleResponse<T>(retryResponse);
          }
        } catch (error) {
          // Refresh failed, user needs to login again
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('logout'));
        }
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  let data: unknown;

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      if (obj.error) errorMessage = String(obj.error);
      else if (obj.message) errorMessage = String(obj.message);
      else if (obj.detail) errorMessage = String(obj.detail);
      else {
        const errors: string[] = [];
        for (const [key, value] of Object.entries(obj)) {
          if (Array.isArray(value)) {
            errors.push(`${key}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            errors.push(`${key}: ${value}`);
          }
        }
        if (errors.length > 0) {
          errorMessage = errors.join(' | ');
        }
      }
    }
    
    console.error(`API Error (${response.status}):`, errorMessage, data);
    throw new Error(errorMessage);
  }

  console.log(`API Success (${response.status}):`, data);
  return data as T;
}

/**
 * Refresh access token (CORRIGÉ)
 */
async function refreshAccessToken(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${ENDPOINTS.auth.refreshToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

/**
 * GET request
 */
export async function get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request
 */
export async function post<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
