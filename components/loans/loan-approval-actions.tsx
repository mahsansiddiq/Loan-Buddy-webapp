"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
const CheckCircle = () => <span>✅</span>
const XCircle = () => <span>🛑</span>
const Flag = () => <span>🚩</span>
const AlertTriangle = () => <span>⚠️</span>
const Eye = () => <span>👁️</span>
const FileText = () => <span>📄</span>
import { formatCurrency, type Loan } from "@/lib/mock-data"

interface LoanApprovalActionsProps {
  loan: Loan
  userRole: "lender" | "admin"
  onApprove?: (loanId: string, notes?: string) => void
  onReject?: (loanId: string, reason: string) => void
  onFlag?: (loanId: string, reason: string) => void
}

export function LoanApprovalActions({ loan, userRole, onApprove, onReject, onFlag }: LoanApprovalActionsProps) {
  const [approvalData, setApprovalData] = useState({ notes: "" })
  const [rejectionReason, setRejectionReason] = useState("")
  const [flagReason, setFlagReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showVerificationDetails, setShowVerificationDetails] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    if (onApprove) {
      onApprove(loan.id, approvalData.notes)
    }

    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    if (onReject) {
      onReject(loan.id, rejectionReason)
    }

    setIsProcessing(false)
  }

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for flagging")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    if (onFlag) {
      onFlag(loan.id, flagReason)
    }

    setIsProcessing(false)
  }

  const calculateMonthlyPayment = () => {
    const principal = loan.amount
    const months = loan.termMonths || 1
    return principal / months
  }

  const isIncomplete = !loan.isComplete || !loan.verification?.primaryIdNumber || !loan.verification?.secondaryIdNumber

  if (loan.status !== "pending" && loan.status !== "flagged") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Application Completeness Check */}
      {isIncomplete && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This application is incomplete. Missing verification documents or ID information.
            {userRole === "admin" ? " You can still approve or flag for review." : " Please flag for admin review."}
          </AlertDescription>
        </Alert>
      )}

      {/* Verification Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Verification Status
            </span>
            <Button variant="outline" size="sm" onClick={() => setShowVerificationDetails(!showVerificationDetails)}>
              <Eye className="w-4 h-4 mr-2" />
              {showVerificationDetails ? "Hide" : "View"} Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm text-muted-foreground">CNIC Images</Label>
              <div className="flex gap-2 mt-1">
                <Badge variant={loan.verification?.cnicFrontImage ? "default" : "destructive"}>
                  Front: {loan.verification?.cnicFrontImage ? "✓" : "✗"}
                </Badge>
                <Badge variant={loan.verification?.cnicBackImage ? "default" : "destructive"}>
                  Back: {loan.verification?.cnicBackImage ? "✓" : "✗"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">ID Numbers</Label>
              <div className="flex gap-2 mt-1">
                <Badge variant={loan.verification?.primaryIdNumber ? "default" : "destructive"}>
                  Primary: {loan.verification?.primaryIdNumber ? "✓" : "✗"}
                </Badge>
                <Badge variant={loan.verification?.secondaryIdNumber ? "default" : "destructive"}>
                  Secondary: {loan.verification?.secondaryIdNumber ? "✓" : "✗"}
                </Badge>
              </div>
            </div>
          </div>

          {showVerificationDetails && loan.verification && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Primary ID</Label>
                  <p className="text-sm">{loan.verification.primaryIdNumber || "Not provided"}</p>
                  <p className="text-xs text-muted-foreground">
                    {loan.verification.primaryIdHolderName || "Name not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Secondary ID</Label>
                  <p className="text-sm">{loan.verification.secondaryIdNumber || "Not provided"}</p>
                  <p className="text-xs text-muted-foreground">
                    {loan.verification.secondaryIdHolderName || "Name not provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Approve */}
        {(userRole === "lender" || userRole === "admin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Loan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Loan Application</DialogTitle>
                <DialogDescription>Set the terms for this {formatCurrency(loan.amount)} loan.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Loan Terms Preview</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <p>Monthly Payment: {formatCurrency(calculateMonthlyPayment())}</p>
                    <p>Total Repayment: {formatCurrency(calculateMonthlyPayment() * loan.termMonths)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={approvalData.notes}
                    onChange={(e) => setApprovalData({ ...approvalData, notes: e.target.value })}
                    placeholder="Any additional notes for the borrower..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? "Processing..." : "Approve Loan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Reject */}
        {(userRole === "lender" || userRole === "admin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isProcessing}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Loan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Loan Application</DialogTitle>
                <DialogDescription>Please provide a reason for rejecting this loan application.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                  <Select value={rejectionReason} onValueChange={setRejectionReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insufficient-income">Insufficient Income</SelectItem>
                      <SelectItem value="poor-credit">Poor Credit History</SelectItem>
                      <SelectItem value="incomplete-documents">Incomplete Documentation</SelectItem>
                      <SelectItem value="high-risk">High Risk Assessment</SelectItem>
                      <SelectItem value="policy-violation">Policy Violation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleReject} disabled={isProcessing} variant="destructive" className="flex-1">
                    {isProcessing ? "Processing..." : "Reject Loan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Flag for Review */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
              disabled={isProcessing}
            >
              <Flag className="w-4 h-4 mr-2" />
              Flag for Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Flag for Admin Review</DialogTitle>
              <DialogDescription>
                Flag this application for admin review if you need additional verification or have concerns.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flagReason">Reason for Flagging *</Label>
                <Select value={flagReason} onValueChange={setFlagReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incomplete-verification">Incomplete Verification</SelectItem>
                    <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                    <SelectItem value="document-concerns">Document Concerns</SelectItem>
                    <SelectItem value="need-manual-review">Need Manual Review</SelectItem>
                    <SelectItem value="policy-clarification">Policy Clarification Needed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleFlag}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  {isProcessing ? "Processing..." : "Flag for Review"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
