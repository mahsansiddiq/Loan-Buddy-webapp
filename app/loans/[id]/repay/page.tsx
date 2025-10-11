"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RepaymentForm } from "@/components/loans/repayment-form"
import { getAllLoans } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RepayPageProps {
  params: {
    id: string
  }
}

export default function RepayPage({ params }: RepayPageProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isLoading && user) {
      // Check if user is a borrower and owns this loan
      const allLoans = getAllLoans()
      const loan = allLoans.find((l) => l.id === params.id)

      if (!loan) {
        router.push("/loans")
        return
      }

      if (user.role !== "borrower" || loan.borrowerId !== user.id) {
        router.push("/loans")
        return
      }

      // Check if loan is in a state that allows payments
      if (loan.status !== "active") {
        router.push(`/loans/${params.id}`)
        return
      }
    }
  }, [user, isLoading, isAuthenticated, params.id, router])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <DashboardLayout>
      <RepaymentForm loanId={params.id} />
    </DashboardLayout>
  )
}
