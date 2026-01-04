# Frontend Clean Architecture Refactoring Plan

## Current State Analysis

### Critical Issues Identified

#### 1. Conversation Management Problems
- **No conversation history UI**: Users cannot see or switch between past conversations
- **Unreliable persistence**: Conversations stored in 3+ places (localStorage, backend, legacy format)
- **Login doesn't restore history**: New browser sessions don't properly load previous conversations
- **Dual-layer complexity**: `useConversation` hook exists but isn't fully integrated

#### 2. Redundant Code (Estimated 40% reduction possible)
- **API route boilerplate**: 20+ routes repeat 10+ lines of header/auth setup
- **Message normalization**: Duplicated in 3 places (`conversation-service.ts:25-39`, `chat-interface.tsx:381-387`, `dash/page.tsx:359-363`)
- **localStorage key construction**: Scattered across 8+ files
- **Guest/Auth logic intertwined**: Same components handle both, creating complexity

#### 3. Architectural Violations
- **ChatInterface**: 1,053 lines - handles messages, auth modals, subscriptions, theme, settings
- **No domain layer**: Business rules mixed with UI code
- **No repository pattern**: Direct localStorage/fetch calls everywhere

---

## Proposed Clean Architecture Structure

```
lib/
├── domain/                    # Pure business logic (zero dependencies)
│   ├── entities/
│   │   ├── conversation.ts    # Conversation entity with methods
│   │   ├── message.ts         # Message value object
│   │   └── user.ts            # User entity
│   ├── repositories/
│   │   ├── conversation-repository.ts  # Interface only
│   │   └── user-repository.ts          # Interface only
│   └── errors.ts              # Domain-specific errors
│
├── use-cases/                 # Application business rules
│   ├── conversation/
│   │   ├── load-conversation.ts
│   │   ├── save-messages.ts
│   │   ├── create-conversation.ts
│   │   ├── list-conversations.ts
│   │   └── switch-conversation.ts
│   └── auth/
│       └── sync-preferences.ts
│
├── adapters/                  # Interface adapters
│   ├── api/
│   │   ├── api-client.ts      # Centralized API client with auth
│   │   └── conversation-api.ts # Conversation API adapter
│   ├── storage/
│   │   ├── storage-service.ts      # Typed localStorage wrapper
│   │   └── conversation-storage.ts # localStorage implementation
│   └── repositories/
│       └── conversation-repository-impl.ts  # Implements interface
│
├── infrastructure/            # Framework-specific code
│   ├── hooks/
│   │   ├── use-conversation.ts      # Refactored hook
│   │   ├── use-conversation-list.ts # NEW: For history dropdown
│   │   └── use-chat.ts              # Chat-specific hook
│   └── providers/
│       └── conversation-provider.tsx # Context for conversation state
│
components/
├── chat/                      # Chat-specific components
│   ├── chat-interface.tsx     # Slimmed down (< 300 lines)
│   ├── message-list.tsx       # Message rendering
│   ├── message-input.tsx      # Input form
│   ├── conversation-dropdown.tsx  # NEW: History dropdown
│   └── chat-header.tsx        # Header with controls
├── modals/
│   ├── upgrade-modal.tsx      # Extracted from chat-interface
│   ├── auth-modal.tsx         # Extracted from chat-interface
│   └── guest-limit-modal.tsx  # Extracted from chat-interface
└── ui/                        # Existing shadcn components
```

---

## Implementation Tasks

### Phase 1: Core Infrastructure (Foundation)

#### Task 1.1: Create Centralized API Client
**File**: `lib/adapters/api/api-client.ts`

Remove boilerplate from 20+ API routes by centralizing:
- Base URL configuration
- Authorization header injection
- Backend API key handling
- Error handling patterns

```typescript
// Before: Repeated in every route
const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"
const backendApiKey = process.env.BACKEND_API_KEY
const authHeader = req.headers.get("authorization")

// After: Single import
import { apiClient } from "@/lib/adapters/api/api-client"
const response = await apiClient.get("/conversations", { auth: true })
```

