"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface GenderSetupProps {
  onComplete: (gender: GenderOption, customGender?: string) => void
}

const MaleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="5" />
    <path d="M19 5l-5.4 5.4" />
    <path d="M15 5h4v4" />
  </svg>
)

const FemaleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v8" />
    <path d="M9 18h6" />
  </svg>
)

const NonBinaryIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 3.64a2 2 0 0 1 0 2.83L5.64 18.36a2 2 0 0 1-2.83-2.83L15.54 3.64a2 2 0 0 1 2.83 0z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export default function GenderSetup({ onComplete }: GenderSetupProps) {
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null)
  const [customGender, setCustomGender] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const genderOptions: { value: GenderOption; label: string; icon: React.ReactNode }[] = [
    { value: "male", label: "Male", icon: <MaleIcon /> },
    { value: "female", label: "Female", icon: <FemaleIcon /> },
    { value: "non-binary", label: "Non-Binary", icon: <NonBinaryIcon /> },
    { value: "custom", label: "Custom/Edit", icon: <Pencil className="h-8 w-8" strokeWidth={1.5} /> },
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
      <Card className="w-full max-w-lg border border-border bg-card p-8 rounded-3xl shadow-[var(--shadow-card)]">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <AnplexaLogo size={28} />
              <span className="text-xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</span>
            </div>
            <div>
              <h2 className="text-xl font-medium text-foreground">Select companion gender</h2>
              <p className="text-muted-foreground">identity to begin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleGenderSelect(option.value)}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition-all hover:border-primary/50 ${
                  selectedGender === option.value 
                    ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(123,44,191,0.3)]" 
                    : "border-border bg-secondary/50"
                }`}
              >
                <div className={`${selectedGender === option.value ? "text-primary" : "text-muted-foreground"}`}>
                  {option.icon}
                </div>
                <span className={`text-sm font-medium ${selectedGender === option.value ? "text-foreground" : "text-muted-foreground"}`}>
                  {option.label}
                </span>
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
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              />
            </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={!selectedGender || (selectedGender === "custom" && !customGender.trim())}
            className="w-full gradient-primary glow-hover rounded-xl h-12 text-base font-medium uppercase tracking-wider"
            size="lg"
          >
            Initialize
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            You can update preferences anytime in settings
          </p>
        </div>
      </Card>
    </div>
  )
}
