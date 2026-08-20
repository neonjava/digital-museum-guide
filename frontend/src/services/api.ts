const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

class ApiService {
  private getHeaders(isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem('museum_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { data, ...customOptions } = options;
    const isMultipart = data instanceof FormData;

    const config: RequestInit = {
      ...customOptions,
      headers: {
        ...this.getHeaders(isMultipart),
        ...customOptions.headers,
      },
    };

    if (data && !isMultipart) {
      config.body = JSON.stringify(data);
    } else if (data && isMultipart) {
      config.body = data;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.message || 'API request failed';
      throw new Error(errorMsg);
    }

    return result;
  }

  get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  put<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  patch<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiService();
