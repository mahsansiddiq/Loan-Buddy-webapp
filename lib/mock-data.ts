// Mock data for the loan management system
export interface Loan {
  id: string
  borrowerId: string
  lenderId?: string
  amount: number
  purpose: string
  termMonths: number
  interestRate?: number
  status: "pending" | "approved" | "active" | "rejected" | "closed" | "flagged"
  createdAt: string
  approvedAt?: string
  nextDueDate?: string
  totalRepaid: number
  monthlyPayment?: number
  lenderName?: string
  verification?: {
    cnicFrontImage?: string
    cnicBackImage?: string
    primaryIdNumber: string
    primaryIdHolderName: string
    secondaryIdNumber: string
    secondaryIdHolderName: string
    isVerified: boolean
    verificationNotes?: string
  }
  description?: string
  monthlyIncome?: number
  employmentStatus?: string
  isComplete: boolean // Added to track if application has all required information
}

export interface Repayment {
  id: string
  loanId: string
  amount: number
  paidAt: string
  method: string
  note?: string
  receiptUrl?: string
}

export interface Notification {
  id: string
  userId: string
  type: "loan_approved" | "loan_rejected" | "repayment_due" | "repayment_received" | "general"
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

// Mock loans data
export const mockLoans: Loan[] = [
  {
    id: "1",
    borrowerId: "1",
    lenderId: "2",
    amount: 5000,
    purpose: "Home renovation",
    termMonths: 12,
    interestRate: 8.5,
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    approvedAt: "2024-01-16T14:30:00Z",
    nextDueDate: "2024-02-15T00:00:00Z",
    totalRepaid: 1250,
    monthlyPayment: 437.5,
    lenderName: "Sarah Lender",
    verification: {
      cnicFrontImage: "path/to/cnicFrontImage.jpg",
      cnicBackImage: "path/to/cnicBackImage.jpg",
      primaryIdNumber: "123456789",
      primaryIdHolderName: "John Borrower",
      secondaryIdNumber: "987654321",
      secondaryIdHolderName: "Jane Borrower",
      isVerified: true,
      verificationNotes: "All documents verified",
    },
    description: "Loan for home renovation",
    monthlyIncome: 5000,
    employmentStatus: "Employed",
    isComplete: true,
  },
  {
    id: "2",
    borrowerId: "1",
    amount: 2500,
    purpose: "Medical expenses",
    termMonths: 6,
    status: "pending",
    createdAt: "2024-01-20T09:15:00Z",
    totalRepaid: 0,
    isComplete: false,
  },
  {
    id: "3",
    borrowerId: "1",
    lenderId: "2",
    amount: 1000,
    purpose: "Emergency fund",
    termMonths: 3,
    interestRate: 6.0,
    status: "closed",
    createdAt: "2023-10-01T10:00:00Z",
    approvedAt: "2023-10-02T11:00:00Z",
    totalRepaid: 1000,
    monthlyPayment: 342.22,
    lenderName: "Sarah Lender",
    verification: {
      cnicFrontImage: "path/to/cnicFrontImage.jpg",
      cnicBackImage: "path/to/cnicBackImage.jpg",
      primaryIdNumber: "123456789",
      primaryIdHolderName: "John Borrower",
      secondaryIdNumber: "987654321",
      secondaryIdHolderName: "Jane Borrower",
      isVerified: true,
      verificationNotes: "All documents verified",
    },
    description: "Loan for emergency fund",
    monthlyIncome: 5000,
    employmentStatus: "Employed",
    isComplete: true,
  },
]

// Mock repayments data
export const mockRepayments: Repayment[] = [
  {
    id: "1",
    loanId: "1",
    amount: 437.5,
    paidAt: "2024-01-15T10:00:00Z",
    method: "Bank Transfer",
    note: "First payment",
  },
  {
    id: "2",
    loanId: "1",
    amount: 437.5,
    paidAt: "2024-02-15T10:00:00Z",
    method: "Bank Transfer",
  },
  {
    id: "3",
    loanId: "1",
    amount: 375.0,
    paidAt: "2024-03-10T10:00:00Z",
    method: "Bank Transfer",
    note: "Partial payment",
  },
]

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "repayment_due",
    title: "Payment Due Soon",
    message: "Your payment of $437.50 for Home renovation loan is due in 3 days.",
    isRead: false,
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    type: "loan_approved",
    title: "Loan Approved!",
    message: "Your loan application for $5,000 has been approved by Sarah Lender.",
    isRead: true,
    createdAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    userId: "1",
    type: "general",
    title: "Welcome to LoanBuddy",
    message: "Thank you for joining our platform. Start by applying for your first loan.",
    isRead: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
]

