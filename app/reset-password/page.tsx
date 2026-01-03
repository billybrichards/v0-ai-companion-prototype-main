"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push("/dash")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-4 safe-top safe-bottom">
        <Card className="w-full max-w-md border border-border bg-card p-8 rounded-3xl shadow-[var(--shadow-card)]">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/20 p-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-heading font-light tracking-wide text-foreground mb-2">
              Password Reset
            </h1>
            <p className="text-muted-foreground mb-4">
              Your password has been reset successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-4 safe-top safe-bottom">
      <Card className="w-full max-w-md border border-border bg-card p-8 rounded-3xl shadow-[var(--shadow-card)]">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <AnplexaLogo size={48} className="animate-pulse-glow" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <AnplexaLogo size={20} />
            <h1 className="text-2xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Reset your password
          </p>
        </div>

        {!token ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Button 
              onClick={() => router.push("/dash")} 
              className="gradient-primary glow-hover rounded-xl"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="border border-border bg-background pl-10 pr-10 rounded-xl h-12 focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className="border border-border bg-background pl-10 rounded-xl h-12 focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gradient-primary glow-hover rounded-xl h-12 font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Resetting...</span>
                </span>
              ) : (
                <span className="uppercase tracking-wider">Reset Password</span>
              )}
            </Button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-xs">
            Your data is encrypted and stored privately
          </p>
        </div>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
