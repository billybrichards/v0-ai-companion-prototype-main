"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { checkBackendHealth, type HealthStatus } from "@/lib/api-health"
import ChatInterface from "@/components/chat-interface"
import AnplexaLogo from "@/components/anplexa-logo"
import GenderSetup from "@/components/gender-setup"
import SettingsModal from "@/components/settings-modal"
import FeedbackModal from "@/components/feedback-modal"
import AuthForm from "@/components/auth-form"

type GenderOption = "male" | "female" | "non-binary" | "custom"
type FunnelAuthMode = "login" | "signup" | null

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

function DashContent() {
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: authLoading, user, logout, accessToken } = useAuth()
  const [setupComplete, setSetupComplete] = useState(false)
  const [gender, setGender] = useState<GenderOption>("female")
  const [customGender, setCustomGender] = useState<string | undefined>()
  const [chatName, setChatName] = useState<string | undefined>()
  const [showSettings, setShowSettings] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null)
  const [conversationKey, setConversationKey] = useState(0)
  const [funnelAuthMode, setFunnelAuthMode] = useState<FunnelAuthMode>(null)
  const [funnelEmail, setFunnelEmail] = useState<string | null>(null)
  const [funnelChecked, setFunnelChecked] = useState(false)

  useEffect(() => {
    const checkFunnelParams = async () => {
      const email = searchParams.get("email")
      const uid = searchParams.get("uid")
      
      if (isAuthenticated) {
        setFunnelChecked(true)
        return
      }

      if (email) {
        setFunnelEmail(email)
        try {
          const response = await fetch("/api/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          })
          const data = await response.json()
          if (data.exists && data.hasPassword) {
            setFunnelAuthMode("login")
          } else if (data.exists && !data.hasPassword) {
            setFunnelAuthMode("signup")
          }
        } catch (error) {
          console.error("Failed to check funnel email:", error)
        }
      } else if (uid) {
        try {
          const response = await fetch("/api/check-uid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid }),
          })
          const data = await response.json()
          if (data.exists && data.email) {
            setFunnelEmail(data.email)
            if (data.hasPassword) {
              setFunnelAuthMode("login")
            } else {
              setFunnelAuthMode("signup")
            }
          }
        } catch (error) {
          console.error("Failed to check funnel uid:", error)
        }
      }
      
      setFunnelChecked(true)
    }

    if (!authLoading) {
      checkFunnelParams()
    }
  }, [searchParams, authLoading, isAuthenticated])

  const userId = user?.id
  useEffect(() => {
    if (authLoading) {
      return
    }
    
    if (!isAuthenticated || !userId) {
      const guestGender = localStorage.getItem("guest-companion-gender")
      const guestName = localStorage.getItem("guest-chat-name")
      if (guestGender) {
        setGender(guestGender as GenderOption)
        const guestCustomGender = localStorage.getItem("guest-companion-custom-gender")
        if (guestCustomGender) {
          setCustomGender(guestCustomGender)
        }
        if (guestName) {
          setChatName(guestName)
        }
        setSetupComplete(true)
      }
      setIsLoading(false)
      return
    }

    const userGenderKey = `companion-gender-${userId}`
    const userCustomGenderKey = `companion-custom-gender-${userId}`
    const userChatNameKey = `chat-name-${userId}`
    
    const storedGender = localStorage.getItem(userGenderKey)
    const storedCustomGender = localStorage.getItem(userCustomGenderKey)
    const storedChatName = localStorage.getItem(userChatNameKey)

    if (storedGender) {
      setGender(storedGender as GenderOption)
      if (storedCustomGender) {
        setCustomGender(storedCustomGender)
      }
      if (storedChatName) {
        setChatName(storedChatName)
      }
      setSetupComplete(true)
    } else {
      const guestGender = localStorage.getItem("guest-companion-gender")
      if (guestGender) {
        setGender(guestGender as GenderOption)
        const guestCustomGender = localStorage.getItem("guest-companion-custom-gender")
        const guestName = localStorage.getItem("guest-chat-name")
        if (guestCustomGender) {
          setCustomGender(guestCustomGender)
        }
        if (guestName) {
          setChatName(guestName)
        }
        localStorage.setItem(userGenderKey, guestGender)
        if (guestCustomGender) {
          localStorage.setItem(userCustomGenderKey, guestCustomGender)
        }
        if (guestName) {
          localStorage.setItem(userChatNameKey, guestName)
        }
        localStorage.removeItem("guest-companion-gender")
        localStorage.removeItem("guest-companion-custom-gender")
        localStorage.removeItem("guest-chat-name")
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

  const syncPreferencesToBackend = async (
    token: string,
    genderValue: GenderOption,
    customGenderValue?: string,
    chatNameValue?: string
  ) => {
    try {
      const genderToSend = genderValue === "custom" && customGenderValue 
        ? customGenderValue 
        : genderValue
      
      await fetch(`${API_BASE}/api/auth/gender`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gender: genderToSend }),
      })

      if (chatNameValue) {
        await fetch(`${API_BASE}/api/auth/chat-name`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chatName: chatNameValue }),
        })
      }
    } catch (error) {
      console.error("Failed to sync preferences to backend:", error)
    }
  }

  const handleGenderSetup = async (
    selectedGender: GenderOption, 
    selectedCustomGender?: string,
    selectedChatName?: string
  ) => {
    setGender(selectedGender)
    setCustomGender(selectedCustomGender)
    setChatName(selectedChatName)
    
    if (user?.id) {
      const userGenderKey = `companion-gender-${user.id}`
      const userCustomGenderKey = `companion-custom-gender-${user.id}`
      const userChatNameKey = `chat-name-${user.id}`
      
      localStorage.setItem(userGenderKey, selectedGender)
      if (selectedCustomGender) {
        localStorage.setItem(userCustomGenderKey, selectedCustomGender)
      } else {
        localStorage.removeItem(userCustomGenderKey)
      }
      if (selectedChatName) {
        localStorage.setItem(userChatNameKey, selectedChatName)
      } else {
        localStorage.removeItem(userChatNameKey)
      }

      if (accessToken) {
        await syncPreferencesToBackend(accessToken, selectedGender, selectedCustomGender, selectedChatName)
      }
    } else {
      localStorage.setItem("guest-companion-gender", selectedGender)
      if (selectedCustomGender) {
        localStorage.setItem("guest-companion-custom-gender", selectedCustomGender)
      } else {
        localStorage.removeItem("guest-companion-custom-gender")
      }
      if (selectedChatName) {
        localStorage.setItem("guest-chat-name", selectedChatName)
      } else {
        localStorage.removeItem("guest-chat-name")
      }
    }
    setSetupComplete(true)
  }

  const handleSettingsSave = async (selectedGender: GenderOption, selectedCustomGender?: string) => {
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

    if (accessToken) {
      await syncPreferencesToBackend(accessToken, selectedGender, selectedCustomGender, chatName)
    }
    
    setShowSettings(false)
  }

  const handleNewChat = () => {
    if (user?.id) {
      localStorage.removeItem(`chat-messages-${user.id}`)
    } else {
      localStorage.removeItem("guest-chat-messages")
      localStorage.removeItem("guest-message-count")
    }
    localStorage.removeItem("chat-messages")
    setConversationKey(prev => prev + 1)
  }

  const handleFunnelAuthClose = () => {
    setFunnelAuthMode(null)
    setFunnelEmail(null)
  }

  if (authLoading || isLoading || !funnelChecked) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-60 animate-pulse">
              <div className="h-20 w-20 rounded-full bg-primary" />
            </div>
            <div className="relative animate-[pulse_2s_ease-in-out_infinite]">
              <AnplexaLogo size={80} className="drop-shadow-[0_0_20px_rgba(123,44,191,0.8)]" />
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-primary/30 animate-[ping_2s_ease-in-out_infinite]" />
            <div className="absolute -inset-8 rounded-full border border-primary/20 animate-[ping_2s_ease-in-out_infinite_0.5s]" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl font-heading font-light tracking-widest text-foreground lowercase animate-pulse">
              anplexa
            </span>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]" />
              <div className="h-2 w-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
              <div className="h-2 w-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (funnelAuthMode) {
    return (
      <AuthForm 
        onSuccess={handleFunnelAuthClose}
        defaultMode={funnelAuthMode}
        prefillEmail={funnelEmail || undefined}
      />
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
        key={conversationKey}
        gender={gender}
        customGender={customGender}
        onOpenSettings={() => setShowSettings(true)}
        onOpenFeedback={() => setShowFeedback(true)}
        onLogout={isAuthenticated ? logout : undefined}
        onNewChat={handleNewChat}
        userName={chatName || user?.displayName || user?.email}
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

export default function DashPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-60 animate-pulse">
              <div className="h-20 w-20 rounded-full bg-primary" />
            </div>
            <div className="relative animate-[pulse_2s_ease-in-out_infinite]">
              <AnplexaLogo size={80} className="drop-shadow-[0_0_20px_rgba(123,44,191,0.8)]" />
            </div>
          </div>
          <span className="text-xl font-heading font-light tracking-widest text-foreground lowercase animate-pulse">
            anplexa
          </span>
        </div>
      </main>
    }>
      <DashContent />
    </Suspense>
  )
}
