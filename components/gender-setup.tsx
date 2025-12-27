"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface GenderSetupProps {
  onComplete: (gender: GenderOption, customGender?: string) => void
}

export default function GenderSetup({ onComplete }: GenderSetupProps) {
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null)
  const [customGender, setCustomGender] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

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

  const handleContinue = () => {
    if (!selectedGender) return
    if (selectedGender === "custom" && !customGender.trim()) return
    onComplete(selectedGender, selectedGender === "custom" ? customGender : undefined)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-balance text-3xl font-heading font-light tracking-tight text-foreground">ANPLEXA</h1>
              <span className="rounded-full bg-primary/20 border border-primary/50 px-3 py-1 text-xs font-medium text-primary">BETA</span>
            </div>
            <p className="text-pretty text-muted-foreground">
              Select your companion&apos;s gender identity to begin
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleGenderSelect(option.value)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary/50 ${
                  selectedGender === option.value ? "border-primary bg-primary/10 glow" : "border-border bg-secondary"
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
                  <div className="font-medium text-foreground">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </button>
            ))}
          </div>

          {showCustomInput && (
            <div className="space-y-2">
              <label htmlFor="custom-gender" className="text-sm font-medium text-foreground">
                Specify custom gender identity
              </label>
              <input
                id="custom-gender"
                type="text"
                value={customGender}
                onChange={(e) => setCustomGender(e.target.value)}
                placeholder="Enter gender identity"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              />
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={!selectedGender || (selectedGender === "custom" && !customGender.trim())}
            className="w-full gradient-primary glow-hover rounded-lg"
            size="lg"
          >
            Continue
          </Button>

          <p className="text-pretty text-center text-xs text-muted-foreground">
            You can update this preference anytime in settings
          </p>
        </div>
      </Card>
    </div>
  )
}
