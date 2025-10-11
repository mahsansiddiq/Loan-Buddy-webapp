"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { getLoansByBorrower, getNotificationsByUser, formatCurrency, formatDate, getStatusColor } from "@/lib/mock-data"
import Link from "next/link"

const PlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)
const CreditCardIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
)
const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const TrendingUpIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M14 5h7v7" />
  </svg>
)
const AlertCircleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
)

export function BorrowerDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const loans = getLoansByBorrower(user.id)
  const notifications = getNotificationsByUser(user.id)
  const unreadNotifications = notifications.filter((n) => !n.isRead)

  const activeLoans = loans.filter((loan) => loan.status === "active")
  const pendingLoans = loans.filter((loan) => loan.status === "pending")
  const totalBorrowed = activeLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = activeLoans.reduce((sum, loan) => sum + loan.totalRepaid, 0)
  const totalOutstanding = totalBorrowed - totalRepaid

  // Calculate next payment due
  const nextPaymentLoan = activeLoans.find((loan) => loan.nextDueDate)
  const nextPaymentAmount = nextPaymentLoan?.monthlyPayment || 0

  const firstActiveLoan = activeLoans[0]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-balance">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Here's an overview of your loan activity</p>
        </div>
        <div className="flex gap-2">
          {firstActiveLoan && (
            <Button className="bg-secondary text-white hover:bg-secondary/90" asChild>
              <Link href={`/loans/${firstActiveLoan.id}/repay`} className="flex items-center gap-2">
                <CreditCardIcon />
                Make a Payment
              </Link>
            </Button>
          )}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/apply" className="flex items-center gap-2">
              <PlusIcon />
              Apply for Loan
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCardIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalBorrowed)} total borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircleIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLoans.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <TrendingUpIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalRepaid)} repaid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <CalendarIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(nextPaymentAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {nextPaymentLoan?.nextDueDate ? formatDate(nextPaymentLoan.nextDueDate) : "No payments due"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Loans */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Loans</CardTitle>
              <CardDescription>Track your active and pending loan applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loans.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">
                    <CreditCardIcon />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No loans yet</h3>
                  <p className="text-muted-foreground mb-4">Start by applying for your first loan</p>
                  <Button asChild>
                    <Link href="/apply">Apply Now</Link>
                  </Button>
                </div>
              ) : (
                loans.slice(0, 3).map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{loan.purpose}</h4>
                        <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatCurrency(loan.amount)}</span>
                        <span>{loan.termMonths} months</span>
                      </div>
                      {loan.status === "active" && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Repayment Progress</span>
                            <span>{Math.round((loan.totalRepaid / loan.amount) * 100)}%</span>
                          </div>
                          <Progress value={(loan.totalRepaid / loan.amount) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/loans/${loan.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {loans.length > 3 && (
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/loans">View All Loans</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/apply" className="flex items-center gap-2">
                  <PlusIcon />
                  Apply for New Loan
                </Link>
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link
                  href={firstActiveLoan ? `/loans/${firstActiveLoan.id}/repay` : "/loans"}
                  className="flex items-center gap-2"
                >
                  <CreditCardIcon />
                  Make Payment
                </Link>
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/loans" className="flex items-center gap-2">
                  <TrendingUpIcon />
                  View Loan History
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
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
        </div>
      </div>
    </div>
  )
}
