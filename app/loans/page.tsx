"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoanList } from "@/components/loans/loan-list"
import { getAllLoans, getLoansByBorrower } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function LoansPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loans, setLoans] = useState<any[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Get loans based on user role
    let userLoans: any[] = []

    if (user.role === "borrower") {
      userLoans = getLoansByBorrower(user.id)
    } else if (user.role === "lender") {
      const allLoans = getAllLoans()
      const pendingLoans = allLoans.filter((loan) => loan.status === "pending" && !loan.lenderId)
      const myFundedLoans = allLoans.filter((loan) => loan.lenderId === user.id)
      userLoans = [...pendingLoans, ...myFundedLoans]
    } else if (user.role === "admin") {
      userLoans = getAllLoans()
    }

    setLoans(userLoans)
  }, [user, router])

  const handleFlagLoan = (loanId: string) => {
    // In a real app, this would make an API call to flag the loan
    console.log(`Flagging loan ${loanId} for admin review`)
    // Update loan status to flagged (you'd need to add this status to the Loan interface)
    alert(`Loan ${loanId} has been flagged for admin review`)
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <LoanList
          loans={loans}
          userRole={user.role}
          showBorrowerInfo={user.role === "admin" || user.role === "lender"}
          onFlagLoan={user.role === "admin" ? handleFlagLoan : undefined}
        />
      </div>
    </DashboardLayout>
  )
}
