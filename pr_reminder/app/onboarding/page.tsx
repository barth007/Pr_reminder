"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OnboardingScreen } from '@/components/onboarding-screen';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/lib/hooks/useAuth';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isAuthenticated, connectSlack, refetch } = useAuth();
  const [slackConnecting, setSlackConnecting] = useState(false);
  const [slackMessage, setSlackMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // ⭐ Handle Slack OAuth callback
  useEffect(() => {
    const handleSlackCallback = async () => {
      const slackSuccess = searchParams.get('slack_success');
      const slackError = searchParams.get('slack_error');
      const slackTeam = searchParams.get('slack_team');
      
      if (slackSuccess === 'true') {
        console.log('✅ Slack connected successfully!');
        setSlackMessage({
          type: 'success',
          message: `Slack connected successfully! ${slackTeam ? `Connected to ${slackTeam}` : ''}`
        });
        
        // Refresh user data to get updated Slack connection
        console.log('🔄 Refreshing user data...');
        await refetch();
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/onboarding');
        
        // Auto-redirect to email setup after 2 seconds
        setTimeout(() => {
          console.log('🎯 Auto-redirecting to email setup...');
          router.push('/email-setup');
        }, 2000);
        
      } else if (slackError) {
        console.error('❌ Slack connection failed:', slackError);
        setSlackMessage({
          type: 'error',
          message: `Slack connection failed: ${slackError}`
        });
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/onboarding');
        setSlackConnecting(false);
      }
    };

    handleSlackCallback();
  }, [searchParams, refetch, router]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      console.log('🚫 Not authenticated, redirecting to home...');
      router.push('/');
      return;
    }

    // If user already has Slack connected and not coming from OAuth callback
    if (user.slack_connection && !searchParams.get('slack_success')) {
      console.log('✅ User already has Slack connected, redirecting to email setup...');
      router.push('/email-setup');
      return;
    }
  }, [isAuthenticated, user, isLoading, router, searchParams]);

  const handleSlackConnect = async () => {
    setSlackConnecting(true);
    setSlackMessage(null);
    
    try {
      console.log('🔗 Starting Slack connection...');
      await connectSlack(); // This will redirect to Slack OAuth
    } catch (error) {
      console.error('❌ Failed to connect Slack:', error);
      setSlackMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to connect to Slack'
      });
      setSlackConnecting(false);
    }
  };

  const handleComplete = () => {
    console.log('✅ Proceeding to email setup...');
    router.push('/email-setup');
  };

  if (isLoading) {
    console.log('⏳ Loading user data...');
    return <LoadingScreen />;
  }

  if (!user || !isAuthenticated) {
    console.log('🚫 No user or not authenticated...');
    return <LoadingScreen />;
  }

  // Show success screen if Slack was just connected
  if (user.slack_connection && slackMessage?.type === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Slack Connected Successfully! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            {slackMessage.message}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to email setup in a moment...
          </p>
          <button
            onClick={handleComplete}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue to Email Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Show error message if Slack connection failed */}
      {slackMessage?.type === 'error' && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{slackMessage.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSlackMessage(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <OnboardingScreen
        user={user}
        onSlackConnect={handleSlackConnect}
        onComplete={handleComplete}
        isConnecting={slackConnecting}
        connectionMessage={slackMessage}
      />
    </div>
  );
}