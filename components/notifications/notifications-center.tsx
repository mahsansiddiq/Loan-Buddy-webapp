"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { getNotificationsByUser, formatDate } from "@/lib/mock-data"
import { Bell, Check, CheckCheck, MoreHorizontal, AlertCircle, CreditCard, UserCheck, Info, Trash2 } from "lucide-react"

export function NotificationsCenter() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState("all")

  if (!user) return null

  const notifications = getNotificationsByUser(user.id)
  const unreadNotifications = notifications.filter((n) => !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "loan_approved":
        return <UserCheck className="w-4 h-4 text-green-600" />
      case "loan_rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "repayment_due":
        return <CreditCard className="w-4 h-4 text-yellow-600" />
      case "repayment_received":
        return <Check className="w-4 h-4 text-green-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "loan_approved":
        return "border-l-green-500 bg-green-50"
      case "loan_rejected":
        return "border-l-red-500 bg-red-50"
      case "repayment_due":
        return "border-l-yellow-500 bg-yellow-50"
      case "repayment_received":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    console.log("Mark as read:", notificationId)
  }

  const handleMarkAllAsRead = () => {
    console.log("Mark all as read")
  }

  const handleDeleteNotification = (notificationId: string) => {
    console.log("Delete notification:", notificationId)
  }

  const filteredNotifications = () => {
    switch (selectedTab) {
      case "unread":
        return unreadNotifications
      case "read":
        return readNotifications
      default:
        return notifications
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-balance">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your loan activity</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifications.length > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Badge variant="secondary">{unreadNotifications.length} unread</Badge>
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Your Notifications
          </CardTitle>
          <CardDescription>All your loan-related updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
              <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {filteredNotifications().length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      {selectedTab === "unread"
                        ? "You're all caught up! No unread notifications."
                        : "You don't have any notifications yet."}
                    </p>
                  </div>
                ) : (
                  filteredNotifications().map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-l-4 rounded-lg p-4 ${getNotificationColor(notification.type)} ${
                        !notification.isRead ? "shadow-sm" : "opacity-75"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{formatDate(notification.createdAt)}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.type.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {!notification.isRead && (
                              <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
