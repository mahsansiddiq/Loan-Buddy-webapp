import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LoanDetails } from "@/components/loans/loan-details"

interface LoanPageProps {
  params: {
    id: string
  }
}

export default function LoanPage({ params }: LoanPageProps) {
  return (
    <DashboardLayout>
      <LoanDetails loanId={params.id} />
    </DashboardLayout>
  )
}
