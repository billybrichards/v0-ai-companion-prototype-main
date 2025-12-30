"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, ArrowRight, ArrowLeft } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface GenderSetupProps {
  onComplete: (gender: GenderOption, customGender?: string, chatName?: string) => void
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
  const [step, setStep] = useState<1 | 2>(1)
  const [chatName, setChatName] = useState("")
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null)
  const [customGender, setCustomGender] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const genderOptions: { value: GenderOption; label: string; icon: React.ReactNode }[] = [
    { value: "male", label: "Male", icon: <MaleIcon /> },
    { value: "female", label: "Female", icon: <FemaleIcon /> },
    { value: "non-binary", label: "Non-Binary", icon: <NonBinaryIcon /> },
    { value: "custom", label: "Custom/Edit", icon: <Pencil className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.5} /> },
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
    onComplete(
      selectedGender, 
      selectedGender === "custom" ? customGender : undefined,
      chatName.trim() || undefined
    )
  }

  const handleNextStep = () => {
    setStep(2)
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-3 sm:px-4 py-6 safe-top safe-bottom">
      <Card className="w-full max-w-lg border border-border bg-card p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-[var(--shadow-card)]">
        {step === 1 ? (
          <div className="space-y-5 sm:space-y-6 md:space-y-8 animate-in fade-in duration-300">
            <div className="space-y-4 sm:space-y-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl opacity-40">
                    <div className="h-12 w-12 rounded-full bg-primary" />
                  </div>
                  <AnplexaLogo size={48} className="relative drop-shadow-[0_0_12px_rgba(123,44,191,0.6)]" />
                </div>
                <span className="text-xl sm:text-2xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-medium text-foreground">What should I call you?</h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">A name, nickname, or nothing at all</p>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Enter your name (optional)"
                autoFocus
                className="w-full rounded-xl border border-border bg-background px-4 py-3 sm:py-4 text-base sm:text-lg text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(123,44,191,0.3)] transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNextStep()
                  }
                }}
              />
            </div>

            <Button
              onClick={handleNextStep}
              className="w-full gradient-primary glow-hover rounded-xl h-12 sm:h-14 text-sm sm:text-base font-medium min-touch-target group"
              size="lg"
            >
              <span>Continue</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-2 w-2 rounded-full bg-border" />
            </div>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-3 sm:space-y-4 text-center">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex items-center justify-center gap-2">
                <AnplexaLogo size={24} className="sm:w-7 sm:h-7" />
                <span className="text-lg sm:text-xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-medium text-foreground">
                  {chatName.trim() ? `Hi ${chatName.trim()}!` : "Almost there!"}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">Select companion gender</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleGenderSelect(option.value)}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-4 sm:p-5 md:p-6 transition-all hover:border-primary/50 min-touch-target ${
                    selectedGender === option.value 
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(123,44,191,0.3)]" 
                      : "border-border bg-secondary/50"
                  }`}
                >
                  <div className={`${selectedGender === option.value ? "text-primary" : "text-muted-foreground"} [&_svg]:w-6 [&_svg]:h-6 sm:[&_svg]:w-8 sm:[&_svg]:h-8`}>
                    {option.icon}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${selectedGender === option.value ? "text-foreground" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {showCustomInput && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <label htmlFor="custom-gender" className="text-xs sm:text-sm font-medium text-foreground">
                  Specify custom gender identity
                </label>
                <input
                  id="custom-gender"
                  type="text"
                  value={customGender}
                  onChange={(e) => setCustomGender(e.target.value)}
                  placeholder="Enter gender identity"
                  className="w-full rounded-lg sm:rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] min-touch-target"
                />
              </div>
            )}

            <Button
              onClick={handleContinue}
              disabled={!selectedGender || (selectedGender === "custom" && !customGender.trim())}
              className="w-full gradient-primary glow-hover rounded-xl h-12 sm:h-14 text-sm sm:text-base font-medium uppercase tracking-wider min-touch-target"
              size="lg"
            >
              Start Chatting
            </Button>

            <div className="flex justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/50" />
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
              You can update preferences anytime in settings
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
