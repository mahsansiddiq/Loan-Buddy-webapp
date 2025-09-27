// Mock authentication system for frontend demo
export interface User {
  id: string
  name: string
  email: string
  role: "borrower" | "lender" | "admin"
  profilePicture?: string
  phone?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Borrower",
    email: "john@example.com",
    role: "borrower",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Lender",
    email: "sarah@example.com",
    role: "lender",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-01T10:00:00Z",
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication - in real app this would call your API
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    return user
  }
  return null
}

export const registerUser = async (userData: {
  name: string
  email: string
  password: string
  role: "borrower" | "lender"
}): Promise<User | null> => {
  // Mock registration - in real app this would call your API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return newUser
}
