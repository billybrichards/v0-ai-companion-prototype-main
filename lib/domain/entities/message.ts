/**
 * Message entity - Single source of truth for message handling
 * Eliminates 3 duplicate normalizations across the codebase
 */

// Core message type used throughout the application
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
}

// AI SDK message format (with parts array)
export interface AISDKMessage {
  id: string
  role: string
  parts?: Array<{ type: string; text?: string }>
  content?: string
}

// Backend message format
export interface BackendMessage {
  id?: string
  _id?: string
  role: string
  content?: string
  parts?: Array<{ type: string; text?: string }>
  createdAt?: string
  created_at?: string
}

/**
 * Normalize any message format to our standard Message type
 * Handles: AI SDK format, backend format, legacy format
 */
export function normalizeMessage(msg: unknown): Message {
  if (!msg || typeof msg !== "object") {
    throw new Error("Invalid message: must be an object")
  }

  const m = msg as Record<string, unknown>

  // Get ID
  const id = (m.id as string) || (m._id as string) || `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`

  // Get role
  const role = (m.role as string) || "user"
  const normalizedRole: "user" | "assistant" | "system" =
    role === "assistant" || role === "system" ? role : "user"

  // Get content - prefer content field, fallback to parts
  let content = ""
  if (typeof m.content === "string" && m.content) {
    content = m.content
  } else if (Array.isArray(m.parts)) {
    const parts = m.parts as Array<{ type: string; text?: string }>
    content = parts
      .filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("")
  }

  // Get createdAt
  const createdAt =
    (m.createdAt as string) ||
    (m.created_at as string) ||
    new Date().toISOString()

  return {
    id,
    role: normalizedRole,
    content,
    createdAt,
  }
}

/**
 * Convert Message to AI SDK format for useChat hook
 */
export function toAISDKFormat(msg: Message): AISDKMessage {
  return {
    id: msg.id,
    role: msg.role,
    parts: [{ type: "text", text: msg.content }],
  }
}

/**
 * Convert AI SDK message to our Message format
 */
export function fromAISDKFormat(msg: AISDKMessage): Message {
  return normalizeMessage(msg)
}

/**
 * Normalize an array of messages
 */
export function normalizeMessages(messages: unknown[]): Message[] {
  return messages.map(normalizeMessage)
}

/**
 * Convert array to AI SDK format
 */
export function toAISDKMessages(messages: Message[]): AISDKMessage[] {
  return messages.map(toAISDKFormat)
}

/**
 * Generate a title from the first user message
 */
export function generateTitleFromMessages(messages: Message[], maxLength: number = 50): string {
  const firstUserMessage = messages.find((m) => m.role === "user")
  if (!firstUserMessage) {
    return "New Conversation"
  }

  const content = firstUserMessage.content.trim()
  if (content.length <= maxLength) {
    return content
  }

  // Truncate at word boundary
  const truncated = content.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return lastSpace > 20 ? truncated.slice(0, lastSpace) + "..." : truncated + "..."
}

/**
 * Check if message is a system/hidden message (like ice-breaker triggers)
 */
export function isHiddenMessage(msg: Message): boolean {
  return (
    msg.content.startsWith("[start conversation]") ||
    msg.content.startsWith("[system]") ||
    msg.role === "system"
  )
}

/**
 * Filter out hidden/system messages for display
 */
export function getVisibleMessages(messages: Message[]): Message[] {
  return messages.filter((m) => !isHiddenMessage(m))
}
