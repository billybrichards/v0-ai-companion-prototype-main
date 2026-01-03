/**
 * Centralized typed storage service
 * Handles localStorage operations with user/guest scoping
 */

// Storage key definitions
export const STORAGE_KEYS = {
  // Conversations
  CONVERSATIONS: "anplexa-conversations",
  CURRENT_CONVERSATION: "anplexa-current-conversation",
  LEGACY_MESSAGES: "chat-messages",

  // Guest
  GUEST_MESSAGES: "guest-chat-messages",
  GUEST_MESSAGE_COUNT: "guest-message-count",

  // Preferences
  COMPANION_GENDER: "companion-gender",
  COMPANION_CUSTOM_GENDER: "companion-custom-gender",
  CHAT_NAME: "chat-name",

  // Auth
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",

  // Funnel
  FUNNEL_PERSONA: "funnel-persona",
  FUNNEL_PLAN: "funnel-plan",
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

interface StorageOptions {
  userId?: string | null
  isGuest?: boolean
}

class StorageService {
  private isAvailable: boolean

  constructor() {
    this.isAvailable = typeof window !== "undefined" && !!window.localStorage
  }

  /**
   * Get the scoped key based on user context
   */
  private getScopedKey(key: StorageKey, options?: StorageOptions): string {
    if (!options?.userId && !options?.isGuest) {
      return key
    }

    // Guest-specific keys
    if (options?.isGuest) {
      if (key === STORAGE_KEYS.COMPANION_GENDER) return "guest-companion-gender"
      if (key === STORAGE_KEYS.COMPANION_CUSTOM_GENDER) return "guest-companion-custom-gender"
      if (key === STORAGE_KEYS.CHAT_NAME) return "guest-chat-name"
      if (key === STORAGE_KEYS.CONVERSATIONS) return "anplexa-conversation-guest"
      return key
    }

    // User-specific keys
    if (options?.userId) {
      if (key === STORAGE_KEYS.COMPANION_GENDER) return `companion-gender-${options.userId}`
      if (key === STORAGE_KEYS.COMPANION_CUSTOM_GENDER) return `companion-custom-gender-${options.userId}`
      if (key === STORAGE_KEYS.CHAT_NAME) return `chat-name-${options.userId}`
      if (key === STORAGE_KEYS.CONVERSATIONS) return `anplexa-conversation-${options.userId}`
      if (key === STORAGE_KEYS.CURRENT_CONVERSATION) return `anplexa-current-conversation-${options.userId}`
    }

    return key
  }

  /**
   * Get a value from storage
   */
  get<T>(key: StorageKey, options?: StorageOptions): T | null {
    if (!this.isAvailable) return null

    try {
      const scopedKey = this.getScopedKey(key, options)
      const value = localStorage.getItem(scopedKey)
      if (value === null) return null

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value) as T
      } catch {
        return value as unknown as T
      }
    } catch (error) {
      console.error(`[Storage] Error reading ${key}:`, error)
      return null
    }
  }

  /**
   * Set a value in storage
   */
  set<T>(key: StorageKey, value: T, options?: StorageOptions): void {
    if (!this.isAvailable) return

    try {
      const scopedKey = this.getScopedKey(key, options)
      const serialized = typeof value === "string" ? value : JSON.stringify(value)
      localStorage.setItem(scopedKey, serialized)
    } catch (error) {
      console.error(`[Storage] Error writing ${key}:`, error)
    }
  }

  /**
   * Remove a value from storage
   */
  remove(key: StorageKey, options?: StorageOptions): void {
    if (!this.isAvailable) return

    try {
      const scopedKey = this.getScopedKey(key, options)
      localStorage.removeItem(scopedKey)
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error)
    }
  }

  /**
   * Clear all storage (use with caution)
   */
  clear(): void {
    if (!this.isAvailable) return
    localStorage.clear()
  }

  /**
   * Migrate guest data to user data after login
   */
  migrateGuestToUser(userId: string): void {
    if (!this.isAvailable) return

    const guestKeys = [
      { guest: "guest-companion-gender", user: `companion-gender-${userId}` },
      { guest: "guest-companion-custom-gender", user: `companion-custom-gender-${userId}` },
      { guest: "guest-chat-name", user: `chat-name-${userId}` },
      { guest: "anplexa-conversation-guest", user: `anplexa-conversation-${userId}` },
    ]

    for (const { guest, user } of guestKeys) {
      const guestValue = localStorage.getItem(guest)
      if (guestValue && !localStorage.getItem(user)) {
        localStorage.setItem(user, guestValue)
        localStorage.removeItem(guest)
        console.log(`[Storage] Migrated ${guest} to ${user}`)
      }
    }

    // Also migrate legacy chat messages if they exist
    const legacyMessages = localStorage.getItem("chat-messages")
    const guestMessages = localStorage.getItem("guest-chat-messages")

    if (guestMessages && !legacyMessages) {
      localStorage.setItem("chat-messages", guestMessages)
      localStorage.removeItem("guest-chat-messages")
      console.log("[Storage] Migrated guest-chat-messages to chat-messages")
    }
  }

  /**
   * Get user preferences with fallbacks
   */
  getPreferences(userId?: string | null): {
    gender: string | null
    customGender: string | null
    chatName: string | null
  } {
    const options = userId ? { userId } : { isGuest: true }

    return {
      gender: this.get<string>(STORAGE_KEYS.COMPANION_GENDER, options),
      customGender: this.get<string>(STORAGE_KEYS.COMPANION_CUSTOM_GENDER, options),
      chatName: this.get<string>(STORAGE_KEYS.CHAT_NAME, options),
    }
  }

  /**
   * Save user preferences
   */
  setPreferences(
    preferences: { gender?: string; customGender?: string; chatName?: string },
    userId?: string | null
  ): void {
    const options = userId ? { userId } : { isGuest: true }

    if (preferences.gender) {
      this.set(STORAGE_KEYS.COMPANION_GENDER, preferences.gender, options)
    }
    if (preferences.customGender) {
      this.set(STORAGE_KEYS.COMPANION_CUSTOM_GENDER, preferences.customGender, options)
    } else {
      this.remove(STORAGE_KEYS.COMPANION_CUSTOM_GENDER, options)
    }
    if (preferences.chatName) {
      this.set(STORAGE_KEYS.CHAT_NAME, preferences.chatName, options)
    } else {
      this.remove(STORAGE_KEYS.CHAT_NAME, options)
    }
  }
}

// Singleton instance
export const storage = new StorageService()
