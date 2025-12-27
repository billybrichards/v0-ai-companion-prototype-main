"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

export default function AuthForm() {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
      <Card className="w-full max-w-md border border-border bg-card p-8 rounded-3xl shadow-[var(--shadow-card)]">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <AnplexaLogo size={64} className="animate-pulse-glow" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <AnplexaLogo size={24} />
            <h1 className="text-2xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Private AI Companion
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
                  className="border border-border bg-background pl-10 rounded-xl h-12 focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
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
                placeholder="Email"
                required
                className="border border-border bg-background pl-10 pr-10 rounded-xl h-12 focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
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

          {error && (
            <div className="rounded-xl border border-destructive bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full gradient-primary glow-hover rounded-xl h-12 text-base font-medium" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <span className="uppercase tracking-wider">{isLogin ? "Login" : "Create Account"}</span>
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
