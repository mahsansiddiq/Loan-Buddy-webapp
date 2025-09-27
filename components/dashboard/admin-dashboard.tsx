"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { getAllLoans, mockUsers, mockBorrowers, formatCurrency, formatDate, getStatusColor } from "@/lib/mock-data"
import {
  Users,
  CreditCard,
  AlertTriangle,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function AdminDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<"overview" | "users" | "loans">("overview")
  const [searchTerm, setSearchTerm] = useState("")

  if (!user) return null

  const allLoans = getAllLoans()
  const allUsers = [
    ...mockUsers,
    ...mockBorrowers.map((b) => ({
      id: b.id,
      name: b.name,
      email: `${b.name.toLowerCase().replace(" ", ".")}@example.com`,
      role: "borrower" as const,
      createdAt: "2024-01-01T00:00:00Z",
    })),
  ]

  const totalUsers = allUsers.length
  const totalLoans = allLoans.length
  const activeLoans = allLoans.filter((loan) => loan.status === "active")
  const pendingLoans = allLoans.filter((loan) => loan.status === "pending")
  const totalVolume = allLoans.reduce((sum, loan) => sum + loan.amount, 0)
  const disputedLoans = 2 // Mock data

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredLoans = allLoans.filter(
    (loan) => loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) || loan.id.includes(searchTerm),
  )

  const handleUserAction = (userId: string, action: "activate" | "deactivate" | "view") => {
    console.log(`${action} user ${userId}`)
  }

  const handleLoanAction = (loanId: string, action: "view" | "flag") => {
    console.log(`${action} loan ${loanId}`)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-balance">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform activity and manage users</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedTab === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={selectedTab === "users" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("users")}
          >
            Users
          </Button>
          <Button
            variant={selectedTab === "loans" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTab("loans")}
          >
            Loans
          </Button>
        </div>
      </div>

      {selectedTab === "overview" && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLoans}</div>
                <p className="text-xs text-muted-foreground">
                  {activeLoans.length} active, {pendingLoans.length} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
                <p className="text-xs text-muted-foreground">Platform lifetime</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{disputedLoans}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Loans</CardTitle>
                <CardDescription>Latest loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allLoans.slice(0, 5).map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{loan.purpose}</span>
                          <Badge className={getStatusColor(loan.status)} variant="outline">
                            {loan.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(loan.amount)} • {formatDate(loan.createdAt)}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/loans/${loan.id}`}>
                          <Eye className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Stats</CardTitle>
                <CardDescription>Key performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Approval Rate</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Default Rate</span>
                  <span className="font-medium">3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Loan Size</span>
                  <span className="font-medium">{formatCurrency(totalVolume / totalLoans)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Lenders</span>
                  <span className="font-medium">{allUsers.filter((u) => u.role === "lender").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Borrowers</span>
                  <span className="font-medium">{allUsers.filter((u) => u.role === "borrower").length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {selectedTab === "users" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their access</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "activate")}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "deactivate")}
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedTab === "loans" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Loan Management</CardTitle>
                <CardDescription>Monitor all loans across the platform</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search loans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-mono text-sm">#{loan.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.purpose}</div>
                        <div className="text-sm text-muted-foreground">{loan.termMonths} months</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(loan.amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(loan.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleLoanAction(loan.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleLoanAction(loan.id, "flag")}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Flag for Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
