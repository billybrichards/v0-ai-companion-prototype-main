"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Check, Loader2, CreditCard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface SettingsModalProps {
  currentGender: GenderOption
  currentCustomGender?: string
  onClose: () => void
  onSave: (gender: GenderOption, customGender?: string) => void
}

export default function SettingsModal({ currentGender, currentCustomGender, onClose, onSave }: SettingsModalProps) {
  const { user, accessToken, updateSubscriptionStatus } = useAuth()
  const [selectedGender, setSelectedGender] = useState<GenderOption>(currentGender)
  const [customGender, setCustomGender] = useState(currentCustomGender || "")
  const [showCustomInput, setShowCustomInput] = useState(currentGender === "custom")
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [unsubscribeError, setUnsubscribeError] = useState<string | null>(null)
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false)

  const isSubscribed = user?.subscriptionStatus === "subscribed"

  const handleUnsubscribe = async () => {
    if (!accessToken) return

    setIsUnsubscribing(true)
    setUnsubscribeError(null)

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to cancel subscription")
      }

      updateSubscriptionStatus("not_subscribed")
      setShowUnsubscribeConfirm(false)
    } catch (error) {
      setUnsubscribeError(error instanceof Error ? error.message : "Failed to cancel subscription")
    } finally {
      setIsUnsubscribing(false)
    }
  }

  const genderOptions: { value: GenderOption; label: string; description: string }[] = [
    { value: "male", label: "Male", description: "He/Him" },
    { value: "female", label: "Female", description: "She/Her" },
    { value: "non-binary", label: "Non-Binary", description: "They/Them" },
    { value: "custom", label: "Custom", description: "Define your own" },
  ]

  const handleGenderSelect = (gender: GenderOption) => {
    setSelectedGender(gender)
    if (gender === "custom") {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      setCustomGender("")
    }
  }

  const handleSave = () => {
    if (selectedGender === "custom" && !customGender.trim()) return
    onSave(selectedGender, selectedGender === "custom" ? customGender : undefined)
  }

  const hasChanges =
    selectedGender !== currentGender || (selectedGender === "custom" && customGender !== currentCustomGender)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl border-2 border-border bg-card p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">SETTINGS</h2>
              <p className="text-pretty text-sm text-muted-foreground font-mono">Configure companion preferences</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <label className="text-sm font-bold text-foreground">COMPANION GENDER</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleGenderSelect(option.value)}
                  className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 ${
                    selectedGender === option.value ? "border-primary bg-primary/5" : "border-border bg-background"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selectedGender === option.value ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedGender === option.value && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-foreground">{option.label}</div>
                    <div className="text-sm text-muted-foreground font-mono">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showCustomInput && (
            <div className="space-y-2">
              <label htmlFor="settings-custom-gender" className="text-sm font-bold text-foreground">
                SPECIFY CUSTOM GENDER IDENTITY
              </label>
              <input
                id="settings-custom-gender"
                type="text"
                value={customGender}
                onChange={(e) => setCustomGender(e.target.value)}
                placeholder="Enter gender identity"
                className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Subscription Management */}
          {isSubscribed && (
            <div className="border-t border-border pt-6">
              <label className="text-sm font-bold text-foreground">SUBSCRIPTION</label>
              <div className="mt-3 rounded-lg border-2 border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-bold text-foreground">Active Subscription</div>
                      <div className="text-sm text-muted-foreground font-mono">Your subscription is currently active</div>
                    </div>
                  </div>
                  {!showUnsubscribeConfirm ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUnsubscribeConfirm(true)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Unsubscribe
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUnsubscribeConfirm(false)}
                        disabled={isUnsubscribing}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleUnsubscribe}
                        disabled={isUnsubscribing}
                      >
                        {isUnsubscribing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                {unsubscribeError && (
                  <div className="mt-3 text-sm text-destructive font-mono">{unsubscribeError}</div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || (selectedGender === "custom" && !customGender.trim())}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
