"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import {
  getAllLoans,
  getRepaymentsByLoan,
  formatCurrency,
  formatDate,
  getStatusColor,
  getBorrowerName,
} from "@/lib/mock-data"
import Link from "next/link"
import { LoanApprovalActions } from "./loan-approval-actions"
import { useState } from "react"

interface LoanDetailsProps {
  loanId: string
}

export function LoanDetails({ loanId }: LoanDetailsProps) {
  const { user } = useAuth()
  const [loan, setLoan] = useState(() => {
    const allLoans = getAllLoans()
    return allLoans.find((l) => l.id === loanId)
  })

  if (!loan) {
    return (
      <div className="text-center py-12">
        <span className="w-12 h-12 text-muted-foreground mx-auto mb-4">⚠️</span>
        <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The loan you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const repayments = getRepaymentsByLoan(loanId)
  const repaymentProgress = loan.amount > 0 ? (loan.totalRepaid / loan.amount) * 100 : 0
  const remainingBalance = loan.amount - loan.totalRepaid
  const borrowerName = getBorrowerName(loan.borrowerId)

  const canViewDetails = user?.role === "admin" || user?.id === loan.borrowerId || user?.id === loan.lenderId

  if (!canViewDetails) {
    return (
      <div className="text-center py-12">
        <span className="w-12 h-12 text-muted-foreground mx-auto mb-4">⚠️</span>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to view this loan.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const handleApprove = (loanId: string, notes?: string) => {
    console.log(`[v0] Approving loan ${loanId} without interest`)
    // In a real app, this would make an API call
    setLoan((prev) =>
      prev
        ? {
            ...prev,
            status: "approved" as const,
            approvedAt: new Date().toISOString(),
            monthlyPayment: calculateMonthlyPayment(prev.amount, prev.termMonths),
          }
        : null,
    )
    alert(`Loan approved!`)
  }

  const handleReject = (loanId: string, reason: string) => {
    console.log(`Rejecting loan ${loanId} for reason: ${reason}`)
    setLoan((prev) => (prev ? { ...prev, status: "rejected" as const } : null))
    alert(`Loan rejected: ${reason}`)
  }

  const handleFlag = (loanId: string, reason: string) => {
    console.log(`Flagging loan ${loanId} for reason: ${reason}`)
    setLoan((prev) => (prev ? { ...prev, status: "flagged" as const } : null))
    alert(`Loan flagged for admin review: ${reason}`)
  }

  const calculateMonthlyPayment = (principal: number, months: number) => {
    if (!months) return principal
    return principal / months
  }

  const showApprovalActions =
    (loan.status === "pending" || loan.status === "flagged") &&
    (user?.role === "lender" || user?.role === "admin") &&
    user?.id !== loan.borrowerId

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-balance">Loan Details</h1>
          <p className="text-muted-foreground">
            Loan #{loan.id} • {loan.purpose}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(loan.status)} variant="outline">
            {loan.status}
          </Badge>
          {loan.status === "active" && user?.id === loan.borrowerId && (
            <Button asChild>
              <Link href={`/loans/${loan.id}/repay`}>Make Payment</Link>
            </Button>
          )}
        </div>
      </div>

      {showApprovalActions && (
        <LoanApprovalActions
          loan={loan}
          userRole={user?.role as "lender" | "admin"}
          onApprove={handleApprove}
          onReject={handleReject}
          onFlag={handleFlag}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-5 h-5">📄</span>
                Loan Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(loan.amount)}</div>
                  <div className="text-sm text-muted-foreground">Principal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{loan.termMonths}</div>
                  <div className="text-sm text-muted-foreground">Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {loan.monthlyPayment ? formatCurrency(loan.monthlyPayment) : "TBD"}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Purpose</span>
                  <span className="font-medium">{loan.purpose}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Applied</span>
                  <span className="font-medium">{formatDate(loan.createdAt)}</span>
                </div>
                {loan.approvedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Approved</span>
                    <span className="font-medium">{formatDate(loan.approvedAt)}</span>
                  </div>
                )}
                {loan.nextDueDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Payment</span>
                    <span className="font-medium">{formatDate(loan.nextDueDate)}</span>
                  </div>
                )}
              </div>

              {loan.status === "active" && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Repayment Progress</span>
                      <span>{Math.round(repaymentProgress)}% Complete</span>
                    </div>
                    <Progress value={repaymentProgress} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Paid: {formatCurrency(loan.totalRepaid)}</span>
                      <span>Remaining: {formatCurrency(remainingBalance)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Repayment History */}
          {loan.status === "active" && repayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-5 h-5">💳</span>
                  Repayment History
                </CardTitle>
                <CardDescription>Track of all payments made</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repayments.map((repayment) => (
                    <div key={repayment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="w-4 h-4 text-green-600">✅</span>
                        </div>
                        <div>
                          <div className="font-medium">{formatCurrency(repayment.amount)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(repayment.paidAt)} • {repayment.method}
                          </div>
                          {repayment.note && <div className="text-xs text-muted-foreground mt-1">{repayment.note}</div>}
                        </div>
                      </div>
                      {repayment.receiptUrl && (
                        <Button size="sm" variant="ghost">
                          <span className="w-3 h-3 mr-1">⬇️</span>
                          Receipt
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-5 h-5">👤</span>
                Loan Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Borrower</div>
                <div className="font-medium">{borrowerName}</div>
              </div>
              {loan.lenderName && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Lender</div>
                  <div className="font-medium">{loan.lenderName}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.id === loan.borrowerId && loan.status === "active" && (
                <Button className="w-full justify-start" asChild>
                  <Link href={`/loans/${loan.id}/repay`} className="flex items-center gap-2">
                    <span className="w-4 h-4">💳</span>
                    Make Payment
                  </Link>
                </Button>
              )}

              {(loan.status === "approved" || loan.status === "active" || loan.status === "closed") && (
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <Link href={`/loans/${loan.id}/agreement`}>
                    <span className="w-4 h-4 mr-2">⬇️</span>
                    Download Agreement
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-5 h-5">🕒</span>
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Application Submitted</div>
                    <div className="text-xs text-muted-foreground">{formatDate(loan.createdAt)}</div>
                  </div>
                </div>

                {loan.approvedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Loan Approved</div>
                      <div className="text-xs text-muted-foreground">{formatDate(loan.approvedAt)}</div>
                    </div>
                  </div>
                )}

                {loan.status === "active" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Loan Active</div>
                      <div className="text-xs text-muted-foreground">Payments in progress</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
