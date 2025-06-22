// lib/api/client.ts (UPDATED with PR endpoints)
import { User, AuthResponse, SlackConnection, PRNotification } from './types';

// Add new types for PR API responses
interface PRNotificationList {
  notifications: PRNotification[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

interface PRStats {
  total_notifications: number;
  slack_sent: number;
  pending_slack: number;
  by_status: Record<string, number>;
  by_repository: Record<string, number>;
  forwarded_emails: number;
  recent_activity: Record<string, number>;
  oldest_pending_pr?: string;
  newest_pr?: string;
  most_active_repo?: string;
}

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

  getGoogleLoginUrl(): string {
    return `${this.baseUrl}/api/v1/auth/google/login`;
  }

  // =============================================================================
  // SLACK ENDPOINTS
  // =============================================================================

  async getSlackAuthUrl(): Promise<{ auth_url: string; state: string; redirect_uri: string }> {
    console.log('🔗 Getting Slack auth URL from backend...');
    return this.request<{ auth_url: string; state: string; redirect_uri: string }>('/auth/slack/auth-url');
  }

  async getSlackConnection(): Promise<SlackConnection> {
    return this.request<SlackConnection>('/auth/slack/connection');
  }

  async disconnectSlack(): Promise<{ message: string }> {
    return this.request('/auth/slack/disconnect', {
      method: 'DELETE',
    });
  }

  async testSlackNotification(message?: string): Promise<{ message: string }> {
    return this.request('/auth/slack/test', {
      method: 'POST',
      body: JSON.stringify({ 
        message: message || 'Test notification from PR Reminder! 🚀' 
      }),
    });
  }

  // =============================================================================
  // 🆕 PR NOTIFICATION ENDPOINTS
  // =============================================================================

  async getPRNotifications(params: {
    status_filter?: string;
    repo_filter?: string;
    days_old?: number;
    slack_sent?: boolean;
    is_forwarded?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  } = {}): Promise<PRNotificationList> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/pr/notifications${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PRNotificationList>(endpoint);
  }

  async getPRNotificationById(id: string): Promise<PRNotification> {
    return this.request<PRNotification>(`/pr/notifications/${id}`);
  }

  async deletePRNotification(id: string): Promise<{ message: string }> {
    return this.request(`/pr/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async getPRStats(): Promise<PRStats> {
    return this.request<PRStats>('/pr/stats');
  }

  async getPRSummary(days: number = 7): Promise<PRStats> {
    return this.request<PRStats>(`/pr/summary?days=${days}`);
  }

  async getUserRepositories(): Promise<{ repositories: string[] }> {
    return this.request('/pr/repositories');
  }

  async markPRSlackSent(id: string): Promise<{ message: string }> {
    return this.request(`/pr/notifications/${id}/mark-slack-sent`, {
      method: 'POST',
    });
  }

  async getPendingSlackNotifications(limit: number = 50): Promise<PRNotificationList> {
    return this.request<PRNotificationList>(`/pr/pending-slack?limit=${limit}`);
  }

  async getOldPRNotifications(
    days_old: number = 7, 
    status_filter: string = 'open', 
    limit: number = 50
  ): Promise<PRNotificationList> {
    return this.request<PRNotificationList>(
      `/pr/old-prs?days_old=${days_old}&status_filter=${status_filter}&limit=${limit}`
    );
  }

  async bulkDeleteNotifications(notification_ids: string[]): Promise<{ message: string }> {
    return this.request('/pr/notifications/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ notification_ids }),
    });
  }

  async bulkMarkSlackSent(notification_ids: string[]): Promise<{ message: string }> {
    return this.request('/pr/notifications/bulk-mark-slack-sent', {
      method: 'POST',
      body: JSON.stringify({ notification_ids }),
    });
  }

  async searchPRNotifications(params: {
    q: string;
    fields?: string;
    date_from?: string;
    date_to?: string;
    exact?: boolean;
  }): Promise<{ results: PRNotification[]; total_matches: number }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/pr/search?${searchParams.toString()}`);
  }

  async getRepositoryStats(repo_name: string): Promise<PRStats> {
    return this.request<PRStats>(`/pr/repositories/${encodeURIComponent(repo_name)}/stats`);
  }

  async exportPRNotifications(params: {
    format?: string;
    days?: number;
    repo_filter?: string;
  } = {}): Promise<Blob> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/pr/export${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
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