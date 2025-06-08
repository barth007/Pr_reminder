// 📁 app/page.tsx (Root page - FIXED)
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/landing-page';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/lib/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('HomePage: Auth state check', { isLoading, isAuthenticated, user });
    
    if (isLoading) return;

    if (isAuthenticated && user) {
      console.log('HomePage: User is authenticated, redirecting based on setup status');
      // Redirect authenticated users based on their setup status
      if (!user.slack_connection) {
        console.log('HomePage: No Slack connection, redirecting to onboarding');
        router.push('/onboarding');
      } else {
        console.log('HomePage: Slack connected, redirecting to dashboard');
        router.push('/dashboard');
      }
    } else {
      console.log('HomePage: User not authenticated, staying on landing page');
    }
  }, [isAuthenticated, user, isLoading, router]);

  // ⭐ FIXED: Navigate to login page instead of calling login() directly
  const handleGetStarted = () => {
    console.log('HomePage: Get started clicked, navigating to login page');
    router.push('/login'); // Navigate to login page first
  };

  if (isLoading) {
    console.log('HomePage: Loading...');
    return <LoadingScreen />;
  }

  // Show landing page only for non-authenticated users
  console.log('HomePage: Showing landing page');
  return <LandingPage onGetStarted={handleGetStarted} />;
}