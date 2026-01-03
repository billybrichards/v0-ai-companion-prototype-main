"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail, User, Eye, EyeOff, Wand2, Check } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

interface AuthFormProps {
  onSuccess?: () => void
  defaultMode?: "login" | "signup"
  prefillEmail?: string
  showMagicLink?: boolean
  embedded?: boolean // When true, renders without fixed overlay (for use inside Dialog)
}

export default function AuthForm({ onSuccess, defaultMode, prefillEmail, showMagicLink = true, embedded = false }: AuthFormProps) {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(defaultMode !== "signup")
  const [email, setEmail] = useState(prefillEmail || "")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, displayName || undefined)
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMagicLink = async () => {
    if (!email) {
      setError("Please enter your email first")
      return
    }
    
    setError("")
    setIsSendingMagicLink(true)
    
    try {
      const response = await fetch("/api/magic-link/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send magic link")
      }
      
      setMagicLinkSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link")
    } finally {
      setIsSendingMagicLink(false)
    }
  }

  const handleForgotPassword = useCallback(async () => {
    if (!email) {
      setError("Please enter your email first")
      return
    }
    
    setError("")
    setIsSendingForgotPassword(true)
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send reset link")
      }
      
      setForgotPasswordSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link")
    } finally {
      setIsSendingForgotPassword(false)
    }
  }, [email])

  const cardContent = (
    <Card className="w-full max-w-md border border-border bg-card p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-[var(--shadow-card)] max-h-[90vh] overflow-y-auto">
        <div className="mb-5 sm:mb-6 md:mb-8 text-center">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <AnplexaLogo size={48} className="sm:w-16 sm:h-16 animate-pulse-glow" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1.5 sm:mb-2">
            <AnplexaLogo size={20} className="sm:w-6 sm:h-6" />
            <h1 className="text-xl sm:text-2xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Private AI Companion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="border border-border bg-background pl-10 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] min-touch-target"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="border border-border bg-background pl-10 pr-10 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] min-touch-target"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="border border-border bg-background pl-10 pr-10 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] min-touch-target"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 min-touch-target"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {isLogin && (
              <div className="flex justify-end">
                {forgotPasswordSent ? (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Reset link sent to your email
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isSendingForgotPassword}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {isSendingForgotPassword ? "Sending..." : "Forgot password?"}
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg sm:rounded-xl border border-destructive bg-destructive/10 p-2.5 sm:p-3">
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full gradient-primary glow-hover rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base font-medium min-touch-target" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="text-sm">{isLogin ? "Signing in..." : "Creating account..."}</span>
              </span>
            ) : (
              <span className="uppercase tracking-wider">{isLogin ? "Login" : "Create Account"}</span>
            )}
          </Button>

          {isLogin && showMagicLink && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {magicLinkSent ? (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Check your email for the login link!</span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendMagicLink}
                  disabled={isSendingMagicLink || !email}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl border-border hover:bg-primary/10 hover:border-primary min-touch-target"
                >
                  {isSendingMagicLink ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Sending...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      <span>Send me a login link</span>
                    </span>
                  )}
                </Button>
              )}
            </>
          )}
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setMagicLinkSent(false)
            }}
            className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors py-2 min-touch-target"
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-5 sm:mt-6 md:mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <p className="text-[10px] sm:text-xs">
            Your data is encrypted and stored privately
          </p>
        </div>
      </Card>
  )

  // When embedded in a Dialog, just return the card content
  if (embedded) {
    return cardContent
  }

  // When standalone, wrap with fixed overlay
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      {cardContent}
    </div>
  )
}
