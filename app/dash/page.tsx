"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { checkBackendHealth, type HealthStatus } from "@/lib/api-health"
import ChatInterface from "@/components/chat-interface"
import GenderSetup from "@/components/gender-setup"
import SettingsModal from "@/components/settings-modal"
import FeedbackModal from "@/components/feedback-modal"

type GenderOption = "male" | "female" | "non-binary" | "custom"

export default function DashPage() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()
  const [setupComplete, setSetupComplete] = useState(false)
  const [gender, setGender] = useState<GenderOption>("female")
  const [customGender, setCustomGender] = useState<string | undefined>()
  const [showSettings, setShowSettings] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null)

  const userId = user?.id
  useEffect(() => {
    if (authLoading) {
      return
    }
    
    if (!isAuthenticated || !userId) {
      const guestGender = localStorage.getItem("guest-companion-gender")
      if (guestGender) {
        setGender(guestGender as GenderOption)
        const guestCustomGender = localStorage.getItem("guest-companion-custom-gender")
        if (guestCustomGender) {
          setCustomGender(guestCustomGender)
        }
        setSetupComplete(true)
      }
      setIsLoading(false)
      return
    }

    const userGenderKey = `companion-gender-${userId}`
    const userCustomGenderKey = `companion-custom-gender-${userId}`
    
    const storedGender = localStorage.getItem(userGenderKey)
    const storedCustomGender = localStorage.getItem(userCustomGenderKey)

    if (storedGender) {
      setGender(storedGender as GenderOption)
      if (storedCustomGender) {
        setCustomGender(storedCustomGender)
      }
      setSetupComplete(true)
    } else {
      const guestGender = localStorage.getItem("guest-companion-gender")
      if (guestGender) {
        setGender(guestGender as GenderOption)
        const guestCustomGender = localStorage.getItem("guest-companion-custom-gender")
        if (guestCustomGender) {
          setCustomGender(guestCustomGender)
        }
        localStorage.setItem(userGenderKey, guestGender)
        if (guestCustomGender) {
          localStorage.setItem(userCustomGenderKey, guestCustomGender)
        }
        localStorage.removeItem("guest-companion-gender")
        localStorage.removeItem("guest-companion-custom-gender")
        setSetupComplete(true)
      } else {
        setSetupComplete(false)
      }
    }

    setIsLoading(false)
  }, [authLoading, isAuthenticated, userId])

  useEffect(() => {
    checkBackendHealth().then(setBackendHealth)
  }, [])

  const handleGenderSetup = (selectedGender: GenderOption, selectedCustomGender?: string) => {
    setGender(selectedGender)
    setCustomGender(selectedCustomGender)
    
    if (user?.id) {
      const userGenderKey = `companion-gender-${user.id}`
      const userCustomGenderKey = `companion-custom-gender-${user.id}`
      localStorage.setItem(userGenderKey, selectedGender)
      if (selectedCustomGender) {
        localStorage.setItem(userCustomGenderKey, selectedCustomGender)
      } else {
        localStorage.removeItem(userCustomGenderKey)
      }
    } else {
      localStorage.setItem("guest-companion-gender", selectedGender)
      if (selectedCustomGender) {
        localStorage.setItem("guest-companion-custom-gender", selectedCustomGender)
      } else {
        localStorage.removeItem("guest-companion-custom-gender")
      }
    }
    setSetupComplete(true)
  }

  const handleSettingsSave = (selectedGender: GenderOption, selectedCustomGender?: string) => {
    if (!user?.id) return
    
    const userGenderKey = `companion-gender-${user.id}`
    const userCustomGenderKey = `companion-custom-gender-${user.id}`
    
    setGender(selectedGender)
    setCustomGender(selectedCustomGender)
    localStorage.setItem(userGenderKey, selectedGender)
    if (selectedCustomGender) {
      localStorage.setItem(userCustomGenderKey, selectedCustomGender)
    } else {
      localStorage.removeItem(userCustomGenderKey)
    }
    setShowSettings(false)
  }

  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <div className="text-muted-foreground">Initializing...</div>
        </div>
      </main>
    )
  }

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
        <div className="bg-[var(--security)]/10 border-b border-[var(--security)] px-4 py-2 text-center">
          <p className="text-sm text-[var(--security)]">
            Connection issue: {backendHealth.message}
          </p>
        </div>
      )}
      <ChatInterface
        gender={gender}
        customGender={customGender}
        onOpenSettings={() => setShowSettings(true)}
        onOpenFeedback={() => setShowFeedback(true)}
        onLogout={isAuthenticated ? logout : undefined}
        userName={user?.displayName || user?.email}
        isGuest={!isAuthenticated}
      />
      {showSettings && isAuthenticated && (
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
