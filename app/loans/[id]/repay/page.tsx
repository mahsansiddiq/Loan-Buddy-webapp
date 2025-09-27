import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RepaymentForm } from "@/components/loans/repayment-form"

interface RepayPageProps {
  params: {
    id: string
  }
}

export default function RepayPage({ params }: RepayPageProps) {
  return (
    <DashboardLayout>
      <RepaymentForm loanId={params.id} />
    </DashboardLayout>
  )
}
