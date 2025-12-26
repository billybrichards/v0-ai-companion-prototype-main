"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail, User, Terminal } from "lucide-react"

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
      <Card className="w-full max-w-md border-2 border-border bg-card p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg border-2 border-primary bg-primary/10 p-3">
              <Terminal className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">TERMINAL COMPANION</h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            {isLogin ? "> Authenticate to continue..." : "> Create your account..."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">DISPLAY NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="border-2 border-border bg-background pl-10 font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-2 border-border bg-background pl-10 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="border-2 border-border bg-background pl-10 font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="rounded border-2 border-destructive bg-destructive/10 p-3">
              <p className="text-sm font-mono text-destructive">[ERROR] {error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isLogin ? "Authenticating..." : "Creating account..."}
              </span>
            ) : (
              <span>{isLogin ? "LOGIN" : "CREATE ACCOUNT"}</span>
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
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "> Need an account? Register" : "> Already have an account? Login"}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <Lock className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground font-mono">
            [SECURE] Your data is encrypted and stored privately
          </p>
        </div>
      </Card>
    </div>
  )
}
