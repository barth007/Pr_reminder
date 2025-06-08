"use client"

import { useState } from "react"
import { LoginScreen } from "./components/login-screen"
import { OnboardingScreen } from "./components/onboarding-screen"
import { DashboardScreen } from "./components/dashboard-screen"
import { SettingsScreen } from "./components/settings-screen"
import { LandingPage } from "./components/landing-page"
import { EmailSetupScreen } from "./components/email-setup-screen"

type Screen = "landing" | "login" | "onboarding" | "email-setup" | "dashboard" | "settings"

interface User {
  name: string
  email: string
  image: string
  slackConnected: boolean
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing")
  const [user, setUser] = useState<User | null>(null)

  const handleGetStarted = () => {
    setCurrentScreen("login")
  }

  const handleLogin = () => {
    // Mock user data after Google login
    setUser({
      name: "John Doe",
      email: "john.doe@gmail.com",
      image: "/placeholder.svg?height=40&width=40",
      slackConnected: false,
    })
    setCurrentScreen("onboarding")
  }

  const handleSlackConnect = () => {
    if (user) {
      setUser({ ...user, slackConnected: true })
      setTimeout(() => {
        setCurrentScreen("email-setup")
      }, 1500)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentScreen("landing")
  }

  const navigateToSettings = () => {
    setCurrentScreen("settings")
  }

  const navigateToDashboard = () => {
    setCurrentScreen("dashboard")
  }

  if (currentScreen === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (currentScreen === "onboarding" && user) {
    return <OnboardingScreen user={user} onSlackConnect={handleSlackConnect} />
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
    return <DashboardScreen user={user} onLogout={handleLogout} onNavigateToSettings={navigateToSettings} />
  }

  if (currentScreen === "settings" && user) {
    return <SettingsScreen user={user} onNavigateToDashboard={navigateToDashboard} onLogout={handleLogout} />
  }

  return null
}
