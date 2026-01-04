"use client"

export interface GuestMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: string
}

export interface GuestConversation {
  id: string
  messages: GuestMessage[]
  createdAt: string
  updatedAt: string
}

const GUEST_MESSAGES_KEY = "anplexa-guest-messages"
const GUEST_MESSAGE_COUNT_KEY = "anplexa-guest-message-count"
const GUEST_CONVERSATION_KEY = "anplexa-guest-conversation"
const GUEST_ID_KEY = "anplexa-guest-id"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function safeGetItem(key: string): string | null {
  if (!isBrowser()) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    console.error("[GuestState] Failed to save to localStorage:", e)
  }
}

function safeRemoveItem(key: string): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore
  }
}

export function getGuestId(): string {
  let guestId = safeGetItem(GUEST_ID_KEY)
  if (!guestId) {
    guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    safeSetItem(GUEST_ID_KEY, guestId)
  }
  return guestId
}

export function getGuestMessages(): GuestMessage[] {
  const stored = safeGetItem(GUEST_MESSAGES_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveGuestMessages(messages: GuestMessage[]): void {
  safeSetItem(GUEST_MESSAGES_KEY, JSON.stringify(messages))
}

export function addGuestMessage(message: GuestMessage): GuestMessage[] {
  const messages = getGuestMessages()
  messages.push({
    ...message,
    createdAt: message.createdAt || new Date().toISOString()
  })
  saveGuestMessages(messages)
  return messages
}

export function getGuestMessageCount(): number {
  const stored = safeGetItem(GUEST_MESSAGE_COUNT_KEY)
  if (!stored) return 0
  
  try {
    return parseInt(stored, 10) || 0
  } catch {
    return 0
  }
}

export function setGuestMessageCount(count: number): void {
  safeSetItem(GUEST_MESSAGE_COUNT_KEY, count.toString())
}

export function incrementGuestMessageCount(): number {
  const current = getGuestMessageCount()
  const newCount = current + 1
  setGuestMessageCount(newCount)
  return newCount
}

export function getGuestConversation(): GuestConversation | null {
  const stored = safeGetItem(GUEST_CONVERSATION_KEY)
  if (!stored) return null
  
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function saveGuestConversation(conversation: GuestConversation): void {
  safeSetItem(GUEST_CONVERSATION_KEY, JSON.stringify(conversation))
}

export function createGuestConversation(): GuestConversation {
  const now = new Date().toISOString()
  const conversation: GuestConversation = {
    id: `guest-conv-${Date.now()}`,
    messages: [],
    createdAt: now,
    updatedAt: now
  }
  saveGuestConversation(conversation)
  return conversation
}

export function clearGuestData(): void {
  safeRemoveItem(GUEST_MESSAGES_KEY)
  safeRemoveItem(GUEST_MESSAGE_COUNT_KEY)
  safeRemoveItem(GUEST_CONVERSATION_KEY)
}

export function migrateGuestDataToUser(): { messages: GuestMessage[], messageCount: number } | null {
  const messages = getGuestMessages()
  const messageCount = getGuestMessageCount()
  
  if (messages.length === 0) return null
  
  return { messages, messageCount }
}
