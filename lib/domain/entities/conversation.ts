/**
 * Conversation entity - Represents a chat conversation
 */

import { type Message, normalizeMessages, generateTitleFromMessages } from "./message"

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  isLocal?: boolean
}

export interface ConversationSummary {
  id: string
  title: string
  preview: string
  messageCount: number
  createdAt: string
  updatedAt: string
}

// Backend conversation format
export interface BackendConversation {
  id?: string
  _id?: string
  title?: string
  messages?: unknown[]
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
}

/**
 * Normalize a backend conversation to our standard format
 */
export function normalizeConversation(conv: BackendConversation): Conversation {
  const id = conv.id || conv._id || `conv-${Date.now()}`
  const messages = conv.messages ? normalizeMessages(conv.messages) : []
  const createdAt = conv.createdAt || conv.created_at || new Date().toISOString()
  const updatedAt = conv.updatedAt || conv.updated_at || createdAt

  return {
    id,
    title: conv.title || generateTitleFromMessages(messages),
    messages,
    createdAt,
    updatedAt,
    isLocal: false,
  }
}

/**
 * Create a conversation summary for the dropdown
 */
export function toConversationSummary(conv: Conversation): ConversationSummary {
  const lastMessage = conv.messages[conv.messages.length - 1]
  const preview = lastMessage?.content.slice(0, 100) || "No messages yet"

  return {
    id: conv.id,
    title: conv.title || generateTitleFromMessages(conv.messages),
    preview: preview.length < 100 ? preview : preview + "...",
    messageCount: conv.messages.length,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  }
}

/**
 * Create a new empty conversation
 */
export function createNewConversation(id?: string): Conversation {
  const now = new Date().toISOString()
  return {
    id: id || `local-${Date.now()}`,
    title: "New Conversation",
    messages: [],
    createdAt: now,
    updatedAt: now,
    isLocal: true,
  }
}

/**
 * Sort conversations by updatedAt (most recent first)
 */
export function sortConversationsByDate(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

/**
 * Group conversations by relative date for UI display
 */
export function groupConversationsByDate(conversations: ConversationSummary[]): {
  today: ConversationSummary[]
  yesterday: ConversationSummary[]
  thisWeek: ConversationSummary[]
  older: ConversationSummary[]
} {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

  const groups = {
    today: [] as ConversationSummary[],
    yesterday: [] as ConversationSummary[],
    thisWeek: [] as ConversationSummary[],
    older: [] as ConversationSummary[],
  }

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt)
    if (date >= todayStart) {
      groups.today.push(conv)
    } else if (date >= yesterdayStart) {
      groups.yesterday.push(conv)
    } else if (date >= weekStart) {
      groups.thisWeek.push(conv)
    } else {
      groups.older.push(conv)
    }
  }

  return groups
}
