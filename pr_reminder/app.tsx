"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "./components/login-screen"
import { OnboardingScreen } from "./components/onboarding-screen"
import { DashboardScreen } from "./components/dashboard-screen"
import { SettingsScreen } from "./components/settings-screen"
import { LandingPage } from "./components/landing-page"
import { EmailSetupScreen } from "./components/email-setup-screen"
import { LoadingScreen } from "./components/loading-screen"
import { useAuth } from "./lib/hooks/useAuth"
import { User } from "./lib/api/types"


interface OnboardingScreenProps {
  user: User
}

type Screen = "landing" | "login" | "onboarding" | "email-setup" | "dashboard" | "settings"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const { user, isLoading, isAuthenticated, login, logout, connectSlack, testSlackNotification } = useAuth()

  // Determine the appropriate screen based on auth state and user data
  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      setCurrentScreen("landing")
      return
    }

    if (user) {
      // Check if user needs onboarding
      if (!user.slack_connection) {
        setCurrentScreen("onboarding")
      } else {
        // User is fully set up, go to dashboard
        setCurrentScreen("dashboard")
      }
    }
  }, [isAuthenticated, user, isLoading])

  const handleGetStarted = () => {
    setCurrentScreen("login")
  }

  const handleSlackConnect = async () => {
    try {
      connectSlack() // This will redirect to Slack OAuth
    } catch (error) {
      console.error('Failed to connect Slack:', error)
    }
  }

  const navigateToSettings = () => {
    setCurrentScreen("settings")
  }

  const navigateToDashboard = () => {
    setCurrentScreen("dashboard")
  }

  const navigateToEmailSetup = () => {
    setCurrentScreen("email-setup")
  }

  const handleTestSlackNotification = async () => {
    try {
      await testSlackNotification()
      // Could show a success toast here
    } catch (error) {
      console.error('Failed to send test notification:', error)
      // Could show an error toast here
    }
  }

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />
  }

  if (currentScreen === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={login} />
  }

  if (currentScreen === "onboarding" && user) {
    return (
      <OnboardingScreen
        user={user}
        onSlackConnect={handleSlackConnect}
        onComplete={navigateToEmailSetup}
      />
    )
  }

  if (currentScreen === "email-setup" && user) {
    return (
      <EmailSetupScreen
        user={user}
        onNavigateToDashboard={navigateToDashboard}
        onNavigateToSettings={navigateToSettings}
      />
    )
  }

  if (currentScreen === "dashboard" && user) {
    return (
      <DashboardScreen 
        user={user} 
        onLogout={logout} 
        onNavigateToSettings={navigateToSettings}
        onTestSlackNotification={handleTestSlackNotification}
      />
    )
  }

  if (currentScreen === "settings" && user) {
    return (
      <SettingsScreen 
        user={user} 
        onNavigateToDashboard={navigateToDashboard} 
        onLogout={logout}
        onTestSlackNotification={handleTestSlackNotification}
      />
    )
  }

  return null
}
