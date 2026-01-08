/**
 * Shared API Contracts
 *
 * Central export point for all API type definitions.
 * These contracts define the interface between frontend and backend.
 *
 * IMPORTANT: Changes to these types must be backward compatible.
 * Never remove fields - only add new ones.
 */

// Auth contracts
export * from './auth';

// Chat contracts
export * from './chat';

// Conversation contracts
export * from './conversation';

// Stripe/payment contracts
export * from './stripe';

// Re-export commonly used types for convenience
export type {
  UserDTO,
  AuthTokens,
  PersonalityMode,
} from './auth';

export type {
  MessageDTO,
  ConversationDTO,
  ChatRequest,
  ChatPreferences,
  SSEEvent,
} from './chat';

export type {
  ConversationSummary,
  GroupedConversations,
} from './conversation';
