"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail, User } from "lucide-react"

export default function AuthForm() {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full border border-primary/50 bg-primary/10 p-4 animate-pulse-glow">
              <div className="h-8 w-8 rounded-full bg-primary/30" />
            </div>
          </div>
          <h1 className="text-2xl font-heading font-light tracking-tight text-foreground">ANPLEXA</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="border border-border bg-background pl-10 rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border border-border bg-background pl-10 rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="border border-border bg-background pl-10 rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full gradient-primary glow-hover rounded-lg" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-[var(--security)] bg-[var(--security)]/10 p-4">
          <Lock className="h-5 w-5 text-[var(--security)] shrink-0" />
          <p className="text-xs text-[var(--security)]">
            End-to-End Encrypted • Private & Secure
          </p>
        </div>
      </Card>
    </div>
  )
}
