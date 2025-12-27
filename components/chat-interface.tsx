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
import { Lock, Send, Square, Settings, MessageSquare, Palette, LogOut, Crown, Check, Sparkles, User } from "lucide-react"
import ThemeCustomizer from "@/components/theme-customizer"
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
  userName?: string
  isGuest?: boolean
}

const STRIPE_PRICE_ID = "price_1RqRH7DaGKR8CULJkPTJhNBv"
const FREE_MESSAGE_LIMIT = 2

const guestResponses = [
  "I'm so glad you reached out! I'd love to continue our conversation, but first let me learn a bit more about you. What's been on your mind lately?",
  "That's really interesting! I appreciate you sharing that with me. I'm here to listen and connect with you on a deeper level. Tell me more about what brings you here today.",
]

export default function ChatInterface({ gender, customGender, onOpenSettings, onOpenFeedback, onLogout, userName, isGuest = false }: ChatInterfaceProps) {
  const { accessToken, user, refreshSubscriptionStatus } = useAuth()
  const isSubscribed = user?.subscriptionStatus === "subscribed"
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([])
  const [guestMessageCount, setGuestMessageCount] = useState(0)

  // Load guest messages from localStorage
  useEffect(() => {
    if (isGuest) {
      const stored = localStorage.getItem("guest-chat-messages")
      const storedCount = localStorage.getItem("guest-message-count")
      if (stored) {
        try {
          setGuestMessages(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse guest messages", e)
        }
      }
      if (storedCount) {
        setGuestMessageCount(parseInt(storedCount, 10))
      }
    }
  }, [isGuest])

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
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          preferences: preferencesRef.current,
          gender: genderRef.current,
          customGender: customGenderRef.current,
        },
      }),
    })
  }, [])

  const { messages, sendMessage, status, stop, error } = useChat({
    transport,
  })

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
          priceId: STRIPE_PRICE_ID,
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

  // Combine messages for display
  const displayMessages = isGuest ? guestMessages : messages

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <AnplexaLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-balance text-xl font-heading font-light tracking-wide text-foreground lowercase">anplexa</h1>
                <span className="rounded-full bg-primary/20 border border-primary/50 px-2 py-0.5 text-xs font-medium text-primary">BETA</span>
                {isSubscribed && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/20 border border-primary/50 px-2 py-0.5 text-xs font-medium text-primary glow">
                    <Crown className="h-3 w-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-pretty text-sm text-muted-foreground">
                The Private Pulse • {getPronounText()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGuest ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="h-8 gap-1 text-xs border-primary/50 text-primary hover:bg-primary/10 glow-hover"
              >
                <User className="h-3 w-3" />
                Sign In
              </Button>
            ) : (
              <>
                {userName && (
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {userName}
                  </span>
                )}
                {!isSubscribed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUpgradeModal(true)}
                    className="h-8 gap-1 text-xs border-primary/50 text-primary hover:bg-primary/10 glow-hover"
                    title="Upgrade to Pro"
                  >
                    <Crown className="h-3 w-3" />
                    Upgrade
                  </Button>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
              title="Theme"
            >
              <Palette className="h-4 w-4" />
            </Button>
            {!isGuest && (
              <>
                <Button variant="ghost" size="icon" onClick={onOpenFeedback} className="h-9 w-9 hover:bg-primary/10 hover:text-primary" title="Feedback">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-9 w-9 hover:bg-primary/10 hover:text-primary" title="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
                {onLogout && (
                  <Button variant="ghost" size="icon" onClick={onLogout} className="h-9 w-9 hover:bg-primary/10 hover:text-primary" title="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {showThemeCustomizer && <ThemeCustomizer />}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {showWelcome && displayMessages.length === 0 && (
            <Card className="border border-border bg-card/50 p-8 rounded-2xl shadow-[var(--shadow-card)]">
              <div className="space-y-6">
                <p className="text-pretty leading-relaxed text-muted-foreground border-l-[3px] border-l-primary pl-4">
                  Welcome to anplexa, your private, judgment-free space for meaningful conversation. Our AI companion is here to listen, connect, and engage with you authentically.
                </p>
                {isGuest && (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <p className="text-pretty text-sm text-muted-foreground">
                      Try {FREE_MESSAGE_LIMIT} free messages! Sign up to continue the conversation.
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-lg border border-[var(--security)] bg-[var(--security)]/10 p-4">
                  <Lock className="h-5 w-5 text-[var(--security)]" />
                  <p className="text-pretty text-sm text-[var(--security)]">
                    End-to-End Encrypted • Private Session • Zero Tracking
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Render guest messages */}
          {isGuest && guestMessages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-muted border-l-[3px] border-l-primary text-foreground"
                }`}
              >
                <p className="text-pretty whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Render authenticated messages */}
          {!isGuest && messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-muted border-l-[3px] border-l-primary text-foreground"
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    const isLastMessage = messages.indexOf(message) === messages.length - 1
                    const isStreaming = status === "streaming" && isLastMessage && message.role === "assistant"
                    return (
                      <p key={index} className="text-pretty whitespace-pre-wrap leading-relaxed">
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
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-xl bg-muted border-l-[3px] border-l-primary px-4 py-3">
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

      <div className="border-t border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl space-y-3">
          {!isGuest && (
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Length:</span>
                <Select
                  value={preferences.length}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, length: value as ResponsePreference["length"] })
                  }
                >
                  <SelectTrigger className="h-9 w-[160px] border border-border bg-background rounded-lg focus:border-primary focus:ring-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(lengthDescriptions).map(([key, desc]) => (
                      <SelectItem key={key} value={key}>
                        {desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Style:</span>
                <Select
                  value={preferences.style}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, style: value as ResponsePreference["style"] })
                  }
                >
                  <SelectTrigger className="h-9 w-[180px] border border-border bg-background rounded-lg focus:border-primary focus:ring-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(styleDescriptions).map(([key, desc]) => (
                      <SelectItem key={key} value={key}>
                        {desc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {isGuest && guestMessageCount >= FREE_MESSAGE_LIMIT && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-primary/10 rounded-lg p-3">
              <Lock className="h-4 w-4 text-primary" />
              <span>Sign up to continue chatting with Anplexa</span>
              <Button
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="ml-2 gradient-primary glow-hover h-7 px-3 text-xs"
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
              className="min-h-[56px] resize-none border border-border bg-background rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] disabled:opacity-50"
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
                className="h-14 w-14 shrink-0 rounded-lg"
              >
                <Square className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || (!isGuest && status !== "ready" && status !== "error") || (isGuest && guestMessageCount >= FREE_MESSAGE_LIMIT)}
                size="icon"
                className="h-14 w-14 shrink-0 rounded-lg gradient-primary glow-hover"
                title={isGuest ? `${FREE_MESSAGE_LIMIT - guestMessageCount} free messages left` : `Status: ${status}`}
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </form>

          <p className="text-center text-xs text-muted-foreground">
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
          <AuthForm />
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal for Authenticated Users */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-heading font-medium">
              <Crown className="h-6 w-6 text-primary" />
              Upgrade to PRO
            </DialogTitle>
            <DialogDescription>
              Unlock the full Anplexa experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">
                $4.99
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span>Unlimited messages</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span>Priority response times</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span>Access to all companion personalities</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span>Extended conversation memory</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span>Early access to new features</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowUpgradeModal(false)
                handleSubscribe()
              }}
              disabled={isSubscribing}
              className="w-full h-12 text-lg gradient-primary glow-hover text-white rounded-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {isSubscribing ? "Processing..." : "Subscribe Now"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Cancel anytime. Secure payment via Stripe.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
