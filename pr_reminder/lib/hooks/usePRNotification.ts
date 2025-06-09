// lib/hooks/usePRNotifications.ts (UPDATED to use real API)
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import type { PRNotification } from '../api/types';

interface PRNotificationsState {
  notifications: PRNotification[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface FilterParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  repo_filter?: string;
  days_old?: number;
  slack_sent?: boolean;
  is_forwarded?: boolean;
  sort_by?: string;
  sort_order?: string;
}

// Backend API parameters (for type safety when calling API)
interface APIFilterParams {
  status_filter?: string;
  repo_filter?: string;
  days_old?: number;
  slack_sent?: boolean;
  is_forwarded?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export function usePRNotifications(initialFilters: FilterParams = {}) {
  const [state, setState] = useState<PRNotificationsState>({
    notifications: [],
    isLoading: true,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 50,
    sort_by: 'received_at',
    sort_order: 'desc',
    ...initialFilters,
  });

  const loadNotifications = useCallback(async (newFilters?: FilterParams) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const currentFilters = newFilters || filters;
      
      console.log('🔄 Loading PR notifications with filters:', currentFilters);
      
      // Map frontend filter names to backend parameter names
      const apiParams: APIFilterParams = {
        status_filter: currentFilters.status === 'all' ? undefined : currentFilters.status,
        repo_filter: currentFilters.repo_filter,
        days_old: currentFilters.days_old,
        slack_sent: currentFilters.slack_sent,
        is_forwarded: currentFilters.is_forwarded,
        page: currentFilters.page || 1,
        limit: currentFilters.limit || 50,
        sort_by: currentFilters.sort_by || 'received_at',
        sort_order: currentFilters.sort_order || 'desc',
      };

      const response = await apiClient.getPRNotifications(apiParams);
      
      console.log('✅ PR notifications loaded:', {
        count: response.notifications.length,
        total: response.total_count,
        page: response.page
      });

      setState({
        notifications: response.notifications,
        isLoading: false,
        error: null,
        totalCount: response.total_count,
        currentPage: response.page,
        totalPages: response.total_pages,
        hasNext: response.has_next,
        hasPrevious: response.has_previous,
      });

      // Update filters state if new filters were provided
      if (newFilters) {
        setFilters(prev => ({ ...prev, ...newFilters }));
      }
      
    } catch (error) {
      console.error('❌ Failed to load PR notifications:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load notifications',
      }));
    }
  }, [filters]);

  // Filter function for client-side filtering (for search)
  const filterNotifications = useCallback(
    (status: string, searchQuery: string) => {
      return state.notifications.filter(notification => {
        const matchesStatus = status === 'all' || notification.pr_status === status;
        const matchesSearch = 
          !searchQuery ||
          notification.repo_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.pr_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.sender_email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });
    },
    [state.notifications]
  );

  // Update filters and reload
  const updateFilters = useCallback((newFilters: FilterParams) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1 when filters change
    loadNotifications(updatedFilters);
  }, [filters, loadNotifications]);

  // Change page
  const changePage = useCallback((page: number) => {
    const updatedFilters = { ...filters, page };
    loadNotifications(updatedFilters);
  }, [filters, loadNotifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiClient.deletePRNotification(id);
      // Reload notifications after deletion
      await loadNotifications();
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete notification' 
      };
    }
  }, [loadNotifications]);

  // Mark as Slack sent
  const markSlackSent = useCallback(async (id: string) => {
    try {
      await apiClient.markPRSlackSent(id);
      // Reload notifications after update
      await loadNotifications();
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to mark as Slack sent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mark as Slack sent' 
      };
    }
  }, [loadNotifications]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const stats = await apiClient.getPRStats();
      return stats;
    } catch (error) {
      console.error('❌ Failed to load PR stats:', error);
      return null;
    }
  }, []);

  // Search notifications
  const searchNotifications = useCallback(async (query: string, fields?: string[]) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const params = {
        q: query,
        fields: fields?.join(','),
      };
      
      const response = await apiClient.searchPRNotifications(params);
      
      setState(prev => ({
        ...prev,
        notifications: response.results || [],
        isLoading: false,
        totalCount: response.total_matches || 0,
      }));
      
      return response;
    } catch (error) {
      console.error('❌ Search failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    // State
    notifications: state.notifications,
    isLoading: state.isLoading,
    error: state.error,
    totalCount: state.totalCount,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    hasNext: state.hasNext,
    hasPrevious: state.hasPrevious,
    
    // Current filters
    filters,
    
    // Actions
    refetch: loadNotifications,
    updateFilters,
    changePage,
    deleteNotification,
    markSlackSent,
    loadStats,
    searchNotifications,
    
    // Legacy support (for existing components)
    filterNotifications,
  };
}