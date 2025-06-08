// =============================================================================
// stores/authStore.ts - Zustand Auth Store
// =============================================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  slack_connection?: {
    team_name?: string;
    connected: boolean;
  } | null;
}

interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (token: string, isAuthenticated: boolean) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (token: string, isAuthenticated: boolean) => {
        set({ 
          token, 
          isAuthenticated,
          isLoading: false 
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        // Clear local storage
        localStorage.removeItem('auth_token');
        
        // Clear state
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        // Redirect to login
        window.location.href = '/login';
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // Only persist these fields
    }
  )
);

// Helper hook for auth checks
export const useAuth = () => {
  const { token, user, isAuthenticated, isLoading } = useAuthStore();
  
  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    hasSlackConnection: user?.slack_connection?.connected || false,
    slackTeam: user?.slack_connection?.team_name,
  };
};