"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
  subscriptionStatus?: "subscribed" | "not_subscribed"
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName?: string) => Promise<void>
  loginWithToken: (token: string, userData: User, refreshToken?: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
  refreshSubscriptionStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken")
    const storedRefresh = localStorage.getItem("refreshToken")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setAccessToken(storedToken)
      setRefreshTokenValue(storedRefresh)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        // Invalid stored user, clear everything
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Login failed")
    }

    const data = await response.json()

    setUser(data.user)
    setAccessToken(data.accessToken)
    setRefreshTokenValue(data.refreshToken)

    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  const register = async (email: string, password: string, displayName?: string) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Registration failed")
    }

    const data = await response.json()

    setUser(data.user)
    setAccessToken(data.accessToken)
    setRefreshTokenValue(data.refreshToken)

    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(data.user))

    fetch("/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: displayName }),
    }).catch(err => {
      console.error("Failed to send welcome email:", err)
    })
  }

  const loginWithToken = async (token: string, userData: User, refreshTokenParam?: string) => {
    setUser(userData)
    setAccessToken(token)
    if (refreshTokenParam) {
      setRefreshTokenValue(refreshTokenParam)
    }
    
    localStorage.setItem("accessToken", token)
    localStorage.setItem("user", JSON.stringify(userData))
    if (refreshTokenParam) {
      localStorage.setItem("refreshToken", refreshTokenParam)
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshTokenValue(null)

    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }

  const refreshToken = async (): Promise<boolean> => {
    if (!refreshTokenValue) return false

    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      })

      if (!response.ok) {
        logout()
        return false
      }

      const data = await response.json()

      setAccessToken(data.accessToken)
      setRefreshTokenValue(data.refreshToken)

      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)

      return true
    } catch {
      logout()
      return false
    }
  }

  const refreshSubscriptionStatus = async (): Promise<void> => {
    if (!accessToken) return

    try {
      const response = await fetch("/api/subscription", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.subscriptionStatus && user) {
          const updatedUser = { ...user, subscriptionStatus: data.subscriptionStatus }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      }
    } catch (error) {
      console.error("Failed to refresh subscription status:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        register,
        loginWithToken,
        logout,
        refreshToken,
        refreshSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
