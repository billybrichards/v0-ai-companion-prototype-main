"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { analytics } from "./analytics"

interface User {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
  subscriptionStatus?: "subscribed" | "not_subscribed"
  subscriptionVerifiedAt?: number
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
  updateSubscriptionStatus: (status: "subscribed" | "not_subscribed") => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

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
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // Refresh status immediately on mount if user exists
        setTimeout(() => refreshSubscriptionStatus(storedToken, parsedUser), 100)
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

    analytics.identify(data.user.id, {
      email: data.user.email,
      displayName: data.user.displayName,
      subscriptionStatus: data.user.subscriptionStatus,
    })
    analytics.userLoggedIn(email, "email")
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

    analytics.identify(data.user.id, {
      email: data.user.email,
      displayName: data.user.displayName,
      subscriptionStatus: data.user.subscriptionStatus,
    })
    analytics.userSignedUp(email, "email")

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
    
    analytics.identify(userData.id, {
      email: userData.email,
      displayName: userData.displayName,
      subscriptionStatus: userData.subscriptionStatus,
    })
    analytics.magicLinkVerified(userData.email)

    // Refresh subscription status immediately after login with token
    setTimeout(() => refreshSubscriptionStatus(token, userData), 100)
  }

  const logout = () => {
    analytics.userLoggedOut()

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

  const refreshSubscriptionStatus = async (tokenOverride?: string, userOverride?: User | null): Promise<void> => {
    const activeToken = tokenOverride || accessToken
    const activeUser = userOverride === undefined ? user : userOverride
    if (!activeToken) return

    try {
      console.log("[Auth] Refreshing subscription status...")
      const response = await fetch("/api/subscription", {
        headers: { Authorization: `Bearer ${activeToken}` },
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[Auth] Subscription data received:", data)
        if (data.subscriptionStatus && activeUser) {
          const CHECKOUT_GRACE_PERIOD = 5 * 60 * 1000
          const isRecentCheckout = activeUser.subscriptionVerifiedAt && 
            (Date.now() - activeUser.subscriptionVerifiedAt) < CHECKOUT_GRACE_PERIOD
          
          if (activeUser.subscriptionStatus === "subscribed" && data.subscriptionStatus === "not_subscribed" && isRecentCheckout) {
            console.log("[Auth] Ignoring backend downgrade during grace period - checkout verified recently")
            return
          }
          const updatedUser = { ...activeUser, subscriptionStatus: data.subscriptionStatus }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
          console.log("[Auth] Updated user status to:", data.subscriptionStatus)
        }
      } else {
        console.error("[Auth] Subscription refresh failed:", response.status)
      }
    } catch (error) {
      console.error("Failed to refresh subscription status:", error)
    }
  }

  const updateSubscriptionStatus = (status: "subscribed" | "not_subscribed") => {
    if (!user) return
    console.log("[Auth] Directly updating subscription status to:", status)
    const updatedUser = { 
      ...user, 
      subscriptionStatus: status,
      subscriptionVerifiedAt: status === "subscribed" ? Date.now() : undefined
    }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
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
        updateSubscriptionStatus,
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
