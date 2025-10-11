"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate, getStatusColor, type Loan } from "@/lib/mock-data"
import Link from "next/link"

const SearchIcon = () => <span>🔍</span>
const FilterIcon = () => <span>🔽</span>
const EyeIcon = () => <span>👁️</span>
const DownloadIcon = () => <span>⬇️</span>
const FlagIcon = () => <span>🚩</span>
const AlertTriangleIcon = () => <span>⚠️</span>
const CreditCardIcon = () => <span>💳</span>

interface LoanListProps {
  loans: Loan[]
  userRole: "borrower" | "lender" | "admin"
  showBorrowerInfo?: boolean
  onFlagLoan?: (loanId: string) => void
}

export function LoanList({ loans, userRole, showBorrowerInfo = false, onFlagLoan }: LoanListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Filter and sort loans
  const filteredLoans = loans
    .filter((loan) => {
      const matchesSearch =
        loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loan.lenderName && loan.lenderName.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || loan.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "amount-high":
          return b.amount - a.amount
        case "amount-low":
          return a.amount - b.amount
        default:
          return 0
      }
    })

  const getProgressPercentage = (loan: Loan) => {
    if (loan.status === "closed") return 100
    if (loan.status === "pending" || loan.status === "rejected") return 0
    if (!loan.monthlyPayment || !loan.termMonths) return 0

    const totalAmount = loan.monthlyPayment * loan.termMonths
    return Math.min((loan.totalRepaid / totalAmount) * 100, 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold">
            {userRole === "admin" ? "All Loans" : userRole === "lender" ? "Loan Requests" : "My Loans"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "admin"
              ? "Manage all loans across the platform"
              : userRole === "lender"
                ? "Browse loan requests and manage your funded loans"
                : "View your loan applications and active loans"}
          </p>
        </div>

        {userRole === "borrower" && (
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/apply">Apply for New Loan</Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <SearchIcon />
                </div>
                <Input
                  placeholder="Search by loan ID, purpose, or lender..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <FilterIcon />
                  <span className="ml-2">Filter by status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loans List */}
      <div className="space-y-4">
        {filteredLoans.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No loans found matching your criteria.</p>
                {userRole === "borrower" && (
                  <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                    <Link href="/apply">Apply for Your First Loan</Link>
                  </Button>
                )}
                {userRole === "lender" && (
                  <p className="text-sm text-muted-foreground mt-2">Check back later for new loan requests to fund.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredLoans.map((loan) => (
            <Card key={loan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-lg">{loan.purpose}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </Badge>
                        {!loan.isComplete && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <div className="flex items-center">
                              <AlertTriangleIcon />
                              <span className="ml-1">Incomplete</span>
                            </div>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{formatCurrency(loan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Term</p>
                        <p className="font-medium">{loan.termMonths} months</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Applied</p>
                        <p className="font-medium">{formatDate(loan.createdAt)}</p>
                      </div>
                      {showBorrowerInfo && (
                        <div>
                          <p className="text-muted-foreground">Borrower</p>
                          <p className="font-medium">ID: {loan.borrowerId}</p>
                        </div>
                      )}
                      {loan.lenderName && (
                        <div>
                          <p className="text-muted-foreground">Lender</p>
                          <p className="font-medium">{loan.lenderName}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress bar for active loans */}
                    {(loan.status === "active" || loan.status === "closed") && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Repayment Progress</span>
                          <span className="font-medium">{getProgressPercentage(loan).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(loan)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Paid: {formatCurrency(loan.totalRepaid)}</span>
                          <span>Total: {formatCurrency((loan.monthlyPayment || 0) * loan.termMonths)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/loans/${loan.id}`}>
                        <div className="flex items-center">
                          <EyeIcon />
                          <span className="ml-2">View Details</span>
                        </div>
                      </Link>
                    </Button>

                    {userRole === "borrower" && loan.status === "active" && (
                      <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                        <Link href={`/loans/${loan.id}/repay`}>
                          <div className="flex items-center">
                            <CreditCardIcon />
                            <span className="ml-2">Make Payment</span>
                          </div>
                        </Link>
                      </Button>
                    )}

                    {(loan.status === "approved" || loan.status === "active" || loan.status === "closed") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/loans/${loan.id}/agreement`}>
                          <div className="flex items-center">
                            <DownloadIcon />
                            <span className="ml-2">Agreement</span>
                          </div>
                        </Link>
                      </Button>
                    )}

                    {userRole === "admin" && loan.status === "pending" && onFlagLoan && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFlagLoan(loan.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <div className="flex items-center">
                          <FlagIcon />
                          <span className="ml-2">Flag</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{filteredLoans.length}</p>
                <p className="text-sm text-muted-foreground">Total Loans</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(filteredLoans.reduce((sum, loan) => sum + loan.amount, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredLoans.filter((loan) => loan.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground">Active Loans</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredLoans.filter((loan) => loan.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
