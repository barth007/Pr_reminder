// lib/api/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  slack_connection?: SlackConnection;
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

export interface PRNotification {
  id: string;
  repo_name: string | null;
  pr_title: string;
  pr_link: string | null;
  pr_number: string | null;
  pr_status: 'open' | 'merged' | 'closed' | 'updated' | null;
  sender_email: string;
  recipient_email: string;
  subject: string;
  received_at: string;
  message_id: string;
  slack_sent: boolean;
  is_forwarded: boolean;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}