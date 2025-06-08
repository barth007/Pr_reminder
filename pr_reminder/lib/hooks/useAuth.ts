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
      apiClient.clearAuthToken();
    }
  }, []);

  const login = useCallback(() => {
    console.log('🔐 Starting Google OAuth login...');
    window.location.href = apiClient.getGoogleLoginUrl();
  }, []);

  const logout = useCallback(() => {
    console.log('👋 Logging out...');
    apiClient.clearAuthToken();
    setAuthState({ user: null, isLoading: false, error: null });
    window.location.href = '/';
  }, []);

  // ⭐ UPDATED: REST-compliant Slack connection
  const connectSlack = useCallback(async () => {
    try {
      console.log('🔗 Starting Slack connection flow...');
      console.log('🔑 Current token:', apiClient.getToken()?.substring(0, 20) + '...');
      
      // Make authenticated API call to get Slack OAuth URL
      const response = await apiClient.getSlackAuthUrl();
      
      console.log('✅ Got Slack auth URL:', response.auth_url);
      console.log('🎯 State parameter:', response.state);
      
      // Redirect to Slack OAuth
      window.location.href = response.auth_url;
      
    } catch (error) {
      console.error('❌ Failed to get Slack auth URL:', error);
      throw new Error(
        error instanceof Error 
          ? `Slack connection failed: ${error.message}`
          : 'Failed to connect to Slack'
      );
    }
  }, []);

  const disconnectSlack = useCallback(async () => {
    try {
      console.log('🔌 Disconnecting Slack...');
      await apiClient.disconnectSlack();
      console.log('✅ Slack disconnected successfully');
      
      // Reload user to update slack connection status
      await loadUser();
    } catch (error) {
      console.error('❌ Failed to disconnect Slack:', error);
      throw error;
    }
  }, [loadUser]);

  const testSlackNotification = useCallback(async (message?: string) => {
    try {
      console.log('📤 Sending test Slack notification...');
      const result = await apiClient.testSlackNotification(message);
      console.log('✅ Test notification sent:', result.message);
      return result;
    } catch (error) {
      console.error('❌ Failed to send test notification:', error);
      throw error;
    }
  }, []);

  // ⭐ NEW: Get Slack connection details
  const getSlackConnection = useCallback(async () => {
    try {
      return await apiClient.getSlackConnection();
    } catch (error) {
      console.error('Failed to get Slack connection:', error);
      return null;
    }
  }, []);

  const checkSlackHealth = useCallback(async () => {
    try {
      return await apiClient.checkSlackHealth();
    } catch (error) {
      console.error('Failed to check Slack health:', error);
      return null;
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
      console.log('🎫 Found token in URL, storing...');
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
    getSlackConnection,
    checkSlackHealth,
    refetch: loadUser,
  };
}