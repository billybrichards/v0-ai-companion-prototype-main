"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Lock, X, Shield, ArrowRight } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

interface OptionalPasswordPromptProps {
  open: boolean
  onClose: () => void
  onSetPassword: (password: string) => Promise<void>
  email: string
}

export default function OptionalPasswordPrompt({ 
  open, 
  onClose, 
  onSetPassword,
  email 
}: OptionalPasswordPromptProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setIsLoading(true)
    try {
      await onSetPassword(password)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("password-prompt-dismissed", "true")
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <button 
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <AnplexaLogo size={48} className="animate-pulse-glow" />
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl font-heading">Secure Your Account</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set a password to access your conversations from any device. You can skip this for now.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              disabled
              className="border-border/50 bg-background/30 h-11 text-sm text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="border-border/50 bg-background/50 pl-11 rounded-xl h-12 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="border-border/50 bg-background/50 pl-11 rounded-xl h-12 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1 h-11 rounded-xl text-sm"
            >
              Skip for now
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11 gradient-primary glow-hover rounded-xl text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Set Password
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-2">
          You can always set a password later in settings
        </p>
      </DialogContent>
    </Dialog>
  )
}
