"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { formatCurrency } from "@/lib/mock-data"

const Calculator = () => <span>🧮</span>
const FileText = () => <span>📄</span>
const Shield = () => <span>🛡️</span>
const Upload = () => <span>📤</span>
const Camera = () => <span>📷</span>
const AlertTriangle = () => <span>⚠️</span>

export function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    termMonths: "",
    description: "",
    monthlyIncome: "",
    employmentStatus: "",
    agreeToTerms: false,
    primaryIdNumber: "",
    primaryIdHolderName: "",
    secondaryIdNumber: "",
    secondaryIdHolderName: "",
  })

  const [files, setFiles] = useState({
    cnicFront: null as File | null,
    cnicBack: null as File | null,
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleFileUpload = (field: "cnicFront" | "cnicBack", file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File size must be less than 5MB")
      return
    }

    if (file && !file.type.startsWith("image/")) {
      setError("Please upload only image files")
      return
    }

    setFiles((prev) => ({ ...prev, [field]: file }))
    setError("") // Clear any previous errors
  }

  const calculateMonthlyPayment = () => {
    const principal = Number.parseFloat(formData.amount) || 0
    const months = Number.parseInt(formData.termMonths) || 1
    if (principal > 0 && months > 0) return principal / months
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.amount || !formData.purpose || !formData.termMonths || !formData.agreeToTerms) {
      setError("Please fill in all required fields and agree to terms")
      return
    }

    if (!files.cnicFront || !files.cnicBack) {
      setError("Please upload both front and back images of your CNIC")
      return
    }

    if (
      !formData.primaryIdNumber ||
      !formData.primaryIdHolderName ||
      !formData.secondaryIdNumber ||
      !formData.secondaryIdHolderName
    ) {
      setError("Please provide both national ID card numbers and cardholder names")
      return
    }

    if (formData.primaryIdNumber.length < 10 || formData.secondaryIdNumber.length < 10) {
      setError("National ID numbers must be at least 10 characters long")
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (amount < 100 || amount > 50000) {
      setError("Loan amount must be between $100 and $50,000")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const submissionData = {
      ...formData,
      verification: {
        cnicFrontImage: files.cnicFront?.name,
        cnicBackImage: files.cnicBack?.name,
        primaryIdNumber: formData.primaryIdNumber,
        primaryIdHolderName: formData.primaryIdHolderName,
        secondaryIdNumber: formData.secondaryIdNumber,
        secondaryIdHolderName: formData.secondaryIdHolderName,
        isVerified: false,
      },
      isComplete: true,
    }

    console.log("Enhanced loan application submitted:", submissionData)

    setIsSubmitting(false)
    router.push("/dashboard?success=loan-applied")
  }

  const monthlyPayment = calculateMonthlyPayment()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-balance mb-2">Apply for a Loan</h1>
        <p className="text-muted-foreground">Get the funding you need with competitive rates and flexible terms</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator />
              Loan Details
            </CardTitle>
            <CardDescription>Tell us about the loan you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... existing loan details fields ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="100"
                  max="50000"
                  step="100"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-muted-foreground">Between $100 and $50,000</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="termMonths">Loan Term *</Label>
                <Select
                  value={formData.termMonths}
                  onValueChange={(value) => setFormData({ ...formData, termMonths: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home renovation">Home renovation</SelectItem>
                  <SelectItem value="Medical expenses">Medical expenses</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Debt consolidation">Debt consolidation</SelectItem>
                  <SelectItem value="Small business">Small business</SelectItem>
                  <SelectItem value="Emergency fund">Emergency fund</SelectItem>
                  <SelectItem value="Car repair">Car repair</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide additional details about your loan request"
                rows={3}
              />
            </div>

            {formData.amount && formData.termMonths && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Estimated Monthly Payment (no interest)</h4>
                <div className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText />
              Financial Information
            </CardTitle>
            <CardDescription>Help us assess your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="Enter monthly income"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera />
              Identity Verification
            </CardTitle>
            <CardDescription>Upload your CNIC and provide national ID information for verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CNIC Upload Section */}
            <div className="space-y-4">
              <h4 className="font-medium">CNIC Images *</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnicFront">CNIC Front Image *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <input
                      id="cnicFront"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("cnicFront", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="cnicFront" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {files.cnicFront ? files.cnicFront.name : "Click to upload front image"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG only</p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnicBack">CNIC Back Image *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <input
                      id="cnicBack"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("cnicBack", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="cnicBack" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {files.cnicBack ? files.cnicBack.name : "Click to upload back image"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG only</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* National ID Information */}
            <div className="space-y-4">
              <h4 className="font-medium">National ID Information *</h4>
              <p className="text-sm text-muted-foreground">
                Provide two national ID card numbers and cardholder names for verification and agreement purposes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryIdNumber">Primary ID Number *</Label>
                  <Input
                    id="primaryIdNumber"
                    type="text"
                    value={formData.primaryIdNumber}
                    onChange={(e) => setFormData({ ...formData, primaryIdNumber: e.target.value })}
                    placeholder="Enter primary national ID number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryIdHolderName">Primary ID Holder Name *</Label>
                  <Input
                    id="primaryIdHolderName"
                    type="text"
                    value={formData.primaryIdHolderName}
                    onChange={(e) => setFormData({ ...formData, primaryIdHolderName: e.target.value })}
                    placeholder="Enter cardholder name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryIdNumber">Secondary ID Number *</Label>
                  <Input
                    id="secondaryIdNumber"
                    type="text"
                    value={formData.secondaryIdNumber}
                    onChange={(e) => setFormData({ ...formData, secondaryIdNumber: e.target.value })}
                    placeholder="Enter secondary national ID number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryIdHolderName">Secondary ID Holder Name *</Label>
                  <Input
                    id="secondaryIdHolderName"
                    type="text"
                    value={formData.secondaryIdHolderName}
                    onChange={(e) => setFormData({ ...formData, secondaryIdHolderName: e.target.value })}
                    placeholder="Enter cardholder name"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Verification & Agreement</p>
                    <p className="text-blue-700">
                      This information will be used for identity verification and will be included in the loan agreement
                      when a lender approves your application. All data is encrypted and securely stored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield />
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg text-sm text-muted-foreground">
                <p className="mb-2">By applying for this loan, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accurate and truthful information</li>
                  <li>Allow lenders to review your application and verification documents</li>
                  <li>Accept the terms of any loan agreement if approved</li>
                  <li>Make timely payments according to the agreed schedule</li>
                  <li>Our privacy policy and data handling practices</li>
                  <li>The use of your national ID information for verification and agreement purposes</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the terms and conditions and consent to identity verification *
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.agreeToTerms}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  )
}
