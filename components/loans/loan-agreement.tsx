"use client"

import { formatCurrency, formatDate, type Loan } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Shield, Calendar, DollarSign } from "lucide-react"

interface LoanAgreementProps {
  loan: Loan
  borrowerName: string
  lenderName: string
  onDownload?: () => void
}

export function LoanAgreement({ loan, borrowerName, lenderName, onDownload }: LoanAgreementProps) {
  const generateAgreementContent = () => {
    const totalAmount = (loan.monthlyPayment || 0) * loan.termMonths
    const interestAmount = totalAmount - loan.amount
    const currentDate = new Date().toLocaleDateString()

    return `
LOAN AGREEMENT

Agreement Date: ${currentDate}
Loan ID: ${loan.id}

PARTIES:
Lender: ${lenderName}
Borrower: ${borrowerName}

LOAN TERMS:
Principal Amount: ${formatCurrency(loan.amount)}
Interest Rate: ${loan.interestRate || 8}% per annum
Loan Term: ${loan.termMonths} months
Monthly Payment: ${formatCurrency(loan.monthlyPayment || 0)}
Total Amount to be Repaid: ${formatCurrency(totalAmount)}
Total Interest: ${formatCurrency(interestAmount)}

VERIFICATION DETAILS:
Primary ID Number: ${loan.verification?.primaryIdNumber || "N/A"}
Primary ID Holder: ${loan.verification?.primaryIdHolderName || "N/A"}
Secondary ID Number: ${loan.verification?.secondaryIdNumber || "N/A"}
Secondary ID Holder: ${loan.verification?.secondaryIdHolderName || "N/A"}

REPAYMENT SCHEDULE:
First Payment Due: ${loan.nextDueDate ? formatDate(loan.nextDueDate) : "TBD"}
Payment Frequency: Monthly
Payment Method: As agreed between parties

TERMS AND CONDITIONS:
1. The borrower agrees to repay the loan amount plus interest in ${loan.termMonths} equal monthly installments.
2. Each payment is due on the same day of each month as the first payment date.
3. Late payments may incur additional fees as per platform policy.
4. The borrower may prepay the loan without penalty.
5. This agreement is governed by the laws of the jurisdiction where the platform operates.
6. Both parties agree to resolve disputes through the platform's dispute resolution process.

SIGNATURES:
Lender: ${lenderName}
Date: ${currentDate}

Borrower: ${borrowerName}
Date: ${currentDate}

This agreement is electronically generated and legally binding upon acceptance by both parties through the LoanBuddy platform.
    `
  }

  const handleDownload = () => {
    const content = generateAgreementContent()
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `loan-agreement-${loan.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    if (onDownload) {
      onDownload()
    }
  }

  const totalAmount = (loan.monthlyPayment || 0) * loan.termMonths
  const interestAmount = totalAmount - loan.amount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold">Loan Agreement</h2>
          <p className="text-muted-foreground">Loan ID: {loan.id}</p>
        </div>
        <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Download Agreement
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Parties Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">LENDER</h4>
                <p className="font-semibold">{lenderName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">BORROWER</h4>
                <p className="font-semibold">{borrowerName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Loan Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">PRINCIPAL AMOUNT</h4>
                <p className="text-lg font-bold text-primary">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">INTEREST RATE</h4>
                <p className="text-lg font-semibold">{loan.interestRate || 8}% per annum</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">LOAN TERM</h4>
                <p className="text-lg font-semibold">{loan.termMonths} months</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">MONTHLY PAYMENT</h4>
                <p className="text-lg font-bold text-green-600">{formatCurrency(loan.monthlyPayment || 0)}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">TOTAL REPAYMENT</h4>
                <p className="text-lg font-semibold">{formatCurrency(totalAmount)}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">TOTAL INTEREST</h4>
                <p className="text-lg font-semibold">{formatCurrency(interestAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">PRIMARY ID</h4>
                <p className="font-semibold">{loan.verification?.primaryIdNumber || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{loan.verification?.primaryIdHolderName || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">SECONDARY ID</h4>
                <p className="font-semibold">{loan.verification?.secondaryIdNumber || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{loan.verification?.secondaryIdHolderName || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repayment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Repayment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">FIRST PAYMENT DUE</h4>
                <p className="font-semibold">{loan.nextDueDate ? formatDate(loan.nextDueDate) : "TBD"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">PAYMENT FREQUENCY</h4>
                <p className="font-semibold">Monthly</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">PAYMENT METHOD</h4>
                <p className="font-semibold">As agreed between parties</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                1. The borrower agrees to repay the loan amount plus interest in {loan.termMonths} equal monthly
                installments.
              </p>
              <p>2. Each payment is due on the same day of each month as the first payment date.</p>
              <p>3. Late payments may incur additional fees as per platform policy.</p>
              <p>4. The borrower may prepay the loan without penalty.</p>
              <p>5. This agreement is governed by the laws of the jurisdiction where the platform operates.</p>
              <p>6. Both parties agree to resolve disputes through the platform's dispute resolution process.</p>
            </div>
          </CardContent>
        </Card>

        {/* Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Electronic Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Lender</h4>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <p className="font-semibold">{lenderName}</p>
                  <p className="text-sm text-muted-foreground">
                    Electronically signed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Borrower</h4>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <p className="font-semibold">{borrowerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Electronically signed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              This agreement is electronically generated and legally binding upon acceptance by both parties through the
              LoanBuddy platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
