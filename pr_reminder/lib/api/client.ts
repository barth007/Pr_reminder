// lib/api/client.ts
import { User, AuthResponse } from './types';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.token = this.getStoredToken();
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setStoredToken(token: string | null): void {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    this.token = token;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          detail: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
    this.setStoredToken(response.access_token);
    return response;
  }

  // Google OAuth URLs (redirect endpoints)
  getGoogleLoginUrl(): string {
    return `${this.baseUrl}/api/v1/auth/google/login`;
  }

  // Slack OAuth URLs
  getSlackLoginUrl(): string {
    return `${this.baseUrl}/api/v1/auth/slack/login`;
  }

  async disconnectSlack(): Promise<{ message: string }> {
    return this.request('/auth/slack/disconnect', {
      method: 'DELETE',
    });
  }

  async testSlackNotification(message?: string): Promise<{ message: string }> {
    return this.request('/auth/slack/test', {
      method: 'POST',
      body: JSON.stringify({ message: message || 'Test notification from PR Reminder! 🚀' }),
    });
  }

  async sendPRNotification(data: {
    repo_name: string;
    pr_title: string;
    pr_url: string;
  }): Promise<{ message: string }> {
    return this.request('/auth/slack/notify/pr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Set auth token (for OAuth callback handling)
  setAuthToken(token: string): void {
    this.setStoredToken(token);
  }

  // Clear auth token (for logout)
  clearAuthToken(): void {
    this.setStoredToken(null);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }
}
export const apiClient = new ApiClient();