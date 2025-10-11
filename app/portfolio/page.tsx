"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getAllLoans, formatCurrency, getStatusColor, getBorrowerName, type Loan } from "@/lib/mock-data"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

// Inline icons
const TrendingUp = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M14 5h7v7" />
  </svg>
)
const DollarSign = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1v22" />
    <path d="M17 5a5 5 0 0 0-5-2 5 5 0 0 0 0 10 5 5 0 0 1 0 10 5 5 0 0 1-5-2" />
  </svg>
)
const Users = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const Clock = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
const Eye = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const AlertCircle = () => (
  <svg
    className="w-12 h-12 text-muted-foreground mx-auto mb-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
)

export default function PortfolioPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loans, setLoans] = useState<Loan[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "lender") {
      router.push("/dashboard")
      return
    }

    // Get loans for this lender
    const allLoans = getAllLoans()
    const lenderLoans = allLoans.filter((loan) => loan.lenderId === user.id)
    setLoans(lenderLoans)
  }, [user, router])

  if (!user || user.role !== "lender") {
    return null
  }

  const activeLoans = loans.filter((loan) => loan.status === "active")
  const totalLent = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.totalRepaid, 0)
  const expectedReturns = loans.reduce((sum, loan) => {
    if (loan.monthlyPayment && loan.termMonths) {
      return sum + loan.monthlyPayment * loan.termMonths
    }
    return sum + loan.amount
  }, 0)

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-balance mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">Track your lending performance and manage your investments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Lent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalLent)}</p>
                </div>
                <DollarSign />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Repaid</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRepaid)}</p>
                </div>
                <TrendingUp />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold text-blue-600">{activeLoans.length}</p>
                </div>
                <Users />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expected Returns</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(expectedReturns)}</p>
                </div>
                <Clock />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Repayment Progress</span>
                <span>{totalLent > 0 ? Math.round((totalRepaid / totalLent) * 100) : 0}%</span>
              </div>
              <Progress value={totalLent > 0 ? (totalRepaid / totalLent) * 100 : 0} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-medium">{loans.length}</p>
                  <p className="text-muted-foreground">Total Loans</p>
                </div>
                <div>
                  <p className="font-medium">{loans.filter((l) => l.status === "closed").length}</p>
                  <p className="text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="font-medium">
                    {totalLent > 0 ? (((expectedReturns - totalLent) / totalLent) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-muted-foreground">Expected ROI</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle>Your Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loans.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle />
                <p className="text-muted-foreground mb-4">You haven't funded any loans yet.</p>
                <Button asChild>
                  <Link href="/loans">Browse Loan Requests</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{loan.purpose}</h3>
                          <Badge className={getStatusColor(loan.status)}>
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Borrower</p>
                            <p className="font-medium">{getBorrowerName(loan.borrowerId)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium">{formatCurrency(loan.amount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Term</p>
                            <p className="font-medium">{loan.termMonths} months</p>
                          </div>
                        </div>

                        {loan.status === "active" && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Repayment Progress</span>
                              <span>{Math.round((loan.totalRepaid / loan.amount) * 100)}%</span>
                            </div>
                            <Progress value={(loan.totalRepaid / loan.amount) * 100} className="h-2" />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/loans/${loan.id}`}>
                            <Eye />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