// Mock lender loans data
export const mockLenderLoans: Loan[] = [
  {
    id: "4",
    borrowerId: "4",
    lenderId: "2",
    amount: 3000,
    purpose: "Small business expansion",
    termMonths: 18,
    interestRate: 9.2,
    status: "active",
    createdAt: "2024-01-10T08:00:00Z",
    approvedAt: "2024-01-11T10:00:00Z",
    nextDueDate: "2024-02-10T00:00:00Z",
    totalRepaid: 500,
    monthlyPayment: 185.5,
    lenderName: "Sarah Lender",
    verification: {
      cnicFrontImage: "path/to/cnicFrontImage.jpg",
      cnicBackImage: "path/to/cnicBackImage.jpg",
      primaryIdNumber: "123456789",
      primaryIdHolderName: "Alice Johnson",
      secondaryIdNumber: "987654321",
      secondaryIdHolderName: "Bob Johnson",
      isVerified: true,
      verificationNotes: "All documents verified",
    },
    description: "Loan for small business expansion",
    monthlyIncome: 6000,
    employmentStatus: "Self-employed",
    isComplete: true,
  },
  {
    id: "5",
    borrowerId: "5",
    amount: 7500,
    purpose: "Debt consolidation",
    termMonths: 24,
    status: "pending",
    createdAt: "2024-01-22T14:30:00Z",
    totalRepaid: 0,
    isComplete: false,
  },
  {
    id: "6",
    borrowerId: "6",
    amount: 1500,
    purpose: "Car repair",
    termMonths: 8,
    status: "pending",
    createdAt: "2024-01-23T11:15:00Z",
    totalRepaid: 0,
    isComplete: false,
  },
  {
    id: "7",
    borrowerId: "7",
    amount: 4000,
    purpose: "Education expenses",
    termMonths: 12,
    interestRate: 7.8,
    status: "active",
    createdAt: "2023-12-15T09:00:00Z",
    approvedAt: "2023-12-16T11:30:00Z",
    nextDueDate: "2024-02-15T00:00:00Z",
    totalRepaid: 1200,
    monthlyPayment: 350.25,
    lenderName: "Sarah Lender",
    verification: {
      cnicFrontImage: "path/to/cnicFrontImage.jpg",
      cnicBackImage: "path/to/cnicBackImage.jpg",
      primaryIdNumber: "123456789",
      primaryIdHolderName: "David Wilson",
      secondaryIdNumber: "987654321",
      secondaryIdHolderName: "Eve Wilson",
      isVerified: true,
      verificationNotes: "All documents verified",
    },
    description: "Loan for education expenses",
    monthlyIncome: 7000,
    employmentStatus: "Employed",
    isComplete: true,
  },
]

// Add borrower names for display
export const mockBorrowers = [
  { id: "1", name: "John Borrower", creditScore: 720 },
  { id: "4", name: "Alice Johnson", creditScore: 680 },
  { id: "5", name: "Mike Chen", creditScore: 650 },
  { id: "6", name: "Emma Davis", creditScore: 710 },
  { id: "7", name: "David Wilson", creditScore: 740 },
]

export const mockUsers = [
  {
    id: "1",
    name: "John Borrower",
    email: "john@example.com",
    role: "borrower" as const,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Lender",
    email: "sarah@example.com",
    role: "lender" as const,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as const,
    createdAt: "2024-01-01T10:00:00Z",
  },
]

// Helper functions
export const getLoansByBorrower = (borrowerId: string): Loan[] => {
  return mockLoans.filter((loan) => loan.borrowerId === borrowerId)
}

export const getLoansByLender = (lenderId: string): Loan[] => {
  return mockLoans.filter((loan) => loan.lenderId === lenderId)
}

export const getRepaymentsByLoan = (loanId: string): Repayment[] => {
  return mockRepayments.filter((repayment) => repayment.loanId === loanId)
}

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter((notification) => notification.userId === userId)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString))
}

export const getStatusColor = (status: Loan["status"]): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "approved":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "flagged":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getAllLoans = (): Loan[] => {
  return [...mockLoans, ...mockLenderLoans]
}

export const getPendingLoansForLender = (): Loan[] => {
  return [...mockLoans, ...mockLenderLoans].filter((loan) => loan.status === "pending")
}

export const getBorrowerName = (borrowerId: string): string => {
  const borrower = mockBorrowers.find((b) => b.id === borrowerId)
  return borrower?.name || "Unknown Borrower"
}

export const getBorrowerCreditScore = (borrowerId: string): number => {
  const borrower = mockBorrowers.find((b) => b.id === borrowerId)
  return borrower?.creditScore || 0
}
