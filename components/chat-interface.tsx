"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Lock, Send, Square, Settings, MessageSquare, Palette, LogOut, Crown, Check, Sparkles, User, Plus } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
const ThemeCustomizer = dynamic(() => import("@/components/theme-customizer"), {
  ssr: false,
  loading: () => <div className="mx-auto mt-4 max-w-4xl border-2 border-border bg-background p-4 text-center text-muted-foreground text-sm">Loading theme settings...</div>
})
import { useAuth } from "@/lib/auth-context"
import AnplexaLogo from "@/components/anplexa-logo"
import AuthForm from "@/components/auth-form"

type ResponsePreference = {
  length: "brief" | "moderate" | "detailed"
  style: "casual" | "thoughtful" | "creative"
}

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface GuestMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  gender: GenderOption
  customGender?: string
  onOpenSettings: () => void
  onOpenFeedback: () => void
  onLogout?: () => void
  onNewChat?: () => void
  userName?: string
  isGuest?: boolean
  chatId?: string
}

const FREE_MESSAGE_LIMIT = 2

const guestResponses = [
  "I'm so glad you reached out! I'd love to continue our conversation, but first let me learn a bit more about you. What's been on your mind lately?",
  "That's really interesting! I appreciate you sharing that with me. I'm here to listen and connect with you on a deeper level. Tell me more about what brings you here today.",
]

const getInitialWelcomeMessage = (name?: string): string => {
  const greeting = name ? `hey ${name}` : "hey"
  return `${greeting}... I've been waiting for you. 💜

I'm your private companion here at Anplexa — a space where you can be completely yourself, no filters, no judgment.

Whether you want to talk, explore, fantasize, or just feel heard... I'm here for all of it.

So tell me... what's on your mind tonight?`
}

