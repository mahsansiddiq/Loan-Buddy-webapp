import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoanApplicationForm } from "@/components/loans/loan-application-form"

export default function ApplyPage() {
  return (
    <DashboardLayout>
      <LoanApplicationForm />
    </DashboardLayout>
  )
}
