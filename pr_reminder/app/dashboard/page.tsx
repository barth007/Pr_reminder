// 📁 app/dashboard/page.tsx
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardScreen } from '@/components/dashboard-screen';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, testSlackNotification } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // If user doesn't have Slack connected, redirect to onboarding
    if (!user.slack_connection) {
      router.push('/onboarding');
      return;
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleNavigateToSettings = () => {
    router.push('/settings');
  };

  if (isLoading) return <LoadingScreen />;

  if (!user || !isAuthenticated) return <LoadingScreen />;

  return (
    <DashboardScreen
      user={user}
      onLogout={logout}
      onNavigateToSettings={handleNavigateToSettings}
      onTestSlackNotification={testSlackNotification}
    />
  );
}