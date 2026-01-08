"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Square } from "lucide-react"

interface MessageInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isLoading?: boolean
  isStreaming?: boolean
  disabled?: boolean
  placeholder?: string
  remainingMessages?: number
}

/**
 * MessageInput Component
 *
 * Chat input with send/stop functionality.
 * Handles Enter to send, Shift+Enter for new line.
 */
export function MessageInput({
  onSend,
  onStop,
  isLoading = false,
  isStreaming = false,
  disabled = false,
  placeholder = "Hello, Anplexa...",
  remainingMessages,
}: MessageInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled || (isLoading && !isStreaming)) return

    onSend(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  const canSend = input.trim() && !disabled && !isLoading

  return (
    <div className="border-t border-border bg-card px-3 sm:px-4 py-2 sm:py-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0">
      <div className="mx-auto max-w-4xl space-y-2 sm:space-y-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] sm:min-h-[56px] max-h-[120px] resize-none border border-border bg-background rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] disabled:opacity-50 text-sm sm:text-base py-2.5 px-3"
            onKeyDown={handleKeyDown}
          />

          {isStreaming && onStop ? (
            <Button
              type="button"
              onClick={onStop}
              size="icon"
              variant="destructive"
              className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-lg min-touch-target"
            >
              <Square className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canSend}
              size="icon"
              className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-lg gradient-primary glow-hover min-touch-target"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </form>

        <p className="hidden sm:block text-center text-[10px] sm:text-xs text-muted-foreground">
          {remainingMessages !== undefined
            ? `${remainingMessages} free message${remainingMessages !== 1 ? "s" : ""} remaining • Sign up for unlimited`
            : "Press Enter to send • Shift+Enter for new line"}
        </p>
      </div>
    </div>
  )
}
