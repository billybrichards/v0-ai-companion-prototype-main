// Conversation persistence service
// Handles saving/loading conversations to backend with localStorage fallback

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  parts?: Array<{ type: string; text?: string }>
  createdAt?: string
}

export interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
  isLocal?: boolean
}

const STORAGE_KEY_PREFIX = "anplexa-conversation"
const CURRENT_CONVERSATION_KEY = "anplexa-current-conversation"

// Helper to normalize message format
function normalizeMessage(msg: Message | { id: string; role: string; parts?: Array<{ type: string; text?: string }> }): Message {
  if ('content' in msg && msg.content) {
    return msg as Message
  }
  // Convert from AI SDK format (parts) to simple content format
  const textParts = (msg.parts || []).filter(p => p.type === "text" && p.text)
  const content = textParts.map(p => p.text).join("")
  return {
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content,
    parts: msg.parts,
    createdAt: new Date().toISOString()
  }
}

// Get storage key for user-specific data
function getStorageKey(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY_PREFIX}-${userId}`
  }
  return `${STORAGE_KEY_PREFIX}-guest`
}

// Fetch all conversations for the current user
export async function fetchConversations(accessToken: string): Promise<Conversation[]> {
  try {
    const response = await fetch("/api/conversations", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.log("[ConversationService] Backend unavailable, using local storage")
      return getLocalConversations()
    }

    const data = await response.json()

    // If backend returned empty or no conversations, check local storage
    if (!data.conversations || data.conversations.length === 0) {
      return getLocalConversations()
    }

    return data.conversations
  } catch (error) {
    console.error("[ConversationService] Fetch error:", error)
    return getLocalConversations()
  }
}

// Get conversations from local storage
function getLocalConversations(userId?: string): Conversation[] {
  if (typeof window === "undefined") return []

  try {
    const key = getStorageKey(userId)
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }

    // Also check legacy storage format
    const legacyMessages = localStorage.getItem("chat-messages")
    if (legacyMessages) {
      const messages = JSON.parse(legacyMessages)
      if (messages.length > 0) {
        return [{
          id: "legacy-conversation",
          messages: messages.map(normalizeMessage),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isLocal: true
        }]
      }
    }
  } catch (error) {
    console.error("[ConversationService] Local storage read error:", error)
  }

  return []
}

// Save conversations to local storage
function saveLocalConversations(conversations: Conversation[], userId?: string): void {
  if (typeof window === "undefined") return

  try {
    const key = getStorageKey(userId)
    localStorage.setItem(key, JSON.stringify(conversations))
  } catch (error) {
    console.error("[ConversationService] Local storage write error:", error)
  }
}

// Get the most recent conversation (for loading on login)
export async function getMostRecentConversation(accessToken: string, userId?: string): Promise<Conversation | null> {
  try {
    const conversations = await fetchConversations(accessToken)

    if (conversations.length === 0) {
      // Check legacy local storage
      const legacyMessages = localStorage.getItem("chat-messages")
      if (legacyMessages) {
        try {
          const messages = JSON.parse(legacyMessages)
          if (messages.length > 0) {
            return {
              id: `migrated-${Date.now()}`,
              messages: messages.map(normalizeMessage),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isLocal: true
            }
          }
        } catch {
          // Ignore parse errors
        }
      }
      return null
    }

    // Sort by updatedAt and return most recent
    const sorted = [...conversations].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    return sorted[0]
  } catch (error) {
    console.error("[ConversationService] Get recent error:", error)

    // Fallback to local storage
    const localConversations = getLocalConversations(userId)
    if (localConversations.length > 0) {
      return localConversations.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0]
    }

    return null
  }
}

// Get current conversation ID from storage
export function getCurrentConversationId(userId?: string): string | null {
  if (typeof window === "undefined") return null

  const key = userId ? `${CURRENT_CONVERSATION_KEY}-${userId}` : CURRENT_CONVERSATION_KEY
  return localStorage.getItem(key)
}

// Set current conversation ID
export function setCurrentConversationId(conversationId: string, userId?: string): void {
  if (typeof window === "undefined") return

  const key = userId ? `${CURRENT_CONVERSATION_KEY}-${userId}` : CURRENT_CONVERSATION_KEY
  localStorage.setItem(key, conversationId)
}

// Create a new conversation
export async function createConversation(accessToken: string, userId?: string): Promise<Conversation> {
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

    const data = await response.json()

    if (data.isLocal || !response.ok) {
      // Backend unavailable, create locally
      const conversation: Conversation = {
        id: `local-${Date.now()}`,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLocal: true
      }

      const conversations = getLocalConversations(userId)
      conversations.unshift(conversation)
      saveLocalConversations(conversations, userId)
      setCurrentConversationId(conversation.id, userId)

      return conversation
    }

    setCurrentConversationId(data.id, userId)
    return data
  } catch (error) {
    console.error("[ConversationService] Create error:", error)

    // Fallback to local
    const conversation: Conversation = {
      id: `local-${Date.now()}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocal: true
    }

    const conversations = getLocalConversations(userId)
    conversations.unshift(conversation)
    saveLocalConversations(conversations, userId)
    setCurrentConversationId(conversation.id, userId)

    return conversation
  }
}

