// 📁 app/email-setup/page.tsx
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmailSetupScreen } from '@/components/email-setup-screen';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/lib/hooks/useAuth';

export default function EmailSetupPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // If user doesn't have Slack connected, redirect to onboarding first
    if (!user.slack_connection) {
      router.push('/onboarding');
      return;
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleNavigateToDashboard = () => {
    router.push('/dashboard');
  };

  const handleNavigateToSettings = () => {
    router.push('/settings');
  };

  if (isLoading) return <LoadingScreen />;

  if (!user || !isAuthenticated) return <LoadingScreen />;

  return (
    <EmailSetupScreen
      user={user}
      onNavigateToDashboard={handleNavigateToDashboard}
      onNavigateToSettings={handleNavigateToSettings}
    />
  );
}
