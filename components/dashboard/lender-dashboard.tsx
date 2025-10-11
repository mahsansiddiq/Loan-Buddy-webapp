"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import {
  getLoansByLender,
  getPendingLoansForLender,
  getNotificationsByUser,
  formatCurrency,
  formatDate,
  getStatusColor,
  getBorrowerName,
  getBorrowerCreditScore,
} from "@/lib/mock-data"
import Link from "next/link"
import { useState } from "react"

const DollarSign = () => <span>💲</span>
const TrendingUp = () => <span>📈</span>
const Clock = () => <span>🕒</span>
const Users = () => <span>👥</span>
const Eye = () => <span>👁️</span>
const Check = () => <span>✔️</span>
const X = () => <span>✖️</span>
const AlertTriangle = () => <span>⚠️</span>
const Star = () => <span>⭐</span>

export function LenderDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<"pending" | "active">("pending")

  if (!user) return null

  const myLoans = getLoansByLender(user.id)
  const pendingRequests = getPendingLoansForLender()
  const notifications = getNotificationsByUser(user.id)
  const unreadNotifications = notifications.filter((n) => !n.isRead)

  const activeLoans = myLoans.filter((loan) => loan.status === "active")
  const totalLent = activeLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = activeLoans.reduce((sum, loan) => sum + loan.totalRepaid, 0)
  const expectedReturns = activeLoans.reduce((sum, loan) => {
    if (loan.monthlyPayment && loan.termMonths) return sum + loan.monthlyPayment * loan.termMonths
    return sum + loan.amount
  }, 0)

  const handleLoanAction = (loanId: string, action: "approve" | "reject") => {
    // In a real app, this would call an API
    console.log(`${action} loan ${loanId}`)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-balance">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Manage your lending portfolio and review new requests</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalLent)} total lent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repaid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRepaid)}</div>
            <p className="text-xs text-muted-foreground">
              {totalLent > 0 ? Math.round((totalRepaid / totalLent) * 100) : 0}% of principal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expectedReturns)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Loan Management</CardTitle>
                  <CardDescription>Review requests and manage your portfolio</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedTab === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTab("pending")}
                  >
                    Pending ({pendingRequests.length})
                  </Button>
                  <Button
                    variant={selectedTab === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTab("active")}
                  >
                    Active ({activeLoans.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTab === "pending" && (
                <>
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                      <p className="text-muted-foreground">New loan requests will appear here for your review</p>
                    </div>
                  ) : (
                    pendingRequests.slice(0, 5).map((loan) => (
                      <div key={loan.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{loan.purpose}</h4>
                              <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{getBorrowerName(loan.borrowerId)}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-500" />
                                <span>{getBorrowerCreditScore(loan.borrowerId)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatCurrency(loan.amount)}</span>
                              <span>{loan.termMonths} months</span>
                              <span>Applied {formatDate(loan.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoanAction(loan.id, "approve")}
                            className="flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoanAction(loan.id, "reject")}
                            className="flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/loans/${loan.id}`} className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {selectedTab === "active" && (
                <>
                  {activeLoans.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No active loans</h3>
                      <p className="text-muted-foreground">Approved loans will appear here</p>
                    </div>
                  ) : (
                    activeLoans.map((loan) => (
                      <div key={loan.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{loan.purpose}</h4>
                              <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{getBorrowerName(loan.borrowerId)}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span>{formatCurrency(loan.amount)}</span>
                              <span>{loan.termMonths} months</span>
                              <span>Next: {loan.nextDueDate ? formatDate(loan.nextDueDate) : "N/A"}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Repayment Progress</span>
                                <span>
                                  {formatCurrency(loan.totalRepaid)} / {formatCurrency(loan.amount)}
                                </span>
                              </div>
                              <Progress value={(loan.totalRepaid / loan.amount) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/loans/${loan.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Invested</span>
                <span className="font-medium">{formatCurrency(totalLent)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Repaid</span>
                <span className="font-medium">{formatCurrency(totalRepaid)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Outstanding</span>
                <span className="font-medium">{formatCurrency(totalLent - totalRepaid)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Expected Returns</span>
                <span className="font-bold text-green-600">{formatCurrency(expectedReturns)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>{unreadNotifications.length} unread</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${!notification.isRead ? "bg-muted/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium">{notification.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No notifications yet</p>
              )}
            </CardContent>
          </Card>

          {/* Risk Alert */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                Risk Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700">
                2 loans have payments overdue by more than 7 days. Consider reaching out to borrowers.
              </p>
              <Button size="sm" variant="outline" className="mt-3 bg-transparent">
                View Overdue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
