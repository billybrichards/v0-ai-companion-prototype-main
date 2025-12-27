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

  const { messages, sendMessage, status, stop } = useChat({
    transport,
  })

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
    if (!input.trim() || status !== "ready") return

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
    if (!accessToken || !user) return
    
    setIsSubscribing(true)
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

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b-2 border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-balance text-xl font-bold text-foreground">TERMINAL COMPANION</h1>
                <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">BETA</span>
                {isSubscribed && (
                  <span className="flex items-center gap-1 rounded bg-yellow-500/20 border border-yellow-500/50 px-2 py-0.5 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    <Crown className="h-3 w-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-pretty text-sm text-muted-foreground font-mono">
                v0.1.0 • {getPronounText()} • Private Session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userName && (
              <span className="text-sm text-muted-foreground font-mono hidden sm:inline">
                {userName}
              </span>
            )}
            {!isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="h-8 gap-1 text-xs border-yellow-500/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10"
                title="Upgrade to Pro"
              >
                <Crown className="h-3 w-3" />
                {isSubscribing ? "..." : "Upgrade"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeCustomizer(!showThemeCustomizer)}
              className="h-9 w-9"
              title="Theme"
            >
              <Palette className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onOpenFeedback} className="h-9 w-9" title="Feedback">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-9 w-9" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            {onLogout && (
              <Button variant="ghost" size="icon" onClick={onLogout} className="h-9 w-9" title="Logout">
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
            <Card className="border-2 border-border bg-muted/30 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-balance text-2xl font-bold text-foreground">WELCOME TO TERMINAL COMPANION</h2>
                  <span className="rounded bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">BETA</span>
                </div>
                <p className="text-pretty leading-relaxed text-foreground font-mono">
                  &gt; Establishing secure connection...
                  <br />
                  &gt; Initializing AI companion interface...
                  <br />
                  &gt; Ready for input.
                </p>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  This is your private, judgment-free terminal for meaningful conversation. Share your thoughts, explore
                  ideas, or simply chat—everything stays local.
                </p>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <p className="text-pretty text-sm text-muted-foreground font-mono">
                    [SECURE] All data stored locally • No external sync • Zero tracking
                  </p>
                </div>
              </div>
            </Card>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg border-2 px-4 py-3 ${
                  message.role === "user"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground"
                }`}
              >
                <div className="mb-1 text-xs font-bold text-muted-foreground">
                  {message.role === "user" ? "[USER]" : "[AI]"}
                </div>
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p key={index} className="text-pretty whitespace-pre-wrap leading-relaxed font-mono">
                        {part.text}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          ))}

          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg border-2 border-border bg-card px-4 py-3">
                <div className="mb-1 text-xs font-bold text-muted-foreground">[AI]</div>
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

      <div className="border-t-2 border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground">LENGTH:</span>
              <Select
                value={preferences.length}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, length: value as ResponsePreference["length"] })
                }
              >
                <SelectTrigger className="h-9 w-[160px] border-2 border-border bg-background font-mono">
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
              <span className="text-sm font-bold text-muted-foreground">STYLE:</span>
              <Select
                value={preferences.style}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, style: value as ResponsePreference["style"] })
                }
              >
                <SelectTrigger className="h-9 w-[180px] border-2 border-border bg-background font-mono">
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
              placeholder="> Enter message..."
              className="min-h-[56px] resize-none border-2 border-border bg-background font-mono"
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
                className="h-14 w-14 shrink-0"
              >
                <Square className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || status !== "ready"}
                size="icon"
                className="h-14 w-14 shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </form>

          <p className="text-center text-xs text-muted-foreground font-mono">
            [ENTER] to send • [SHIFT+ENTER] for new line
          </p>
        </div>
      </div>
    </div>
  )
}
