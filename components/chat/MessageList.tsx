"use client"

import { useRef, useEffect } from "react"
import AnplexaLogo from "@/components/anplexa-logo"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
  showTypingIndicator?: boolean
}

/**
 * MessageList Component
 *
 * Renders a scrollable list of chat messages with auto-scroll.
 * Handles both user and assistant messages with proper styling.
 */
export function MessageList({
  messages,
  isLoading = false,
  showTypingIndicator = false,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 py-3 sm:py-6">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {showTypingIndicator && (
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
  )
}

/**
 * Individual message bubble component
 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="shrink-0 mt-1">
          <AnplexaLogo size={24} className="drop-shadow-[0_0_6px_rgba(123,44,191,0.4)]" />
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
          isUser
            ? "bg-secondary text-muted-foreground"
            : "bg-muted border-l-[3px] border-l-primary text-foreground"
        }`}
      >
        <p className="text-sm sm:text-base text-pretty whitespace-pre-wrap leading-relaxed">
          {message.content}
          {message.isStreaming && (
            <span className="animate-pulse text-primary">▌</span>
          )}
        </p>
      </div>
    </div>
  )
}
