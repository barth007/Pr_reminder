"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, CheckCircle, Copy, Mail, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  name: string
  email: string
  image: string
  slackConnected: boolean
}

interface EmailSetupScreenProps {
  user: User
  onNavigateToDashboard: () => void
  onNavigateToSettings: () => void
}

export function EmailSetupScreen({ user, onNavigateToDashboard, onNavigateToSettings }: EmailSetupScreenProps) {
  const [copied, setCopied] = useState(false)
  const emailAddress = `pr-${Math.random().toString(36).substring(2, 8)}@prreminder.app`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Card */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-green-800">Slack Connected Successfully!</h3>
                <p className="text-green-700">
                  Your Slack workspace is now connected to PR Reminder. You're almost ready to start receiving
                  notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Set Up Your Email Integration</CardTitle>
                <CardDescription>
                  Use this unique email address to receive notifications about your pull requests
                </CardDescription>
              </div>
              <Avatar>
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Address Card */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Your Unique Email Address</p>
                      <p className="text-lg font-mono font-bold text-blue-900">{emailAddress}</p>
                    </div>
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className={`${copied ? "bg-green-100 text-green-800 border-green-300" : ""}`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Email
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Tabs */}
            <Tabs defaultValue="github" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="github">GitHub Setup</TabsTrigger>
                <TabsTrigger value="gitlab">GitLab Setup</TabsTrigger>
              </TabsList>
              <TabsContent value="github" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-4">How to set up with GitHub</h3>
                <ol className="space-y-6">
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Go to your GitHub repository settings</p>
                      <p className="text-gray-600 mt-1">
                        Navigate to the repository you want to monitor, click on "Settings" and then "Notifications".
                      </p>
                      <div className="mt-2 border rounded-md overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=400"
                          alt="GitHub repository settings"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Add your unique email address</p>
                      <p className="text-gray-600 mt-1">
                        Add the email address shown above to receive notifications about pull requests.
                      </p>
                      <div className="mt-2 border rounded-md overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=400"
                          alt="Adding email to GitHub"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Configure notification settings</p>
                      <p className="text-gray-600 mt-1">
                        Choose which events should trigger notifications. We recommend enabling notifications for pull
                        request reviews and comments.
                      </p>
                    </div>
                  </li>
                </ol>
              </TabsContent>
              <TabsContent value="gitlab" className="p-4 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-4">How to set up with GitLab</h3>
                <ol className="space-y-6">
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Go to your GitLab project settings</p>
                      <p className="text-gray-600 mt-1">
                        Navigate to the project you want to monitor, click on "Settings" and then "Integrations".
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Set up email service integration</p>
                      <p className="text-gray-600 mt-1">
                        Add the email address shown above as the recipient for merge request notifications.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Configure notification triggers</p>
                      <p className="text-gray-600 mt-1">
                        Select which events should trigger notifications. We recommend enabling notifications for merge
                        request events.
                      </p>
                    </div>
                  </li>
                </ol>
              </TabsContent>
            </Tabs>

            {/* Tips */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-amber-800">
                <p className="font-medium">Pro Tips:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Keep this email address private to prevent unauthorized notifications</li>
                  <li>You can regenerate this email address in settings if needed</li>
                  <li>
                    Configure your notification preferences in the settings to control how often you receive Slack
                    alerts
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={onNavigateToDashboard} className="flex-1">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={onNavigateToSettings} variant="outline" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Configure Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What's Next Card */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Follow these steps to complete your setup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Badge className="mt-1 mr-4 bg-green-100 text-green-800 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Connect Google Account</p>
                  <p className="text-sm text-gray-600">Your Google account is successfully connected</p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge className="mt-1 mr-4 bg-green-100 text-green-800 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Connect Slack Workspace</p>
                  <p className="text-sm text-gray-600">Your Slack workspace is successfully connected</p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge className="mt-1 mr-4 bg-blue-100 text-blue-800 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  3
                </Badge>
                <div>
                  <p className="font-medium">Set Up Email Integration</p>
                  <p className="text-sm text-gray-600">Add your unique email to your Git repositories</p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge className="mt-1 mr-4 bg-gray-100 text-gray-800 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  4
                </Badge>
                <div>
                  <p className="font-medium">Configure Notification Preferences</p>
                  <p className="text-sm text-gray-600">Set up how and when you want to receive notifications</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
