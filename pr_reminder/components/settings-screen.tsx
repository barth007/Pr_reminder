// components/settings-screen.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import type { User } from "@/lib/api/types"

interface SettingsScreenProps {
  user: User
  onNavigateToDashboard: () => void
  onLogout: () => void
  onTestSlackNotification: () => Promise<void>
}

export function SettingsScreen({ user, onNavigateToDashboard, onLogout, onTestSlackNotification }: SettingsScreenProps) {
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [reminderDays, setReminderDays] = useState("3")
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  
  const { connectSlack, disconnectSlack } = useAuth()
  const isSlackConnected = !!user.slack_connection

  const handleSlackConnect = () => {
    connectSlack()
  }

  const handleSlackDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await disconnectSlack()
      // User will be updated automatically through the useAuth hook
    } catch (error) {
      console.error('Failed to disconnect Slack:', error)
      // Could show an error toast here
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleTestNotification = async () => {
    if (!isSlackConnected) return
    
    setIsSendingTest(true)
    try {
      await onTestSlackNotification()
      // Could show a success toast here
    } catch (error) {
      console.error('Failed to send test notification:', error)
      // Could show an error toast here
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onNavigateToDashboard} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>

            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information from Google</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Slack Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Slack Integration</CardTitle>
              <CardDescription>Connect your Slack workspace to receive PR reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#4A154B] rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.522a2.528 2.528 0 0 1-2.52 2.523Zm0-6.58A2.528 2.528 0 0 1 2.522 6.062 2.528 2.528 0 0 1 5.042 3.54a2.528 2.528 0 0 1 2.52 2.522v2.523H5.042Zm6.58 0a2.528 2.528 0 0 1-2.522-2.523A2.528 2.528 0 0 1 11.622 3.54a2.528 2.528 0 0 1 2.522 2.522v2.523h-2.522Zm0 6.58a2.528 2.528 0 0 1 2.522 2.523 2.528 2.528 0 0 1-2.522 2.523H9.1v-2.523a2.528 2.528 0 0 1 2.522-2.523Zm6.58-2.523a2.528 2.528 0 0 1 2.522-2.522 2.528 2.528 0 0 1 2.523 2.522 2.528 2.528 0 0 1-2.523 2.523h-2.522v-2.523Zm0-6.58a2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.523h-2.522V6.062a2.528 2.528 0 0 1 2.522-2.522Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Slack Workspace</p>
                      <p className="text-sm text-gray-600">
                        {isSlackConnected ? `Connected to ${user.slack_connection?.team_name || 'your workspace'}` : "Not connected"}
                      </p>
                    </div>
                  </div>

                  {isSlackConnected ? (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSlackDisconnect}
                        disabled={isDisconnecting}
                      >
                        {isDisconnecting ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Disconnecting...
                          </>
                        ) : (
                          'Disconnect'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button className="bg-[#4A154B] hover:bg-[#4A154B]/90" onClick={handleSlackConnect}>
                      Connect Slack
                    </Button>
                  )}
                </div>

                {/* Slack Connection Details */}
                {isSlackConnected && user.slack_connection && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Team:</span>
                        <p className="text-gray-600">{user.slack_connection.team_name || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Connected:</span>
                        <p className="text-gray-600">
                          {new Date(user.slack_connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Notification Button */}
                {isSlackConnected && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleTestNotification}
                      disabled={isSendingTest}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {isSendingTest ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Test...
                        </>
                      ) : (
                        'Send Test Notification'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>PR Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive Slack reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Enable Slack Reminders</div>
                  <div className="text-sm text-gray-600">Receive notifications about your open pull requests</div>
                </div>
                <Switch
                  checked={remindersEnabled}
                  onCheckedChange={setRemindersEnabled}
                  disabled={!isSlackConnected}
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium">Reminder Frequency</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Remind me if PR is open for</span>
                  <Select
                    value={reminderDays}
                    onValueChange={setReminderDays}
                    disabled={!remindersEnabled || !isSlackConnected}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">days</span>
                </div>
              </div>

              {!isSlackConnected && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        Connect your Slack workspace to enable notification settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Email Integration</CardTitle>
              <CardDescription>Information about your email setup for receiving PR notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        To receive PR notifications, add your unique email address to your GitHub repository notification settings.
                        This email will be generated after you complete the setup process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}