#### Task 1.2: Create Typed Storage Service
**File**: `lib/adapters/storage/storage-service.ts`

Centralize all localStorage operations with:
- Type-safe getters/setters
- User-scoped key generation
- Guest vs authenticated key handling
- Migration from legacy formats

```typescript
// Before: Scattered everywhere
localStorage.getItem(`companion-gender-${userId}`)
localStorage.getItem("guest-companion-gender")

// After: Type-safe API
storage.get("companion-gender")  // Automatically handles user/guest
storage.set("companion-gender", value)
```

#### Task 1.3: Create Message Normalizer (Single Source of Truth)
**File**: `lib/domain/entities/message.ts`

Eliminate 3 duplicate normalizations:

```typescript
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: string
}

export function normalizeMessage(msg: unknown): Message {
  // Single implementation
}

export function toAISDKFormat(msg: Message): AISDKMessage {
  // Convert for AI SDK
}

export function fromAISDKFormat(msg: AISDKMessage): Message {
  // Convert from AI SDK
}
```

---

### Phase 2: Conversation History Feature

#### Task 2.1: Create Conversation List Hook
**File**: `lib/infrastructure/hooks/use-conversation-list.ts`

```typescript
interface UseConversationListReturn {
  conversations: ConversationSummary[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useConversationList(): UseConversationListReturn
```

#### Task 2.2: Create Conversation Dropdown Component
**File**: `components/chat/conversation-dropdown.tsx`

Features:
- Shows recent conversations (title + preview + date)
- "New Conversation" button at top
- Click to switch conversations
- Delete conversation option
- Auto-generates titles from first message

```
┌─────────────────────────────────┐
│ ▼ Conversations                 │
├─────────────────────────────────┤
│ ➕ New Conversation             │
├─────────────────────────────────┤
│ Today                           │
│ ├─ "About my work stress..."    │
│ └─ "Looking for advice on..."   │
├─────────────────────────────────┤
│ Yesterday                       │
│ └─ "Just wanted to talk..."     │
├─────────────────────────────────┤
│ This Week                       │
│ └─ "Feeling overwhelmed..."     │
└─────────────────────────────────┘
```

#### Task 2.3: Update Chat Header
**File**: `components/chat/chat-header.tsx`

- Add conversation dropdown to header
- Keep existing controls (settings, logout, etc.)
- Mobile-responsive design

---

### Phase 3: Reliable Conversation Loading

#### Task 3.1: Improve getMostRecentConversation
**File**: `lib/conversation-service.ts` (refactor to use-cases)

Priority loading order:
1. Check backend for user's conversations
2. If backend fails, check localStorage with user ID
3. If no user ID, check guest localStorage
4. Merge and deduplicate across sources

#### Task 3.2: Implement Conversation Sync on Login
**File**: `lib/auth-context.tsx`

When user logs in:
1. Fetch all backend conversations
2. Merge with any local conversations
3. Update localStorage with merged data
4. Set most recent as active

#### Task 3.3: Create Conversation Provider
**File**: `lib/infrastructure/providers/conversation-provider.tsx`

Centralized state management:
```typescript
interface ConversationContextValue {
  activeConversation: Conversation | null
  conversations: ConversationSummary[]
  isLoading: boolean

  // Actions
  switchConversation: (id: string) => Promise<void>
  startNewConversation: () => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  saveMessages: (messages: Message[]) => Promise<void>
}
```

---

### Phase 4: Component Decomposition

#### Task 4.1: Extract Upgrade Modal
**File**: `components/modals/upgrade-modal.tsx`

Move lines 964-1049 from chat-interface.tsx:
- Plan selection
- Subscription logic
- Pricing display

#### Task 4.2: Extract Auth Modal
**File**: `components/modals/auth-modal.tsx`

Move lines 952-961 from chat-interface.tsx.

#### Task 4.3: Extract Guest Limit Modal
**File**: `components/modals/guest-limit-modal.tsx`

Move lines 847-904 from chat-interface.tsx.

#### Task 4.4: Extract Message List
**File**: `components/chat/message-list.tsx`

