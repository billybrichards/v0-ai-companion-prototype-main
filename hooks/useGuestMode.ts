"use client"

import { useState, useCallback, useEffect } from 'react'

export interface GuestMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface UseGuestModeOptions {
  maxMessages?: number
  storageKey?: string
  onLimitReached?: () => void
}

export interface UseGuestModeReturn {
  messages: GuestMessage[]
  messageCount: number
  remainingMessages: number
  isLimitReached: boolean
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const DEFAULT_MAX_MESSAGES = 6
const STORAGE_KEY_MESSAGES = 'guest-chat-messages'
const STORAGE_KEY_COUNT = 'guest-message-count'

/**
 * useGuestMode Hook
 *
 * Manages chat state for unauthenticated guest users.
 * Features:
 * - LocalStorage persistence
 * - Message limit enforcement
 * - API ice-breaker integration
 */
export function useGuestMode(options: UseGuestModeOptions = {}): UseGuestModeReturn {
  const {
    maxMessages = DEFAULT_MAX_MESSAGES,
    storageKey = STORAGE_KEY_MESSAGES,
    onLimitReached,
  } = options

  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [messageCount, setMessageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const storedMessages = localStorage.getItem(storageKey)
      const storedCount = localStorage.getItem(STORAGE_KEY_COUNT)

      if (storedMessages) {
        const parsed = JSON.parse(storedMessages)
        if (Array.isArray(parsed)) {
          setMessages(parsed)
        }
      }

      if (storedCount) {
        setMessageCount(parseInt(storedCount, 10) || 0)
      }
    } catch (e) {
      console.error('Failed to load guest messages:', e)
    }
  }, [storageKey])

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (messages.length === 0) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages))
      localStorage.setItem(STORAGE_KEY_COUNT, messageCount.toString())
    } catch (e) {
      console.error('Failed to save guest messages:', e)
    }
  }, [messages, messageCount, storageKey])

  const remainingMessages = Math.max(0, maxMessages - messageCount)
  const isLimitReached = messageCount >= maxMessages

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    if (isLimitReached) {
      onLimitReached?.()
      return
    }

    const newCount = messageCount + 1
    setMessageCount(newCount)

    // Add user message
    const userMessage: GuestMessage = {
      id: `guest-user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    }
    setMessages(prev => [...prev, userMessage])

    // Check if limit just reached
    if (newCount >= maxMessages) {
      setTimeout(() => onLimitReached?.(), 1000)
    }

    // Fetch AI response
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            id: `init-${Date.now()}`,
            role: 'user',
            parts: [{ type: 'text', text: content.trim() }],
          }],
          preferences: { length: 'moderate' },
          newChat: messages.length === 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Parse SSE stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let fullText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'text-delta' && data.delta) {
                fullText += data.delta
              } else if (data.type === 'text' && data.content) {
                fullText += data.content
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      if (fullText) {
        const assistantMessage: GuestMessage = {
          id: `guest-assistant-${Date.now()}`,
          role: 'assistant',
          content: fullText,
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Guest chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [messageCount, maxMessages, messages.length, isLimitReached, onLimitReached])

  const clearMessages = useCallback(() => {
    setMessages([])
    setMessageCount(0)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
      localStorage.removeItem(STORAGE_KEY_COUNT)
    }
  }, [storageKey])

  return {
    messages,
    messageCount,
    remainingMessages,
    isLimitReached,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
