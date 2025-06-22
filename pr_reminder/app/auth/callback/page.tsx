// 📁 app/auth/callback/page.tsx - FIXED with better debugging
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface AuthCallbackData {
  success: boolean;
  token?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  profile_image?: string;
  slack_connected?: boolean;
  slack_team?: string;
  error?: string;
  timestamp?: string;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔥 AUTH CALLBACK STARTED');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));

        // Parse URL parameters
        const callbackData: AuthCallbackData = {
          success: searchParams.get('success') === 'true',
          token: searchParams.get('token') || undefined,
          user_id: searchParams.get('user_id') || undefined,
          user_name: searchParams.get('user_name') || undefined,
          user_email: searchParams.get('user_email') || undefined,
          profile_image: searchParams.get('profile_image') || undefined,
          slack_connected: searchParams.get('slack_connected') === 'true',
          slack_team: searchParams.get('slack_team') || undefined,
          error: searchParams.get('error') || undefined,
          timestamp: searchParams.get('timestamp') || undefined,
        };

        console.log('📦 Parsed callback data:', callbackData);

        if (callbackData.success && callbackData.token) {
          console.log('✅ Authentication successful');
          
          // Store JWT token in localStorage
          localStorage.setItem('auth_token', callbackData.token);
          console.log('💾 Token stored in localStorage');
          
          // Update auth store with token
          setAuth(callbackData.token, true);
          console.log('🏪 Auth store updated');
          
          // Create user object with proper structure
          const user = {
            id: callbackData.user_id || '',
            name: callbackData.user_name || '',
            email: callbackData.user_email || '',
            profile_image: callbackData.profile_image || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            slack_connection: callbackData.slack_connected
                ? {
                    id: 'temp-id',
                    user_id: callbackData.user_id || '',
                    slack_user_id: 'temp-slack-id',
                    slack_team_id: 'temp-team-id',
                    team_name: callbackData.slack_team || 'Unknown Team',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    connected: true, 
                }
                : undefined,
            };
          
          console.log('👤 Created user object:', user);
          
          // Update user store
          setUser(user);
          console.log('🏪 User store updated');

          // Clean the URL first (remove query parameters)
          window.history.replaceState({}, document.title, '/auth/callback');
          console.log('🧹 URL cleaned');

          // Wait a bit for state to settle
          setTimeout(() => {
            // Determine redirect destination
            if (callbackData.slack_connected) {
              console.log('🎯 User has Slack connected - redirecting to dashboard');
              router.push('/dashboard');
            } else {
              console.log('🎯 User needs Slack setup - redirecting to onboarding');
              router.push('/onboarding');
            }
          }, 500); // Small delay to ensure state is updated
          
        } else {
          // Error case
          const errorMessage = callbackData.error || 'Authentication failed';
          console.error('❌ Authentication failed:', errorMessage);
          setError(errorMessage);
          
          // Redirect to home page with error after 3 seconds
          setTimeout(() => {
            console.log('🔄 Redirecting to home page with error');
            router.push(`/?error=${encodeURIComponent(errorMessage)}`);
          }, 3000);
        }
        
      } catch (err) {
        console.error('💥 Error processing auth callback:', err);
        setError('Failed to process authentication callback');
        
        // Redirect to home page with error
        setTimeout(() => {
          console.log('🔄 Redirecting to home page due to error');
          router.push('/?error=callback_processing_failed');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, setAuth, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Processing Authentication...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we complete your login
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Check browser console for detailed logs
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Authentication Failed
          </h2>
          <p className="mt-2 text-gray-600">
            {error}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  // Success case - showing loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Authentication Successful!
        </h2>
        <p className="mt-2 text-gray-600">
          Setting up your workspace...
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Check browser console for detailed logs
        </p>
      </div>
    </div>
  );
}