Move lines 664-778 from chat-interface.tsx:
- Guest message rendering
- Authenticated message rendering
- Streaming indicators

#### Task 4.5: Extract Message Input
**File**: `components/chat/message-input.tsx`

Move lines 906-950 from chat-interface.tsx:
- Textarea
- Send/stop buttons
- Keyboard handling

#### Task 4.6: Slim Down ChatInterface
**File**: `components/chat-interface.tsx`

Target: < 300 lines
Only orchestration logic:
- Import and compose child components
- High-level state management
- Event handlers that delegate to hooks

---

### Phase 5: API Route Consolidation

#### Task 5.1: Create Shared API Utilities
**File**: `app/api/_lib/api-utils.ts`

```typescript
export function getApiConfig() {
  return {
    baseUrl: process.env.API_URL || "https://api.anplexa.com",
    apiKey: process.env.BACKEND_API_KEY,
  }
}

export function getAuthHeader(req: Request): string | null {
  return req.headers.get("authorization")
}

export function createProxyHeaders(req: Request): HeadersInit {
  const auth = getAuthHeader(req)
  const { apiKey } = getApiConfig()
  return {
    ...(auth ? { Authorization: auth } : {}),
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
    "Content-Type": "application/json",
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

#### Task 5.2: Refactor API Routes
Apply shared utilities to all 20+ routes:
- `/api/conversations/route.ts`
- `/api/conversations/[id]/route.ts`
- `/api/subscription/route.ts`
- `/api/verify-subscription/route.ts`
- etc.

---

## Migration Strategy

### Step 1: Non-Breaking Foundation (Week 1)
1. Add new files alongside existing code
2. Create adapters that wrap existing functionality
3. No changes to existing behavior

### Step 2: Gradual Migration (Week 2)
1. Update `useConversation` to use new infrastructure
2. Add conversation dropdown (hidden behind feature flag if needed)
3. Test conversation loading thoroughly

### Step 3: Component Extraction (Week 3)
1. Extract modals one at a time
2. Keep props/interfaces identical
3. Verify no visual regressions

### Step 4: Cleanup (Week 4)
1. Remove legacy localStorage keys
2. Delete unused code
3. Update CLAUDE.md with new architecture

---

## File Changes Summary

### New Files (15)
```
lib/domain/entities/conversation.ts
lib/domain/entities/message.ts
lib/domain/repositories/conversation-repository.ts
lib/adapters/api/api-client.ts
lib/adapters/storage/storage-service.ts
lib/adapters/repositories/conversation-repository-impl.ts
lib/infrastructure/hooks/use-conversation-list.ts
lib/infrastructure/providers/conversation-provider.tsx
components/chat/conversation-dropdown.tsx
components/chat/chat-header.tsx
components/chat/message-list.tsx
components/chat/message-input.tsx
components/modals/upgrade-modal.tsx
components/modals/auth-modal.tsx
components/modals/guest-limit-modal.tsx
app/api/_lib/api-utils.ts
```

### Modified Files (8)
```
lib/conversation-service.ts      → Simplified, uses new adapters
lib/use-conversation.ts          → Uses new infrastructure
lib/auth-context.tsx             → Add conversation sync on login
components/chat-interface.tsx    → Slim down to < 300 lines
app/dash/page.tsx                → Use ConversationProvider
app/api/conversations/route.ts   → Use shared utilities
app/api/conversations/[id]/route.ts → Use shared utilities
(+ 18 other API routes)
```

### Deleted/Deprecated Code
- Legacy `chat-messages` localStorage format
- Duplicate message normalization functions
- Repeated API boilerplate

---

## Expected Outcomes

1. **Conversation History Dropdown**: Users can see and switch between past conversations
2. **Reliable Loading**: Login on new browser loads previous conversation
3. **~40% Code Reduction**: From deduplication and extraction
4. **ChatInterface**: 1,053 → ~250 lines
5. **API Routes**: 20+ files each ~50 lines → ~15 lines each
6. **Testability**: Domain layer can be unit tested without mocks