// Save messages to a conversation
export async function saveMessages(
  conversationId: string,
  messages: Message[],
  accessToken?: string,
  userId?: string
): Promise<void> {
  const normalizedMessages = messages.map(normalizeMessage)

  // Always save to local storage first (fast, reliable)
  const conversations = getLocalConversations(userId)
  const existingIndex = conversations.findIndex(c => c.id === conversationId)

  const updatedConversation: Conversation = {
    id: conversationId,
    messages: normalizedMessages,
    createdAt: existingIndex >= 0 ? conversations[existingIndex].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLocal: true
  }

  if (existingIndex >= 0) {
    conversations[existingIndex] = updatedConversation
  } else {
    conversations.unshift(updatedConversation)
  }

  saveLocalConversations(conversations, userId)

  // Also update legacy format for compatibility
  if (typeof window !== "undefined") {
    localStorage.setItem("chat-messages", JSON.stringify(messages))
  }

  // If authenticated, try to sync to backend
  if (accessToken) {
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: normalizedMessages,
          updatedAt: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.log("[ConversationService] Backend sync failed, data saved locally:", error)
    }
  }
}

// Load a specific conversation
export async function loadConversation(
  conversationId: string,
  accessToken?: string,
  userId?: string
): Promise<Conversation | null> {
  // First check local storage
  const conversations = getLocalConversations(userId)
  const local = conversations.find(c => c.id === conversationId)

  if (!accessToken) {
    return local || null
  }

  // Try backend
  try {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.log("[ConversationService] Backend load failed, using local:", error)
  }

  return local || null
}

// Delete a conversation
export async function deleteConversation(
  conversationId: string,
  accessToken?: string,
  userId?: string
): Promise<void> {
  // Remove from local storage
  const conversations = getLocalConversations(userId)
  const filtered = conversations.filter(c => c.id !== conversationId)
  saveLocalConversations(filtered, userId)

  // Clear legacy storage if this was the current conversation
  const currentId = getCurrentConversationId(userId)
  if (currentId === conversationId) {
    localStorage.removeItem("chat-messages")
  }

  // Try to delete from backend
  if (accessToken) {
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.log("[ConversationService] Backend delete failed:", error)
    }
  }
}

// Migrate legacy localStorage messages to conversation format
export async function migrateLegacyMessages(
  accessToken?: string,
  userId?: string
): Promise<Conversation | null> {
  if (typeof window === "undefined") return null

  const legacyMessages = localStorage.getItem("chat-messages")
  if (!legacyMessages) return null

  try {
    const messages = JSON.parse(legacyMessages)
    if (!messages || messages.length === 0) return null

    // Check if we already have this conversation migrated
    const conversations = getLocalConversations(userId)
    const existingMigrated = conversations.find(c => c.id.startsWith("migrated-") || c.id === "legacy-conversation")

    if (existingMigrated && existingMigrated.messages.length >= messages.length) {
      return existingMigrated
    }

    // Create new conversation from legacy messages
    const conversation: Conversation = {
      id: existingMigrated?.id || `migrated-${Date.now()}`,
      messages: messages.map(normalizeMessage),
      createdAt: existingMigrated?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLocal: true
    }

    // Save to conversations list
    if (existingMigrated) {
      const index = conversations.findIndex(c => c.id === existingMigrated.id)
      if (index >= 0) {
        conversations[index] = conversation
      }
    } else {
      conversations.unshift(conversation)
    }

    saveLocalConversations(conversations, userId)
    setCurrentConversationId(conversation.id, userId)

    // Try to sync to backend
    if (accessToken) {
      await saveMessages(conversation.id, conversation.messages, accessToken, userId)
    }

    return conversation
  } catch (error) {
    console.error("[ConversationService] Migration error:", error)
    return null
  }
}
