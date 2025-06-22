// components/dashboard-screen.tsx (UPDATED to use real API data)
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ExternalLink, LogOut, Search, Settings, Loader2, Trash2, CheckCircle, RefreshCw } from "lucide-react"
import { usePRNotifications } from "@/lib/hooks/usePRNotification"
import { formatTimeAgo, getAuthorFromEmail, formatRepoName, formatPRTitle, formatPRNumber } from "@/lib/formatters"
import type { User, PRStats } from "@/lib/api/types"

interface DashboardScreenProps {
  user: User
  onLogout: () => void
  onNavigateToSettings: () => void
  onTestSlackNotification: () => Promise<void>
}

export function DashboardScreen({ user, onLogout, onNavigateToSettings, onTestSlackNotification }: DashboardScreenProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  
  // 🆕 Use updated hook with real API integration
  const { 
    notifications, 
    isLoading, 
    error, 
    totalCount,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    updateFilters,
    changePage,
    deleteNotification,
    markSlackSent,
    loadStats,
    refetch
  } = usePRNotifications()

  const [stats, setStats] = useState<PRStats | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set())

  const isSlackConnected = !!user.slack_connection

  // Load stats on component mount
  useEffect(() => {
    loadStats().then(setStats)
  }, [loadStats])

  // Handle filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters({
        status: statusFilter === 'all' ? undefined : statusFilter,
        // Note: For search, we could either use backend search or client-side filtering
        // For now, let's use client-side filtering to match existing behavior
      })
    }, 300) // Debounce filter updates

    return () => clearTimeout(timeoutId)
  }, [statusFilter, updateFilters])

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

  const handleDeleteNotification = async (id: string) => {
    setDeletingIds(prev => new Set(prev).add(id))
    try {
      const result = await deleteNotification(id)
      if (!result.success) {
        console.error('Delete failed:', result.error)
        // Could show error toast
      }
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleMarkSlackSent = async (id: string) => {
    setMarkingIds(prev => new Set(prev).add(id))
    try {
      const result = await markSlackSent(id)
      if (!result.success) {
        console.error('Mark Slack sent failed:', result.error)
        // Could show error toast
      }
    } finally {
      setMarkingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleRefresh = () => {
    refetch()
    loadStats().then(setStats)
  }

  // Client-side search filtering (for existing search behavior)
  const filteredPRs = notifications.filter(notification => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      formatRepoName(notification.repo_name).toLowerCase().includes(query) ||
      formatPRTitle(notification.pr_title).toLowerCase().includes(query) ||
      getAuthorFromEmail(notification.sender_email).toLowerCase().includes(query)
    )
  })

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "opened":
        return <Badge className="bg-green-100 text-green-800">Open</Badge>
      case "merged":
        return <Badge className="bg-purple-100 text-purple-800">Merged</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      case "updated":
        return <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>
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

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.name} />
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(" ")[0]}!</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Total PRs: {totalCount}</span>
            {stats && (
              <>
                <span>•</span>
                <span>Open: {stats.by_status?.opened || 0}</span>
                <span>•</span>
                <span>Slack Sent: {stats.slack_sent || 0}</span>
                <span>•</span>
                <span>Pending: {stats.pending_slack || 0}</span>
              </>
            )}
          </div>
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
              <SelectItem value="opened">Open</SelectItem>
              <SelectItem value="merged">Merged</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            disabled={!isSlackConnected || isSendingTest} 
            onClick={handleTestNotification}
            className="w-full sm:w-auto"
          >
            {isSendingTest ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Test Slack Notification
              </>
            )}
          </Button>
        </div>

        {/* Slack Status Alert */}
        {!isSlackConnected && (
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
                    Slack is not connected. Connect Slack in settings to enable notifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading your PR notifications...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    Failed to load notifications: {error}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PR Notifications List */}
        {!isLoading && !error && (
          <>
            <div className="space-y-4">
              {filteredPRs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {searchQuery 
                          ? "No pull request notifications found matching your search criteria." 
                          : "No pull request notifications found yet. Set up your email integration to start receiving notifications!"
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredPRs.map((notification) => (
                  <Card key={notification.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{formatPRTitle(notification.pr_title)}</h3>
                            {getStatusBadge(notification.pr_status)}
                            {notification.slack_sent && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                <Bell className="w-3 h-3 mr-1" />
                                Notified
                              </Badge>
                            )}
                            {notification.is_forwarded && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                📧 Forwarded
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="font-medium">{formatRepoName(notification.repo_name)}</span>
                            <span>by {getAuthorFromEmail(notification.sender_email)}</span>
                            <span>{formatTimeAgo(notification.received_at)}</span>
                            {notification.pr_number && (
                              <span>{formatPRNumber(notification.pr_number)}</span>
                            )}
                          </div>
                          {notification.pr_link ? (
                            <a
                              href={notification.pr_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              View on GitHub
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">No link available</span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.slack_sent && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkSlackSent(notification.id)}
                              disabled={markingIds.has(notification.id)}
                            >
                              {markingIds.has(notification.id) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={deletingIds.has(notification.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            {deletingIds.has(notification.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {filteredPRs.length} of {totalCount} notifications
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={!hasPrevious || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={!hasNext || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}