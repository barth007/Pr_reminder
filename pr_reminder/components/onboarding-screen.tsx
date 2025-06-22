"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import type { User } from "@/lib/api/types"

interface OnboardingScreenProps {
  user: User & { created_at?: string; updated_at?: string }
  onSlackConnect: () => Promise<void>
  onComplete: () => void
  isConnecting?: boolean
  connectionMessage?: {type: 'success' | 'error', message: string} | null
}

export function OnboardingScreen({ 
  user, 
  onSlackConnect, 
  onComplete, 
  isConnecting = false,
  connectionMessage 
}: OnboardingScreenProps) {
  const [internalConnecting, setInternalConnecting] = useState(false)

  const handleConnect = async () => {
    setInternalConnecting(true)
    try {
      await onSlackConnect()
      // Note: onSlackConnect will redirect, so this component will unmount
    } catch (error) {
      console.error('Connection failed:', error)
      setInternalConnecting(false)
      // Error handling is done in parent component
    }
  }

  const isCurrentlyConnecting = isConnecting || internalConnecting
  const isConnected = !!user.slack_connection

  // Show completion state if already connected
  if (isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Slack Connected!</CardTitle>
            <CardDescription>
              Your Slack workspace is now connected. Let&apos;s set up your email integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Avatar>
                <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Slack Connection</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </div>
              
              {user.slack_connection && (
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-2 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.522a2.528 2.528 0 0 1-2.52 2.523Zm0-6.58A2.528 2.528 0 0 1 2.522 6.062 2.528 2.528 0 0 1 5.042 3.54a2.528 2.528 0 0 1 2.52 2.522v2.523H5.042Zm6.58 0a2.528 2.528 0 0 1-2.522-2.523A2.528 2.528 0 0 1 11.622 3.54a2.528 2.528 0 0 1 2.522 2.522v2.523h-2.522Zm0 6.58a2.528 2.528 0 0 1 2.522 2.523 2.528 2.528 0 0 1-2.522 2.523H9.1v-2.523a2.528 2.528 0 0 1 2.522-2.523Zm6.58-2.523a2.528 2.528 0 0 1 2.522-2.522 2.528 2.528 0 0 1 2.523 2.522 2.528 2.528 0 0 1-2.523 2.523h-2.522v-2.523Zm0-6.58a2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.523h-2.522V6.062a2.528 2.528 0 0 1 2.522-2.522Z" />
                    </svg>
                    <span className="font-medium text-green-800">
                      {user.slack_connection.team_name || 'Slack Workspace'}
                    </span>
                  </div>
                  <p className="text-green-700">✅ Ready to receive PR notifications</p>
                </div>
              )}
            </div>

            <Button onClick={onComplete} className="w-full h-12 text-base font-medium" size="lg">
              Continue to Email Setup
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show connection screen for users without Slack
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to PR Reminder!</CardTitle>
          <CardDescription>
            Let&apos;s connect your Slack workspace to receive PR notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Slack Connection</span>
              {isCurrentlyConnecting ? (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Connecting...
                </Badge>
              ) : (
                <Badge variant="secondary">Not Connected</Badge>
              )}
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-blue-800">Why connect Slack?</span>
              </div>
              <ul className="text-blue-700 space-y-1">
                <li>• Get instant PR notifications in Slack</li>
                <li>• Never miss important code reviews</li>
                <li>• Keep your team workflow smooth</li>
              </ul>
            </div>

            <Button
              onClick={handleConnect}
              disabled={isCurrentlyConnecting}
              className="w-full h-12 text-base font-medium bg-[#4A154B] hover:bg-[#4A154B]/90 disabled:opacity-50"
              size="lg"
            >
              {isCurrentlyConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting to Slack...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.522a2.528 2.528 0 0 1-2.52 2.523Zm0-6.58A2.528 2.528 0 0 1 2.522 6.062 2.528 2.528 0 0 1 5.042 3.54a2.528 2.528 0 0 1 2.52 2.522v2.523H5.042Zm6.58 0a2.528 2.528 0 0 1-2.522-2.523A2.528 2.528 0 0 1 11.622 3.54a2.528 2.528 0 0 1 2.522 2.522v2.523h-2.522Zm0 6.58a2.528 2.528 0 0 1 2.522 2.523 2.528 2.528 0 0 1-2.522 2.523H9.1v-2.523a2.528 2.528 0 0 1 2.522-2.523Zm6.58-2.523a2.528 2.528 0 0 1 2.522-2.522 2.528 2.528 0 0 1 2.523 2.522 2.528 2.528 0 0 1-2.523 2.523h-2.522v-2.523Zm0-6.58a2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.523h-2.522V6.062a2.528 2.528 0 0 1 2.522-2.522Z" />
                  </svg>
                  Connect to Slack
                </>
              )}
            </Button>

            {connectionMessage?.type === 'error' && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">{connectionMessage.message}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}