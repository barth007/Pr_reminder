// lib/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const loadUser = useCallback(async () => {
    if (!apiClient.isAuthenticated()) {
      setAuthState({ user: null, isLoading: false, error: null });
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await apiClient.getCurrentUser();
      setAuthState({ user, isLoading: false, error: null });
    } catch (error) {
      console.error('Failed to load user:', error);
      setAuthState({ 
        user: null, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load user' 
      });
      // Clear invalid token
      apiClient.clearAuthToken();
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = apiClient.getGoogleLoginUrl();
  }, []);

  const logout = useCallback(() => {
    apiClient.clearAuthToken();
    setAuthState({ user: null, isLoading: false, error: null });
  }, []);

  const connectSlack = useCallback(() => {
    window.location.href = apiClient.getSlackLoginUrl();
  }, []);

  const disconnectSlack = useCallback(async () => {
    try {
      await apiClient.disconnectSlack();
      // Reload user to update slack connection status
      await loadUser();
    } catch (error) {
      console.error('Failed to disconnect Slack:', error);
      throw error;
    }
  }, [loadUser]);

  const testSlackNotification = useCallback(async (message?: string) => {
    try {
      return await apiClient.testSlackNotification(message);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Handle OAuth callback tokens
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      apiClient.setAuthToken(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Load user data
      loadUser();
    }
  }, [loadUser]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    login,
    logout,
    connectSlack,
    disconnectSlack,
    testSlackNotification,
    refetch: loadUser,
  };
}