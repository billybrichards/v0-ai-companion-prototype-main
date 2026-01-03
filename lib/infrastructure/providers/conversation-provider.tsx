"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { storage, STORAGE_KEYS } from "@/lib/adapters/storage/storage-service"
import {
  type Conversation,
  type ConversationSummary,
  normalizeConversation,
  toConversationSummary,
  createNewConversation,
  sortConversationsByDate,
} from "@/lib/domain/entities/conversation"
import { type Message, normalizeMessages } from "@/lib/domain/entities/message"

interface ConversationContextValue {
  // State
  activeConversation: Conversation | null
  conversations: ConversationSummary[]
  isLoading: boolean
  error: string | null

  // Actions
  loadConversations: () => Promise<void>
  switchConversation: (id: string) => Promise<void>
  startNewConversation: () => Promise<Conversation>
  deleteConversation: (id: string) => Promise<void>
  saveMessages: (messages: Message[]) => Promise<void>
  updateConversationTitle: (id: string, title: string) => Promise<void>
}

const ConversationContext = createContext<ConversationContextValue | null>(null)

export function useConversationContext(): ConversationContextValue {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversationContext must be used within a ConversationProvider")
  }
  return context
}

interface ConversationProviderProps {
  children: React.ReactNode
}

export function ConversationProvider({ children }: ConversationProviderProps) {
  const { accessToken, user, isAuthenticated } = useAuth()
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasInitialized = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load conversations from backend
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setConversations([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/conversations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to load conversations")
      }

      const data = await response.json()
      const convList = Array.isArray(data) ? data : data.conversations || []

      const normalized = convList.map((c: unknown) =>
        normalizeConversation(c as Record<string, unknown>)
      )
      const sorted = sortConversationsByDate(normalized)
      const summaries = sorted.map(toConversationSummary)

      setConversations(summaries)

      // If no active conversation, load the most recent one
      if (!activeConversation && sorted.length > 0) {
        await loadFullConversation(sorted[0].id)
      }
    } catch (err) {
      console.error("[ConversationProvider] Load error:", err)
      setError(err instanceof Error ? err.message : "Failed to load conversations")

      // Try loading from localStorage as fallback
      const localConvs = storage.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, {
        userId: user?.id,
      })
      if (localConvs && localConvs.length > 0) {
        const sorted = sortConversationsByDate(localConvs)
        setConversations(sorted.map(toConversationSummary))
        if (!activeConversation) {
          setActiveConversation(sorted[0])
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, accessToken, user?.id, activeConversation])

  // Load a full conversation by ID
  const loadFullConversation = useCallback(
    async (id: string): Promise<Conversation | null> => {
      if (!accessToken) return null

      try {
        const response = await fetch(`/api/conversations/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to load conversation")
        }

        const data = await response.json()
        const conversation = normalizeConversation(data)
        setActiveConversation(conversation)

        // Update current conversation ID in storage
        storage.set(STORAGE_KEYS.CURRENT_CONVERSATION, id, { userId: user?.id })

        // Also save to legacy format for backward compatibility
        if (conversation.messages.length > 0) {
          localStorage.setItem("chat-messages", JSON.stringify(conversation.messages))
        }

        return conversation
      } catch (err) {
        console.error("[ConversationProvider] Load conversation error:", err)
        return null
      }
    },
    [accessToken, user?.id]
  )

  // Switch to a different conversation
  const switchConversation = useCallback(
    async (id: string) => {
      setIsLoading(true)
      await loadFullConversation(id)
      setIsLoading(false)
    },
    [loadFullConversation]
  )

  // Start a new conversation
  const startNewConversation = useCallback(async (): Promise<Conversation> => {
    if (!accessToken) {
      const newConv = createNewConversation()
      setActiveConversation(newConv)
      return newConv
    }

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Conversation",
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create conversation")
      }

      const data = await response.json()
      const newConv = normalizeConversation(data)
      setActiveConversation(newConv)

      // Update conversations list
      setConversations((prev) => [toConversationSummary(newConv), ...prev])

      // Update storage
      storage.set(STORAGE_KEYS.CURRENT_CONVERSATION, newConv.id, { userId: user?.id })
      localStorage.removeItem("chat-messages")

      return newConv
    } catch (err) {
      console.error("[ConversationProvider] Create error:", err)
      const newConv = createNewConversation()
      setActiveConversation(newConv)
      return newConv
    }
  }, [accessToken, user?.id])

  // Delete a conversation
  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        if (accessToken) {
          await fetch(`/api/conversations/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        }

        // Remove from state
        setConversations((prev) => prev.filter((c) => c.id !== id))

        // If this was the active conversation, switch to another or create new
        if (activeConversation?.id === id) {
          const remaining = conversations.filter((c) => c.id !== id)
          if (remaining.length > 0) {
            await switchConversation(remaining[0].id)
          } else {
            await startNewConversation()
          }
        }
      } catch (err) {
        console.error("[ConversationProvider] Delete error:", err)
      }
    },
    [accessToken, activeConversation?.id, conversations, switchConversation, startNewConversation]
  )

  // Save messages to current conversation (debounced)
  const saveMessages = useCallback(
    async (messages: Message[]) => {
      // Clear pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Update local state immediately
      if (activeConversation) {
        setActiveConversation((prev) =>
          prev ? { ...prev, messages, updatedAt: new Date().toISOString() } : prev
        )
      }

      // Also update legacy localStorage for backward compatibility
      localStorage.setItem("chat-messages", JSON.stringify(messages))

      // Debounced save to backend
      saveTimeoutRef.current = setTimeout(async () => {
        if (!accessToken || !activeConversation) return

        try {
          await fetch(`/api/conversations/${activeConversation.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages,
              updatedAt: new Date().toISOString(),
            }),
          })
        } catch (err) {
          console.error("[ConversationProvider] Save error:", err)
        }
      }, 1000)
    },
    [accessToken, activeConversation]
  )

  // Update conversation title
  const updateConversationTitle = useCallback(
    async (id: string, title: string) => {
      try {
        if (accessToken) {
          await fetch(`/api/conversations/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
          })
        }

        // Update local state
        if (activeConversation?.id === id) {
          setActiveConversation((prev) => (prev ? { ...prev, title } : prev))
        }
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title } : c))
        )
      } catch (err) {
        console.error("[ConversationProvider] Update title error:", err)
      }
    },
    [accessToken, activeConversation?.id]
  )

  // Initialize on mount
  useEffect(() => {
    if (hasInitialized.current) return
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    hasInitialized.current = true
    loadConversations()
  }, [isAuthenticated, loadConversations])

  // Reload when user changes
  useEffect(() => {
    if (user?.id && hasInitialized.current) {
      loadConversations()
    }
  }, [user?.id, loadConversations])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const value: ConversationContextValue = {
    activeConversation,
    conversations,
    isLoading,
    error,
    loadConversations,
    switchConversation,
    startNewConversation,
    deleteConversation,
    saveMessages,
    updateConversationTitle,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
