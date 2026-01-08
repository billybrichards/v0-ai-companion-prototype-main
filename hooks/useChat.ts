"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatRequest, ChatPreferences, MessageDTO, SSEEvent, PersonalityMode } from '@/lib/contracts'

export interface UseChatOptions {
  accessToken?: string | null
  onError?: (error: Error) => void
  onCreditExhausted?: (info: { message: string; resetsAt?: string }) => void
}

export interface UseChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export interface UseChatReturn {
  messages: UseChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  error: Error | null
  sendMessage: (content: string, options?: SendMessageOptions) => Promise<void>
  stopStreaming: () => void
  clearMessages: () => void
  setMessages: (messages: UseChatMessage[]) => void
}

export interface SendMessageOptions {
  conversationId?: string
  personalityMode?: PersonalityMode
  preferences?: ChatPreferences
  newChat?: boolean
}

/**
 * useChat Hook
 *
 * Manages chat state and streaming communication with the backend.
 * Handles SSE streaming, credit limits, and message persistence.
 *
 * Features:
 * - SSE streaming support
 * - Automatic reconnection
 * - Credit exhaustion handling
 * - Message history management
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { accessToken, onError, onCreditExhausted } = options

  const [messages, setMessages] = useState<UseChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const accessTokenRef = useRef(accessToken)

  // Keep token ref in sync
  useEffect(() => {
    accessTokenRef.current = accessToken
  }, [accessToken])

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
    setIsLoading(false)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const sendMessage = useCallback(async (
    content: string,
    sendOptions: SendMessageOptions = {}
  ) => {
    if (!content.trim()) return

    setError(null)
    setIsLoading(true)

    // Add user message immediately
    const userMessage: UseChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
    }

    setMessages(prev => [...prev, userMessage])

    // Prepare assistant message placeholder
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: UseChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsStreaming(true)

    // Create abort controller
    abortControllerRef.current = new AbortController()

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (accessTokenRef.current) {
        headers['Authorization'] = `Bearer ${accessTokenRef.current}`
      }

      const body: ChatRequest = {
        message: content.trim(),
        conversationId: sendOptions.conversationId,
        personalityMode: sendOptions.personalityMode,
        preferences: sendOptions.preferences,
        newChat: sendOptions.newChat,
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal,
      })

      // Handle credit exhaustion
      if (response.status === 402 || response.status === 403) {
        const data = await response.json()
        if (data.errorCode === 'CREDIT_LIMIT_REACHED') {
          onCreditExhausted?.({
            message: data.message,
            resetsAt: data.resetsAt,
          })
          // Remove the placeholder assistant message
          setMessages(prev => prev.filter(m => m.id !== assistantMessageId))
          return
        }
      }

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`)
      }

      // Parse SSE stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
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
              const event: SSEEvent = JSON.parse(line.slice(6))

              if (event.type === 'text') {
                setMessages(prev => prev.map(m =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content + event.content }
                    : m
                ))
              } else if (event.type === 'done') {
                setMessages(prev => prev.map(m =>
                  m.id === assistantMessageId
                    ? { ...m, isStreaming: false }
                    : m
                ))
              } else if (event.type === 'error') {
                throw new Error(event.error || 'Stream error')
              }
            } catch (parseError) {
              // Ignore parse errors for malformed events
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled - mark message as complete
        setMessages(prev => prev.map(m =>
          m.id === assistantMessageId
            ? { ...m, isStreaming: false }
            : m
        ))
      } else {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        onError?.(error)
        // Remove failed assistant message
        setMessages(prev => prev.filter(m => m.id !== assistantMessageId))
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [onError, onCreditExhausted])

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
    setMessages,
  }
}
