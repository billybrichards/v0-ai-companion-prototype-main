"use client"

import { Card } from "@/components/ui/card"
import { Lock, Sparkles } from "lucide-react"

interface WelcomeCardProps {
  isGuest?: boolean
  freeMessageLimit?: number
}

/**
 * WelcomeCard Component
 *
 * Initial welcome message shown before first message.
 */
export function WelcomeCard({
  isGuest = false,
  freeMessageLimit = 6,
}: WelcomeCardProps) {
  return (
    <Card className="border border-border bg-card/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-[var(--shadow-card)]">
      <div className="space-y-4 sm:space-y-6">
        <p className="text-sm sm:text-base text-pretty leading-relaxed text-muted-foreground border-l-[3px] border-l-primary pl-3 sm:pl-4">
          Welcome to anplexa, your private, judgment-free space for meaningful
          conversation. Our AI companion is here to listen, connect, and engage
          with you authentically.
        </p>

        {isGuest && (
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-pretty text-xs sm:text-sm text-muted-foreground">
              Try {freeMessageLimit} free messages! Sign up to continue the
              conversation.
            </p>
          </div>
        )}

        <div className="flex items-start sm:items-center gap-2 sm:gap-3 rounded-lg border border-[var(--security)] bg-[var(--security)]/10 p-3 sm:p-4">
          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--security)] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-pretty text-xs sm:text-sm text-[var(--security)]">
            End-to-End Encrypted • Private Session • Zero Tracking
          </p>
        </div>
      </div>
    </Card>
  )
}
