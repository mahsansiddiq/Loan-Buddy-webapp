"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BorrowerDashboard } from "@/components/dashboard/borrower-dashboard"
import { LenderDashboard } from "@/components/dashboard/lender-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      {user.role === "borrower" && <BorrowerDashboard />}
      {user.role === "lender" && <LenderDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </DashboardLayout>
  )
}
