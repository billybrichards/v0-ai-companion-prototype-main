"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  type Conversation,
  type Message,
  getMostRecentConversation,
  saveMessages,
  createConversation,
  getCurrentConversationId,
  setCurrentConversationId,
  migrateLegacyMessages,
  loadConversation,
} from "./conversation-service"

export type { Message, Conversation }

interface UseConversationOptions {
  accessToken?: string | null
  userId?: string
  enabled?: boolean
}

interface UseConversationReturn {
  conversation: Conversation | null
  isLoading: boolean
  error: Error | null
  saveCurrentMessages: (messages: Message[]) => Promise<void>
  startNewConversation: () => Promise<Conversation>
  loadExistingConversation: (id: string) => Promise<void>
  initialMessages: Message[]
}

export function useConversation({
  accessToken,
  userId,
  enabled = true,
}: UseConversationOptions): UseConversationReturn {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [initialMessages, setInitialMessages] = useState<Message[]>([])
  const hasLoaded = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load the most recent conversation or create a new one
  useEffect(() => {
    if (!enabled || hasLoaded.current) return

    const loadOrCreateConversation = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // First, try to migrate any legacy messages
        if (accessToken) {
          const migrated = await migrateLegacyMessages(accessToken, userId)
          if (migrated) {
            console.log("[useConversation] Migrated legacy messages to conversation:", migrated.id)
            setConversation(migrated)
            setInitialMessages(migrated.messages)
            setCurrentConversationId(migrated.id, userId)
            hasLoaded.current = true
            setIsLoading(false)
            return
          }
        }

        // Check for existing current conversation ID
        const currentId = getCurrentConversationId(userId)
        if (currentId && accessToken) {
          const existing = await loadConversation(currentId, accessToken, userId)
          if (existing && existing.messages.length > 0) {
            console.log("[useConversation] Loaded existing conversation:", currentId)
            setConversation(existing)
            setInitialMessages(existing.messages)
            hasLoaded.current = true
            setIsLoading(false)
            return
          }
        }

        // Try to get the most recent conversation
        if (accessToken) {
          const recent = await getMostRecentConversation(accessToken, userId)
          if (recent && recent.messages.length > 0) {
            console.log("[useConversation] Loaded most recent conversation:", recent.id)
            setConversation(recent)
            setInitialMessages(recent.messages)
            setCurrentConversationId(recent.id, userId)
            hasLoaded.current = true
            setIsLoading(false)
            return
          }
        }

        // No existing conversation, we'll create one when the first message is sent
        console.log("[useConversation] No existing conversation found")
        setConversation(null)
        setInitialMessages([])
      } catch (err) {
        console.error("[useConversation] Load error:", err)
        setError(err instanceof Error ? err : new Error("Failed to load conversation"))
      } finally {
        hasLoaded.current = true
        setIsLoading(false)
      }
    }

    loadOrCreateConversation()
  }, [accessToken, userId, enabled])

  // Save messages with debouncing
  const saveCurrentMessages = useCallback(async (messages: Message[]) => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Debounce saves to avoid too many requests
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        let conversationId = conversation?.id

        // If no conversation exists yet, create one
        if (!conversationId && accessToken && messages.length > 0) {
          const newConversation = await createConversation(accessToken, userId)
          conversationId = newConversation.id
          setConversation(newConversation)
          console.log("[useConversation] Created new conversation:", conversationId)
        }

        if (conversationId) {
          await saveMessages(conversationId, messages, accessToken || undefined, userId)
          console.log("[useConversation] Saved messages to conversation:", conversationId)
        }
      } catch (err) {
        console.error("[useConversation] Save error:", err)
      }
    }, 1000) // 1 second debounce
  }, [conversation?.id, accessToken, userId])

  // Start a new conversation
  const startNewConversation = useCallback(async () => {
    try {
      if (!accessToken) {
        // For guests, just reset local state
        const newConv: Conversation = {
          id: `local-${Date.now()}`,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isLocal: true,
        }
        setConversation(newConv)
        setInitialMessages([])
        return newConv
      }

      const newConversation = await createConversation(accessToken, userId)
      setConversation(newConversation)
      setInitialMessages([])
      console.log("[useConversation] Started new conversation:", newConversation.id)
      return newConversation
    } catch (err) {
      console.error("[useConversation] Start new conversation error:", err)
      throw err
    }
  }, [accessToken, userId])

  // Load a specific conversation
  const loadExistingConversation = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const loaded = await loadConversation(id, accessToken || undefined, userId)
      if (loaded) {
        setConversation(loaded)
        setInitialMessages(loaded.messages)
        setCurrentConversationId(id, userId)
        console.log("[useConversation] Loaded conversation:", id)
      }
    } catch (err) {
      console.error("[useConversation] Load conversation error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, userId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    conversation,
    isLoading,
    error,
    saveCurrentMessages,
    startNewConversation,
    loadExistingConversation,
    initialMessages,
  }
}
