// lib/hooks/usePRNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import type { PRNotification } from '../api/types';

// Mock data - replace with actual API calls when backend PR endpoints are available
const mockPRs: PRNotification[] = [
  {
    id: "1",
    repo_name: "frontend-app",
    pr_title: "Add user authentication flow",
    pr_link: "https://github.com/company/frontend-app/pull/123",
    pr_number: "123",
    pr_status: "open",
    sender_email: "john-doe@github.com",
    recipient_email: "user@example.com",
    subject: "[frontend-app] Add user authentication flow (#123)",
    received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    message_id: "msg1",
    slack_sent: false,
    is_forwarded: false,
  },
  {
    id: "2",
    repo_name: "backend-api",
    pr_title: "Fix database connection timeout",
    pr_link: "https://github.com/company/backend-api/pull/456",
    pr_number: "456",
    pr_status: "open",
    sender_email: "jane-smith@github.com",
    recipient_email: "user@example.com",
    subject: "[backend-api] Fix database connection timeout (#456)",
    received_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    message_id: "msg2",
    slack_sent: true,
    is_forwarded: false,
  },
  {
    id: "3",
    repo_name: "docs",
    pr_title: "Update documentation for API endpoints",
    pr_link: "https://github.com/company/docs/pull/789",
    pr_number: "789",
    pr_status: "merged",
    sender_email: "bob-wilson@github.com",
    recipient_email: "user@example.com",
    subject: "[docs] Update documentation for API endpoints (#789)",
    received_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    message_id: "msg3",
    slack_sent: true,
    is_forwarded: false,
  },
];

interface PRNotificationsState {
  notifications: PRNotification[];
  isLoading: boolean;
  error: string | null;
}

export function usePRNotifications() {
  const [state, setState] = useState<PRNotificationsState>({
    notifications: [],
    isLoading: true,
    error: null,
  });

  const loadNotifications = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState({
        notifications: mockPRs,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load notifications',
      }));
    }
  }, []);

  const filterNotifications = useCallback(
    (status: string, searchQuery: string) => {
      return state.notifications.filter(notification => {
        const matchesStatus = status === 'all' || notification.pr_status === status;
        const matchesSearch = 
          notification.repo_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.pr_title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });
    },
    [state.notifications]
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications: state.notifications,
    isLoading: state.isLoading,
    error: state.error,
    refetch: loadNotifications,
    filterNotifications,
  };
}