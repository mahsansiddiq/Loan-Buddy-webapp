"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllLoans, formatCurrency, formatDate } from "@/lib/mock-data"

const CreditCardIcon = () => <span>💳</span>
const UploadIcon = () => <span>📤</span>
const AlertCircleIcon = () => <span>⚠️</span>
const ArrowLeftIcon = () => <span>←</span>

interface RepaymentFormProps {
  loanId: string
}

export function RepaymentForm({ loanId }: RepaymentFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    note: "",
    receiptFile: null as File | null,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const allLoans = getAllLoans()
  const loan = allLoans.find((l) => l.id === loanId)

  if (!loan) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">
          <AlertCircleIcon />
        </div>
        <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
        <p className="text-muted-foreground mb-4">The loan you're trying to make a payment for doesn't exist.</p>
        <Button onClick={() => router.push("/loans")} variant="outline">
          <div className="flex items-center">
            <ArrowLeftIcon />
            <span className="ml-2">Back to Loans</span>
          </div>
        </Button>
      </div>
    )
  }

  // Check if user owns this loan
  if (user?.id !== loan.borrowerId) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">
          <AlertCircleIcon />
        </div>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to make payments on this loan.</p>
        <Button onClick={() => router.push("/loans")} variant="outline">
          <div className="flex items-center">
            <ArrowLeftIcon />
            <span className="ml-2">Back to Loans</span>
          </div>
        </Button>
      </div>
    )
  }

  // Check if loan allows payments
  if (loan.status !== "active") {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">
          <AlertCircleIcon />
        </div>
        <h2 className="text-xl font-semibold mb-2">Payment Not Available</h2>
        <p className="text-muted-foreground mb-4">
          Payments can only be made on active loans. This loan is currently {loan.status}.
        </p>
        <Button onClick={() => router.push(`/loans/${loanId}`)} variant="outline">
          <div className="flex items-center">
            <ArrowLeftIcon />
            <span className="ml-2">View Loan Details</span>
          </div>
        </Button>
      </div>
    )
  }

  const remainingBalance = loan.amount - loan.totalRepaid
  const suggestedAmount = loan.monthlyPayment || 0

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, receiptFile: file })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.amount || !formData.method) {
      setError("Please fill in all required fields")
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (amount <= 0) {
      setError("Payment amount must be greater than $0")
      return
    }

    if (amount > remainingBalance) {
      setError("Payment amount cannot exceed remaining balance")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would submit to your API
      console.log("Payment submitted:", {
        loanId,
        borrowerId: user?.id,
        ...formData,
        amount,
      })

      // Show success and redirect
      router.push(`/loans/${loanId}?success=payment-submitted`)
    } catch (error) {
      setError("Failed to process payment. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeftIcon />
          Back
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-3xl font-serif font-bold text-balance mb-2">Make a Payment</h1>
          <p className="text-muted-foreground">
            Loan #{loan.id} • {loan.purpose}
          </p>
        </div>
      </div>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Remaining Balance</div>
              <div className="text-2xl font-bold">{formatCurrency(remainingBalance)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Suggested Payment</div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(suggestedAmount)}</div>
            </div>
          </div>
          {loan.nextDueDate && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Next Payment Due</div>
              <div className="font-medium">{formatDate(loan.nextDueDate)}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <div className="flex items-center">
              <AlertCircleIcon />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon />
              Payment Details
            </CardTitle>
            <CardDescription>Enter your payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  max={remainingBalance}
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, amount: suggestedAmount.toString() })}
                  >
                    Suggested: {formatCurrency(suggestedAmount)}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, amount: remainingBalance.toString() })}
                  >
                    Pay in Full: {formatCurrency(remainingBalance)}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method *</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="debit-card">Debit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add a note about this payment"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="receipt"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <UploadIcon />
              </div>
              <p className="text-xs text-muted-foreground">Upload a receipt or proof of payment (PDF, JPG, PNG)</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Processing..." : "Submit Payment"}
          </Button>
        </div>
      </form>
    </div>
  )
}
