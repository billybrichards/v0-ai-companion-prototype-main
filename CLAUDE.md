# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture Overview

This is an AI companion chat application built with Next.js 16 (App Router) and the Vercel AI SDK. The project syncs with v0.app for deployment.

### Key Components

- **Frontend**: Next.js with React 19, Tailwind CSS v4, and shadcn/ui components (New York style)
- **Chat**: Uses `@ai-sdk/react` with `useChat` hook for streaming responses
- **Auth**: Client-side auth context (`lib/auth-context.tsx`) that communicates with an external backend API
- **Styling**: Tailwind CSS v4 with CSS variables for theming, terminal/monospace aesthetic

### Data Flow

1. User sends message via `ChatInterface` component
2. Request goes to `/api/chat/route.ts` which proxies to external backend (`API_URL` env var)
3. Backend returns SSE stream, which is transformed to AI SDK format and streamed to client
4. Messages stored in localStorage for persistence

### Project Structure

```
app/
  page.tsx          # Main page with auth/setup flow
  layout.tsx        # Root layout with AuthProvider
  api/chat/route.ts # Chat API endpoint (proxies to backend)
  globals.css       # Tailwind config and CSS variables

components/
  chat-interface.tsx   # Main chat UI
  auth-form.tsx        # Login/register form
  gender-setup.tsx     # Initial user setup
  settings-modal.tsx   # Settings UI
  theme-customizer.tsx # Theme customization
  ui/                  # shadcn/ui components

lib/
  auth-context.tsx  # Authentication state management
  utils.ts          # cn() helper for class merging
```

### Environment Variables

- `API_URL` / `NEXT_PUBLIC_API_URL`: Backend API base URL (defaults to `http://localhost:3001`)

### Styling Conventions

- Uses OKLCH color space for CSS variables
- Path alias `@/*` maps to project root
- shadcn/ui components in `components/ui/`
- Use `cn()` from `lib/utils` for conditional class merging

## Two-Repo Architecture

This frontend connects to a separate backend repo: **`2-terminal-companion`** (Express.js + TypeScript)

```
Frontend (Vercel)                    Backend (Replit)
─────────────────                    ────────────────
/api/chat/route.ts  ──HTTP POST──►   POST /api/chat (SSE)
lib/auth-context.tsx ──HTTP──────►   POST /api/auth/*
                                     GET/PUT /api/settings/*
                                     GET /api/conversations/*
```

### Environment Variables

| Variable | Where Used | Description |
|----------|------------|-------------|
| `API_URL` | `app/api/chat/route.ts` | Backend URL for server-side API calls |
| `NEXT_PUBLIC_API_URL` | `lib/auth-context.tsx` | Backend URL for client-side auth calls |

### Deployment Steps

1. **Deploy Backend** to Replit (or other hosting)
   - Set required secrets: `OLLAMA_BASE_URL`, `OLLAMA_API_KEY`, `JWT_SECRET`, `FRONTEND_URL`
   - Note the deployed URL

2. **Deploy Frontend** to Vercel
   - Set env vars: `API_URL` and `NEXT_PUBLIC_API_URL` to backend URL
   - Deploy

3. **Update Backend CORS**
   - Set `FRONTEND_URL` in backend to your Vercel domain
   - Restart backend
