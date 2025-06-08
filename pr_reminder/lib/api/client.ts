import { User, AuthResponse, SlackConnection } from './types';
// lib/api/client.ts (UPDATED)
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

  // ⭐ NEW: Get current token (for debugging)
  getToken(): string | null {
    return this.token || this.getStoredToken();
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
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      // Safely log the Authorization header if present and headers is a plain object
      let authHeader: string | undefined;
      if (
        config.headers &&
        typeof config.headers === 'object' &&
        !Array.isArray(config.headers)
      ) {
        authHeader = (config.headers as Record<string, string>)['Authorization'];
      }
      console.log(
        `🔑 Auth header:`,
        authHeader ? authHeader.toString().substring(0, 20) + '...' : '(none)'
      );
      
      const response = await fetch(url, config);
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          detail: `HTTP ${response.status}: ${response.statusText}` 
        }));
        console.error(`❌ API Error:`, errorData);
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;
    } catch (error) {
      console.error('💥 API request failed:', error);
      throw error;
    }
  }

  // =============================================================================
  // AUTH ENDPOINTS
  // =============================================================================

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

  // Google OAuth URLs
  getGoogleLoginUrl(): string {
    return `${this.baseUrl}/api/v1/auth/google/login`;
  }

  // =============================================================================
  // SLACK ENDPOINTS - REST APPROACH
  // =============================================================================

  // ⭐ NEW: Get Slack OAuth URL via authenticated API call
  async getSlackAuthUrl(): Promise<{ auth_url: string; state: string; redirect_uri: string }> {
    console.log('🔗 Getting Slack auth URL from backend...');
    return this.request<{ auth_url: string; state: string; redirect_uri: string }>('/auth/slack/auth-url');
  }

  // Get current Slack connection details
  async getSlackConnection(): Promise<SlackConnection> {
    return this.request<SlackConnection>('/auth/slack/connection');
  }

  // Disconnect Slack
  async disconnectSlack(): Promise<{ message: string }> {
    return this.request('/auth/slack/disconnect', {
      method: 'DELETE',
    });
  }

  // Send test Slack notification
  async testSlackNotification(message?: string): Promise<{ message: string }> {
    return this.request('/auth/slack/test', {
      method: 'POST',
      body: JSON.stringify({ 
        message: message || 'Test notification from PR Reminder! 🚀' 
      }),
    });
  }

  // Send PR notification to Slack
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

  // Check Slack health
  async checkSlackHealth(): Promise<{ status: string; service: string; slack_configured: boolean }> {
    return this.request('/auth/slack/health');
  }

  // =============================================================================
  // TOKEN MANAGEMENT
  // =============================================================================

  setAuthToken(token: string): void {
    this.setStoredToken(token);
  }

  clearAuthToken(): void {
    this.setStoredToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();