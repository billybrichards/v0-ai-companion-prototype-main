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
import { Lock, Send, Square, Settings, MessageSquare, Palette, LogOut, Crown, Check, Sparkles } from "lucide-react"
import ThemeCustomizer from "@/components/theme-customizer"
import { useAuth } from "@/lib/auth-context"

type ResponsePreference = {
  length: "brief" | "moderate" | "detailed"
  style: "casual" | "thoughtful" | "creative"
}

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface ChatInterfaceProps {
  gender: GenderOption
  customGender?: string
  onOpenSettings: () => void
  onOpenFeedback: () => void
  onLogout?: () => void
  userName?: string
}

const STRIPE_PRICE_ID = "price_1RqRH7DaGKR8CULJkPTJhNBv"

export default function ChatInterface({ gender, customGender, onOpenSettings, onOpenFeedback, onLogout, userName }: ChatInterfaceProps) {
  const { accessToken, user, refreshSubscriptionStatus } = useAuth()
  const isSubscribed = user?.subscriptionStatus === "subscribed"
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Allow sending if ready OR if previous message errored
    if (!input.trim() || (status !== "ready" && status !== "error")) return

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

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-balance text-xl font-heading font-medium tracking-tight text-foreground">ANPLEXA</h1>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
              title="Theme"
            >
              <Palette className="h-4 w-4" />
            </Button>
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
          </div>
        </div>
        {showThemeCustomizer && <ThemeCustomizer />}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {showWelcome && messages.length === 0 && (
            <Card className="border border-border bg-card/50 p-8 shadow-[var(--shadow-card)]">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-balance text-2xl font-heading font-light text-foreground tracking-tight">Welcome to Anplexa</h2>
                  <span className="rounded-full bg-primary/20 border border-primary/50 px-3 py-1 text-xs font-medium text-primary">BETA</span>
                </div>
                <p className="text-pretty leading-relaxed text-muted-foreground text-lg">
                  Your private AI companion for meaningful adult conversations. Share your thoughts, explore ideas, or simply connect—in complete privacy.
                </p>
                <div className="flex items-center gap-3 rounded-lg border border-[var(--security)] bg-[var(--security)]/10 p-4">
                  <Lock className="h-5 w-5 text-[var(--security)]" />
                  <p className="text-pretty text-sm text-[var(--security)]">
                    End-to-End Encrypted • Private Session • Zero Tracking
                  </p>
                </div>
              </div>
            </Card>
          )}

          {messages.map((message) => (
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

          {status === "streaming" && messages.length > 0 && messages[messages.length - 1].role === "assistant" && 
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

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hello, Anplexa..."
              className="min-h-[56px] resize-none border border-border bg-background rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            {status === "streaming" ? (
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
                disabled={!input.trim() || (status !== "ready" && status !== "error")}
                size="icon"
                className="h-14 w-14 shrink-0 rounded-lg gradient-primary glow-hover"
                title={`Status: ${status}`}
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

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
