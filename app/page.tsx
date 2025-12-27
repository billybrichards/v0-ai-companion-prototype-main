"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { checkBackendHealth, type HealthStatus } from "@/lib/api-health"
import ChatInterface from "@/components/chat-interface"
import GenderSetup from "@/components/gender-setup"
import SettingsModal from "@/components/settings-modal"
import FeedbackModal from "@/components/feedback-modal"
import AuthForm from "@/components/auth-form"

type GenderOption = "male" | "female" | "non-binary" | "custom"

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()
  const [setupComplete, setSetupComplete] = useState(false)
  const [gender, setGender] = useState<GenderOption>("female")
  const [customGender, setCustomGender] = useState<string | undefined>()
  const [showSettings, setShowSettings] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null)

  useEffect(() => {
    const storedGender = localStorage.getItem("companion-gender")
    const storedCustomGender = localStorage.getItem("companion-custom-gender")

    if (storedGender) {
      setGender(storedGender as GenderOption)
      if (storedCustomGender) {
        setCustomGender(storedCustomGender)
      }
      setSetupComplete(true)
    }

    setIsLoading(false)
  }, [])

  // Check backend health on startup
  useEffect(() => {
    checkBackendHealth().then(setBackendHealth)
  }, [])

  const handleGenderSetup = (selectedGender: GenderOption, selectedCustomGender?: string) => {
    setGender(selectedGender)
    setCustomGender(selectedCustomGender)
    localStorage.setItem("companion-gender", selectedGender)
    if (selectedCustomGender) {
      localStorage.setItem("companion-custom-gender", selectedCustomGender)
    } else {
      localStorage.removeItem("companion-custom-gender")
    }
    setSetupComplete(true)
  }

  const handleSettingsSave = (selectedGender: GenderOption, selectedCustomGender?: string) => {
    setGender(selectedGender)
    setCustomGender(selectedCustomGender)
    localStorage.setItem("companion-gender", selectedGender)
    if (selectedCustomGender) {
      localStorage.setItem("companion-custom-gender", selectedCustomGender)
    } else {
      localStorage.removeItem("companion-custom-gender")
    }
    setShowSettings(false)
  }

  // Show loading while checking auth
  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-muted-foreground font-mono">&gt; Initializing...</div>
      </main>
    )
  }

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm />
  }

  // Show gender setup if not complete
  if (!setupComplete) {
    return (
      <main className="flex min-h-screen flex-col">
        <GenderSetup onComplete={handleGenderSetup} />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      {backendHealth?.status === "unhealthy" && (
        <div className="bg-destructive/10 border-b border-destructive px-4 py-2 text-center">
          <p className="text-sm text-destructive font-mono">
            [WARNING] Backend unavailable: {backendHealth.message}
          </p>
        </div>
      )}
      <ChatInterface
        gender={gender}
        customGender={customGender}
        onOpenSettings={() => setShowSettings(true)}
        onOpenFeedback={() => setShowFeedback(true)}
        onLogout={logout}
        userName={user?.displayName || user?.email}
      />
      {showSettings && (
        <SettingsModal
          currentGender={gender}
          currentCustomGender={customGender}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </main>
  )
}
