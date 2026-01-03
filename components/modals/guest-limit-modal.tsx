"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, MessageSquare, Sparkles } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

interface GuestLimitModalProps {
  onSignUp: () => void
}

export function GuestLimitModal({ onSignUp }: GuestLimitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="mx-4 max-w-md w-full border-2 border-primary/50 bg-card p-6 sm:p-8 rounded-2xl shadow-[0_0_40px_rgba(123,44,191,0.3)]">
        <div className="space-y-6 text-center">
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 blur-2xl opacity-60">
              <div className="h-16 w-16 rounded-full bg-primary" />
            </div>
            <div className="relative">
              <AnplexaLogo size={64} className="drop-shadow-[0_0_20px_rgba(123,44,191,0.8)]" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
              You've reached your free limit
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create a free account to continue your private conversation with unlimited messages.
            </p>
          </div>

          <div className="space-y-3 text-left bg-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">Unlimited private conversations</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">100% private & judgment-free</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">Save your chat history</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onSignUp}
              className="w-full gradient-primary glow-hover h-12 sm:h-14 text-base sm:text-lg font-medium rounded-xl"
            >
              Sign Up Free
            </Button>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <button onClick={onSignUp} className="text-primary hover:underline font-medium">
                Log in
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default GuestLimitModal
