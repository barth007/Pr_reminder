"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ExternalLink, LogOut, Search, Settings } from "lucide-react"

interface UserType {
  name: string
  email: string
  image: string
  slackConnected: boolean
}

interface PR {
  id: string
  title: string
  repo: string
  url: string
  status: "open" | "merged" | "closed"
  timestamp: string
  author: string
}

interface DashboardScreenProps {
  user: UserType
  onLogout: () => void
  onNavigateToSettings: () => void
}

const mockPRs: PR[] = [
  {
    id: "1",
    title: "Add user authentication flow",
    repo: "frontend-app",
    url: "https://github.com/company/frontend-app/pull/123",
    status: "open",
    timestamp: "2 hours ago",
    author: "john-doe",
  },
  {
    id: "2",
    title: "Fix database connection timeout",
    repo: "backend-api",
    url: "https://github.com/company/backend-api/pull/456",
    status: "open",
    timestamp: "1 day ago",
    author: "jane-smith",
  },
  {
    id: "3",
    title: "Update documentation for API endpoints",
    repo: "docs",
    url: "https://github.com/company/docs/pull/789",
    status: "merged",
    timestamp: "3 days ago",
    author: "bob-wilson",
  },
  {
    id: "4",
    title: "Implement dark mode toggle",
    repo: "frontend-app",
    url: "https://github.com/company/frontend-app/pull/321",
    status: "closed",
    timestamp: "1 week ago",
    author: "alice-brown",
  },
]

export function DashboardScreen({ user, onLogout, onNavigateToSettings }: DashboardScreenProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPRs = mockPRs.filter((pr) => {
    const matchesStatus = statusFilter === "all" || pr.status === statusFilter
    const matchesSearch =
      pr.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">Open</Badge>
      case "merged":
        return <Badge className="bg-purple-100 text-purple-800">Merged</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">PR Reminder</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={onNavigateToSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(" ")[0]}!</h2>
          <p className="text-gray-600">Here are your GitHub Pull Requests</p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by repository or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="merged">Merged</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button disabled={!user.slackConnected} className="w-full sm:w-auto">
            <Bell className="mr-2 h-4 w-4" />
            Trigger Reminder Now
          </Button>
        </div>

        {/* Slack Status Alert */}
        {!user.slackConnected && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
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
                    Slack is not connected. Connect Slack in settings to enable reminders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PR List */}
        <div className="space-y-4">
          {filteredPRs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">No pull requests found matching your criteria.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPRs.map((pr) => (
              <Card key={pr.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{pr.title}</h3>
                        {getStatusBadge(pr.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{pr.repo}</span>
                        <span>by {pr.author}</span>
                        <span>{pr.timestamp}</span>
                      </div>
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        View on GitHub
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
