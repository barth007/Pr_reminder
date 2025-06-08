// 📁 app/settings/page.tsx
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsScreen } from '@/components/settings-screen';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, testSlackNotification } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleNavigateToDashboard = () => {
    router.push('/dashboard');
  };

  if (isLoading) return <LoadingScreen />;

  if (!user || !isAuthenticated) return <LoadingScreen />;

  return (
    <SettingsScreen
      user={user}
      onNavigateToDashboard={handleNavigateToDashboard}
      onLogout={logout}
      onTestSlackNotification={async () => { await testSlackNotification(); }}
    />
  );
}