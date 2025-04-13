import { authManager } from './auth';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(requiresAuth: boolean = true): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (requiresAuth) {
      const token = await authManager.getValidToken();
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        await authManager.invalidateSession();
        throw new Error('Session expired');
      }
      throw new Error(response.statusText);
    }
    return response.json();
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = await this.getHeaders(options.requiresAuth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data: any, options: RequestOptions = {}): Promise<T> {
    const headers = await this.getHeaders(options.requiresAuth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data: any, options: RequestOptions = {}): Promise<T> {
    const headers = await this.getHeaders(options.requiresAuth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = await this.getHeaders(options.requiresAuth);
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(import.meta.env.VITE_API_URL);