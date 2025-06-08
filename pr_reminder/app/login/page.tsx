// 📁 app/login/page.tsx (New login page)
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/login-screen';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, login } = useAuth();

  useEffect(() => {
    console.log('LoginPage: Auth state check', { isLoading, isAuthenticated, user });
    
    if (isLoading) return;

    // If user is already authenticated, redirect them appropriately
    if (isAuthenticated && user) {
      console.log('LoginPage: User already authenticated, redirecting...');
      if (!user.slack_connection) {
        console.log('LoginPage: No Slack connection, redirecting to onboarding');
        router.push('/onboarding');
      } else {
        console.log('LoginPage: Slack connected, redirecting to dashboard');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // ⭐ FIXED: This calls the actual Google OAuth login
  const handleLogin = () => {
    console.log('LoginPage: Login button clicked, starting Google OAuth');
    login(); // This redirects to Google OAuth
  };

  if (isLoading) {
    console.log('LoginPage: Loading...');
    return <LoadingScreen />;
  }

  // Show login screen for non-authenticated users
  console.log('LoginPage: Showing login screen');
  return <LoginScreen onLogin={handleLogin} />;
}