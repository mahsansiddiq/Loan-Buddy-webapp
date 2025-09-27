"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { type User, type AuthState, authenticateUser, registerUser } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    password: string
    role: "borrower" | "lender"
  }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("loanbuddy_user")
    if (storedUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) })
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const user = await authenticateUser(email, password)
      if (user) {
        localStorage.setItem("loanbuddy_user", JSON.stringify(user))
        dispatch({ type: "SET_USER", payload: user })
        return true
      }
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    role: "borrower" | "lender"
  }): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const user = await registerUser(userData)
      if (user) {
        localStorage.setItem("loanbuddy_user", JSON.stringify(user))
        dispatch({ type: "SET_USER", payload: user })
        return true
      }
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("loanbuddy_user")
    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
