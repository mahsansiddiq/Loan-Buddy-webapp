"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoanAgreement } from "@/components/loans/loan-agreement"
import { getAllLoans, getBorrowerName } from "@/lib/mock-data"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoanAgreementPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loan, setLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loanId = params.id as string
    const allLoans = getAllLoans()
    const foundLoan = allLoans.find((l) => l.id === loanId)

    if (!foundLoan) {
      setLoading(false)
      return
    }

    // Check if user has permission to view this agreement
    const hasPermission =
      user.role === "admin" ||
      (user.role === "lender" && foundLoan.lenderId === user.id) ||
      (user.role === "borrower" && foundLoan.borrowerId === user.id)

    if (!hasPermission) {
      router.push("/dashboard")
      return
    }

    // Only show agreement for approved or active loans
    if (foundLoan.status !== "approved" && foundLoan.status !== "active" && foundLoan.status !== "closed") {
      setLoading(false)
      return
    }

    setLoan(foundLoan)
    setLoading(false)
  }, [user, params.id, router])

  const handleDownload = () => {
    console.log(`Agreement downloaded for loan ${loan.id}`)
    // In a real app, you might track download events
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading agreement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Agreement Not Available</h2>
              <p className="text-muted-foreground mb-4">
                This loan agreement is not available. The loan may not exist, may not be approved yet, or you may not
                have permission to view it.
              </p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loan.status === "pending" || loan.status === "rejected") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Agreement is only available for approved loans. Current status: {loan.status}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const borrowerName = getBorrowerName(loan.borrowerId)
  const lenderName = loan.lenderName || "Unknown Lender"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => router.back()} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Loan Details
        </Button>
      </div>

      <LoanAgreement loan={loan} borrowerName={borrowerName} lenderName={lenderName} onDownload={handleDownload} />
    </div>
  )
}
