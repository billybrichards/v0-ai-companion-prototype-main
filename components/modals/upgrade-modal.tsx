"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { analytics } from "@/lib/analytics"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { accessToken, user } = useAuth()
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly")

  const handleSubscribe = async (plan: "monthly" | "yearly" = "yearly") => {
    if (!accessToken || !user) {
      console.log("[Subscribe] Missing accessToken or user")
      return
    }

    setIsSubscribing(true)
    analytics.upgradeClicked("upgrade_modal", plan)
    analytics.checkoutStarted(plan, plan === "yearly" ? 11.99 : 2.99, "GBP")

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          plan,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
      alert(error instanceof Error ? error.message : "Failed to start checkout")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-5 sm:p-6">
        <div className="space-y-5">
          <div className="text-center space-y-2">
            <div className="mx-auto w-fit relative">
              <div className="absolute inset-0 blur-xl opacity-50">
                <div className="h-12 w-12 rounded-full bg-primary" />
              </div>
              <AnplexaLogo size={48} className="relative drop-shadow-[0_0_12px_rgba(123,44,191,0.6)]" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
                You&apos;ve reached your limit
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Subscribe now to continue your private conversations.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-3">
            {/* Monthly Plan */}
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedPlan === "monthly"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Monthly</div>
                  <div className="text-sm text-muted-foreground">Cancel anytime</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">£2.99</div>
                  <div className="text-sm text-muted-foreground">/month</div>
                </div>
              </div>
            </button>

            {/* Yearly Plan (Best Value) */}
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                selectedPlan === "yearly"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="absolute -top-3 right-4 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                BEST VALUE
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Early Believer</div>
                  <div className="text-sm text-primary">Locked in forever</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-foreground">£0.99</div>
                  <div className="text-sm text-muted-foreground">/month</div>
                  <div className="text-xs text-muted-foreground">Billed £11.99/year</div>
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={isSubscribing}
            className="w-full h-12 text-base font-medium gradient-primary glow-hover text-white rounded-xl min-touch-target"
          >
            {isSubscribing ? "Processing..." : "Subscribe Now"}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Your email is kept private.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpgradeModal
