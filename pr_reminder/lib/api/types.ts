// lib/api/types.ts (UPDATED with complete PR types)
export interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  slack_connection?: SlackConnection;
  inbound_email?: string;
}

export interface SlackConnection {
  id: string;
  user_id: string;
  slack_user_id: string;
  slack_team_id: string;
  team_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// 🆕 Updated PRNotification interface to match backend
export interface PRNotification {
  id: string;
  repo_name: string | null;
  pr_title: string;
  pr_link: string | null;
  pr_number: string | null;
  pr_status: 'opened' | 'merged' | 'closed' | 'updated' | null; // Updated to match backend
  sender_email: string;
  recipient_email: string;
  subject: string;
  received_at: string;
  message_id: string;
  slack_sent: boolean;
  is_forwarded: boolean;
  raw_text?: string;
  raw_html?: string;
  created_at: string;
  updated_at: string;
}

// 🆕 Backend response types
export interface PRNotificationList {
  notifications: PRNotification[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PRStats {
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

export interface PRSummary {
  period_days: number;
  total_notifications: number;
  new_prs: number;
  merged_prs: number;
  closed_prs: number;
  repositories_involved: string[];
  daily_activity: Record<string, number>;
  pending_reviews: number;
  old_open_prs: number;
  notification_rate: number;
}

export interface RepositoryStats {
  repo_name: string;
  total_prs: number;
  open_prs: number;
  merged_prs: number;
  closed_prs: number;
  last_activity?: string;
  avg_response_time?: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}