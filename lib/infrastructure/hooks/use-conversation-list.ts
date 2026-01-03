"use client"

import { useMemo } from "react"
import { useConversationContext } from "@/lib/infrastructure/providers/conversation-provider"
import {
  type ConversationSummary,
  groupConversationsByDate,
} from "@/lib/domain/entities/conversation"

interface UseConversationListReturn {
  conversations: ConversationSummary[]
  groupedConversations: {
    today: ConversationSummary[]
    yesterday: ConversationSummary[]
    thisWeek: ConversationSummary[]
    older: ConversationSummary[]
  }
  activeConversationId: string | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  switchTo: (id: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  startNew: () => Promise<void>
}

export function useConversationList(): UseConversationListReturn {
  const {
    conversations,
    activeConversation,
    isLoading,
    error,
    loadConversations,
    switchConversation,
    deleteConversation,
    startNewConversation,
  } = useConversationContext()

  const groupedConversations = useMemo(
    () => groupConversationsByDate(conversations),
    [conversations]
  )

  return {
    conversations,
    groupedConversations,
    activeConversationId: activeConversation?.id || null,
    isLoading,
    error,
    refresh: loadConversations,
    switchTo: switchConversation,
    deleteConversation,
    startNew: async () => {
      await startNewConversation()
    },
  }
}
