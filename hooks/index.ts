/**
 * Frontend Hooks
 *
 * Clean Architecture presentation layer hooks for React components.
 */

export { useChat, type UseChatOptions, type UseChatMessage, type UseChatReturn, type SendMessageOptions } from './useChat'
export { useGuestMode, type UseGuestModeOptions, type UseGuestModeReturn, type GuestMessage } from './useGuestMode'

// Re-export existing conversation hook if it exists
export { useConversation } from '@/lib/use-conversation'