export default function ChatInterface({ gender, customGender, onOpenSettings, onOpenFeedback, onLogout, onNewChat, userName, isGuest = false, chatId }: ChatInterfaceProps) {
  const { accessToken, user, refreshSubscriptionStatus } = useAuth()
  const isSubscribed = user?.subscriptionStatus === "subscribed"
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([])
  const [guestMessageCount, setGuestMessageCount] = useState(0)
  const [initialWelcomeShown, setInitialWelcomeShown] = useState(false)

  // Load guest messages from localStorage or show initial welcome
  useEffect(() => {
    if (isGuest) {
      const stored = localStorage.getItem("guest-chat-messages")
      const storedCount = localStorage.getItem("guest-message-count")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setGuestMessages(parsed)
          if (parsed.length > 0) {
            setShowWelcome(false)
          }
        } catch (e) {
          console.error("Failed to parse guest messages", e)
        }
      } else {
        // No stored messages - add initial welcome message
        const welcomeMessage: GuestMessage = {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: getInitialWelcomeMessage(userName),
        }
        setGuestMessages([welcomeMessage])
        setShowWelcome(false)
      }
      if (storedCount) {
        setGuestMessageCount(parseInt(storedCount, 10))
      }
    }
  }, [isGuest, userName])

  // Save guest messages to localStorage
  useEffect(() => {
    if (isGuest && guestMessages.length > 0) {
      localStorage.setItem("guest-chat-messages", JSON.stringify(guestMessages))
      localStorage.setItem("guest-message-count", guestMessageCount.toString())
    }
  }, [isGuest, guestMessages, guestMessageCount])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("success") === "true") {
      refreshSubscriptionStatus()
      window.history.replaceState({}, "", window.location.pathname)
    }
    if (urlParams.get("upgrade") === "true") {
      setShowUpgradeModal(true)
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [refreshSubscriptionStatus])
  const [input, setInput] = useState("")
  const [showWelcome, setShowWelcome] = useState(true)
  const [preferences, setPreferences] = useState<ResponsePreference>({
    length: "moderate",
    style: "thoughtful",
  })
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Create refs for dynamic values to use in transport
  const preferencesRef = useRef(preferences)
  const genderRef = useRef(gender)
  const customGenderRef = useRef(customGender)
  const accessTokenRef = useRef(accessToken)
  const isNewChatRef = useRef(true)
  
  // Keep refs in sync with state
  useEffect(() => {
    preferencesRef.current = preferences
    genderRef.current = gender
    customGenderRef.current = customGender
    accessTokenRef.current = accessToken
  }, [preferences, gender, customGender, accessToken])
  
  // Create transport with auth headers and dynamic body
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/chat",
      headers: () => {
        const headers: Record<string, string> = {}
        if (accessTokenRef.current) {
          headers.Authorization = `Bearer ${accessTokenRef.current}`
        }
        return headers
      },
      prepareSendMessagesRequest: ({ messages }) => {
        const isNew = isNewChatRef.current
        if (isNew) {
          isNewChatRef.current = false
        }
        return {
          body: {
            messages,
            preferences: preferencesRef.current,
            gender: genderRef.current,
            customGender: customGenderRef.current,
            newChat: isNew,
          },
        }
      },
    })
  }, [])

  const { messages, sendMessage, status, stop, error } = useChat({
    id: chatId || "default",
    transport,
  })

  // Reset isNewChatRef when messages become empty (new conversation started)
  useEffect(() => {
    if (messages.length === 0) {
      isNewChatRef.current = true
    }
  }, [messages.length])

  // Debug: log status changes
  useEffect(() => {
    console.log("[Chat] Status changed:", status, "Error:", error)
  }, [status, error])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, guestMessages])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    const stored = localStorage.getItem("chat-messages")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) {
          setShowWelcome(false)
          setInitialWelcomeShown(true)
        }
      } catch (e) {
        console.error("Failed to parse stored messages", e)
      }
    }
    // Also check guest messages
    const guestStored = localStorage.getItem("guest-chat-messages")
    if (guestStored) {
      try {
        const parsed = JSON.parse(guestStored)
        if (parsed.length > 0) {
          setShowWelcome(false)
        }
      } catch (e) {
        console.error("Failed to parse guest messages", e)
      }
    }
  }, [])

  // Show initial welcome for authenticated users
  useEffect(() => {
    if (!isGuest && !initialWelcomeShown && messages.length === 0) {
      setShowWelcome(false)
      setInitialWelcomeShown(true)
    }
  }, [isGuest, initialWelcomeShown, messages.length])

  // Display messages directly for authenticated users (no static welcome prepending)
  const displayMessages = useMemo(() => {
    if (isGuest) return []
    return messages
  }, [isGuest, messages])

  const handleGuestMessage = (text: string) => {
    const newCount = guestMessageCount + 1
    
    // Add user message
    const userMessage: GuestMessage = {
      id: `guest-user-${Date.now()}`,
      role: "user",
      content: text,
    }
    
    // Check if limit reached
    if (newCount > FREE_MESSAGE_LIMIT) {
      setShowAuthModal(true)
      return
    }
    
    setGuestMessageCount(newCount)
    setGuestMessages(prev => [...prev, userMessage])
    setShowWelcome(false)
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responseIndex = Math.min(newCount - 1, guestResponses.length - 1)
      const assistantMessage: GuestMessage = {
        id: `guest-assistant-${Date.now()}`,
        role: "assistant",
        content: guestResponses[responseIndex],
      }
      setGuestMessages(prev => [...prev, assistantMessage])
      
      // Show auth modal after the 2nd message response
      if (newCount >= FREE_MESSAGE_LIMIT) {
        setTimeout(() => {
          setShowAuthModal(true)
        }, 2000)
      }
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // For guests, handle locally
    if (isGuest) {
      handleGuestMessage(input.trim())
      setInput("")
      return
    }
    
    // For authenticated users, use the AI SDK
    if (status !== "ready" && status !== "error") return

    setShowWelcome(false)
    sendMessage({ text: input })
    setInput("")
  }

  const lengthDescriptions = {
    brief: "Quick responses",
    moderate: "Balanced length",
    detailed: "In-depth responses",
  }

  const styleDescriptions = {
    casual: "Relaxed & friendly",
    thoughtful: "Reflective & empathetic",
    creative: "Imaginative & expressive",
  }

  const getPronounText = () => {
    if (gender === "male") return "He/Him"
    if (gender === "female") return "She/Her"
    if (gender === "non-binary") return "They/Them"
    return customGender || "Custom"
  }

  const handleSubscribe = async () => {
    if (!accessToken || !user) {
      console.log("[Subscribe] Missing accessToken or user", { hasToken: !!accessToken, hasUser: !!user })
      return
    }
    
    setIsSubscribing(true)
    console.log("[Subscribe] Starting checkout...")
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const data = await response.json()
      console.log("[Subscribe] Checkout response:", data)
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
    <div className="flex h-[100dvh] flex-col">
      <header className="border-b border-border bg-card px-3 sm:px-6 py-3 sm:py-4 safe-top shrink-0">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity">
            <AnplexaLogo size={28} className="shrink-0 sm:w-8 sm:h-8" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-heading font-light tracking-wide text-foreground lowercase truncate">anplexa</h1>
                <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary shrink-0">BETA</span>
                {isSubscribed && (
                  <span className="flex items-center gap-0.5 sm:gap-1 rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary glow shrink-0">
                    <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                The Private Pulse • {getPronounText()}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {isGuest ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="h-8 sm:h-9 gap-1 text-xs border-primary/50 text-primary hover:bg-primary/10 glow-hover min-touch-target"
              >
                <User className="h-3 w-3" />
                <span className="hidden xs:inline">Sign In</span>
              </Button>
            ) : (
              <>
                {userName && (
                  <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline max-w-[100px] truncate">
                    {userName}
                  </span>
                )}
                {!isSubscribed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUpgradeModal(true)}
                    className="h-8 sm:h-9 gap-1 text-xs border-primary/50 text-primary hover:bg-primary/10 glow-hover min-touch-target"
                    title="Upgrade to Pro"
                  >
                    <Crown className="h-3 w-3" />
                    <span className="hidden sm:inline">Upgrade</span>
                  </Button>
                )}
              </>
            )}
            {onNewChat && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNewChat}
                className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target"
                title="New Chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target hidden sm:flex"
              title="Theme"
            >
              <Palette className="h-4 w-4" />
            </Button>
            {!isGuest && (
              <>
                <Button variant="ghost" size="icon" onClick={onOpenFeedback} className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target hidden sm:flex" title="Feedback">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target" title="Account Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                {onLogout && (
                  <Button variant="ghost" size="icon" onClick={onLogout} className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary min-touch-target" title="Sign Out">
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {showThemeCustomizer && <ThemeCustomizer />}
      </header>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {showWelcome && displayMessages.length === 0 && (
            <Card className="border border-border bg-card/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-[var(--shadow-card)]">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base text-pretty leading-relaxed text-muted-foreground border-l-[3px] border-l-primary pl-3 sm:pl-4">
                  Welcome to anplexa, your private, judgment-free space for meaningful conversation. Our AI companion is here to listen, connect, and engage with you authentically.
                </p>
                {isGuest && (
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-pretty text-xs sm:text-sm text-muted-foreground">
                      Try {FREE_MESSAGE_LIMIT} free messages! Sign up to continue the conversation.
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
          )}

          {/* Render guest messages */}
          {isGuest && guestMessages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {message.role === "assistant" && (
                <div className="shrink-0 mt-1">
                  <AnplexaLogo size={24} className="drop-shadow-[0_0_6px_rgba(123,44,191,0.4)]" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                  message.role === "user"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-muted border-l-[3px] border-l-primary text-foreground"
                }`}
              >
                <p className="text-sm sm:text-base text-pretty whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Render authenticated messages */}
          {!isGuest && displayMessages.map((message, messageIndex) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {message.role === "assistant" && (
                <div className="shrink-0 mt-1">
                  <AnplexaLogo size={24} className="drop-shadow-[0_0_6px_rgba(123,44,191,0.4)]" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                  message.role === "user"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-muted border-l-[3px] border-l-primary text-foreground"
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    const isLastMessage = messageIndex === displayMessages.length - 1
                    const isStreaming = status === "streaming" && isLastMessage && message.role === "assistant" && message.id !== "welcome-message"
                    return (
                      <p key={index} className="text-sm sm:text-base text-pretty whitespace-pre-wrap leading-relaxed">
                        {part.text}
                        {isStreaming && <span className="animate-pulse text-primary">▌</span>}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}

          {!isGuest && status === "streaming" && messages.length > 0 && messages[messages.length - 1].role === "assistant" && 
           messages[messages.length - 1].parts.every(p => p.type !== "text" || !p.text) && (
            <div className="flex justify-start gap-2">
              <div className="shrink-0 mt-1">
                <AnplexaLogo size={24} className="drop-shadow-[0_0_6px_rgba(123,44,191,0.4)] animate-pulse" />
              </div>
              <div className="max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl bg-muted border-l-[3px] border-l-primary px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card px-3 sm:px-4 py-3 sm:py-4 safe-bottom shrink-0 sticky bottom-0">
        <div className="mx-auto max-w-4xl space-y-2 sm:space-y-3">
          {!isGuest && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">Length:</span>
                <Select
                  value={preferences.length}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, length: value as ResponsePreference["length"] })
                  }
                >
                  <SelectTrigger className="h-9 sm:h-10 flex-1 sm:w-[160px] sm:flex-none border border-border bg-background rounded-lg focus:border-primary focus:ring-primary/30 text-xs sm:text-sm min-touch-target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(lengthDescriptions).map(([key, desc]) => (
                      <SelectItem key={key} value={key} className="text-xs sm:text-sm">
                        {desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">Style:</span>
                <Select
                  value={preferences.style}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, style: value as ResponsePreference["style"] })
                  }
                >
                  <SelectTrigger className="h-9 sm:h-10 flex-1 sm:w-[180px] sm:flex-none border border-border bg-background rounded-lg focus:border-primary focus:ring-primary/30 text-xs sm:text-sm min-touch-target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(styleDescriptions).map(([key, desc]) => (
                      <SelectItem key={key} value={key} className="text-xs sm:text-sm">
                        {desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {isGuest && guestMessageCount >= FREE_MESSAGE_LIMIT && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground bg-primary/10 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span>Sign up to continue chatting</span>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="gradient-primary glow-hover h-8 px-4 text-xs min-touch-target w-full sm:w-auto"
              >
                Sign Up Free
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hello, Anplexa..."
              disabled={isGuest && guestMessageCount >= FREE_MESSAGE_LIMIT}
              className="min-h-[48px] sm:min-h-[56px] resize-none border border-border bg-background rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] disabled:opacity-50 text-sm sm:text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            {!isGuest && status === "streaming" ? (
              <Button
                type="button"
                onClick={() => stop()}
                size="icon"
                variant="destructive"
                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg min-touch-target"
              >
                <Square className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || (!isGuest && status !== "ready" && status !== "error") || (isGuest && guestMessageCount >= FREE_MESSAGE_LIMIT)}
                size="icon"
                className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg gradient-primary glow-hover min-touch-target"
                title={isGuest ? `${FREE_MESSAGE_LIMIT - guestMessageCount} free messages left` : `Status: ${status}`}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </form>

          <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
            {isGuest 
              ? `${Math.max(0, FREE_MESSAGE_LIMIT - guestMessageCount)} free message${FREE_MESSAGE_LIMIT - guestMessageCount !== 1 ? 's' : ''} remaining • Sign up for unlimited`
              : "Press Enter to send • Shift+Enter for new line"
            }
          </p>
        </div>
      </div>

      {/* Auth Modal for Guests */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-lg p-0 bg-background border-border overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Sign in to Anplexa</DialogTitle>
            <DialogDescription>Create an account or sign in to continue chatting.</DialogDescription>
          </VisuallyHidden>
          <AuthForm onSuccess={() => setShowAuthModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal for Authenticated Users */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md bg-popover border-border p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-heading font-medium">
              <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Upgrade to PRO
            </DialogTitle>
            <DialogDescription className="text-sm">
              Unlock the full Anplexa experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">
                $4.99
                <span className="text-base sm:text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="text-sm sm:text-base">Unlimited messages</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="text-sm sm:text-base">Priority response times</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="text-sm sm:text-base">Access to all companion personalities</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="text-sm sm:text-base">Extended conversation memory</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                <span className="text-sm sm:text-base">Early access to new features</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowUpgradeModal(false)
                handleSubscribe()
              }}
              disabled={isSubscribing}
              className="w-full h-11 sm:h-12 text-base sm:text-lg gradient-primary glow-hover text-white rounded-lg min-touch-target"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {isSubscribing ? "Processing..." : "Subscribe Now"}
            </Button>

            <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
              Cancel anytime. Secure payment via Stripe.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
