# Terminal Companion

## Overview
A Next.js 16 frontend application that connects to an external backend API for authentication and chat functionality. Uses Tailwind CSS and shadcn/ui components.

## Backend API
The app connects to the backend at: `https://2-terminal-companion--billy130.replit.app`

Environment variables:
- `API_URL` - Backend URL for server-side API calls
- `NEXT_PUBLIC_API_URL` - Backend URL for client-side API calls

## Project Structure
- `app/` - Next.js App Router pages and API routes
  - `page.tsx` - Main login page
  - `layout.tsx` - Root layout
  - `globals.css` - Global styles
  - `api/chat/route.ts` - Chat API endpoint
- `components/` - React UI components (shadcn/ui)
- `lib/` - Utility functions
- `public/` - Static assets
- `styles/` - Additional styles

## Tech Stack
- Next.js 16 with Turbopack
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components (Radix UI)
- Vercel Analytics
- AI SDK (@ai-sdk/react)

## Development
The development server runs on port 5000:
```bash
npm run dev -- -p 5000 -H 0.0.0.0
```

## Deployment
Configured for autoscale deployment with:
- Build: `npm run build`
- Run: `npm run start -- -p 5000 -H 0.0.0.0`

## Stripe Subscription Integration
The app includes PRO subscription functionality via Stripe:
- **Checkout API** (`app/api/create-checkout/route.ts`): Creates Stripe checkout sessions with token validation
- **Webhook Handler** (`app/api/stripe-webhook/route.ts`): Processes checkout.session.completed events
- **Subscription Status API** (`app/api/subscription/route.ts`): Fetches user subscription status
- **PRO Badge**: Displays in chat header when user.subscriptionStatus === "subscribed"
- **Upgrade Button**: Shows for non-subscribed users, triggers Stripe checkout

Security:
- Checkout API validates bearer tokens via backend /api/auth/validate endpoint
- Webhook uses X-Webhook-Secret header for backend authentication

## Recent Changes
- December 27, 2025: Added Stripe subscription integration
  - Created checkout, webhook, and subscription status API routes
  - Added PRO badge with Crown icon and Upgrade button to chat interface
  - Implemented refreshSubscriptionStatus in AuthContext for UI state sync
  - Token validation on checkout API to prevent spoofing
- December 27, 2025: Initial import and Replit environment setup
  - Configured Next.js allowedDevOrigins for Replit proxy
  - Set up workflow for development server on port 5000
  - Installed dependencies with --legacy-peer-deps due to React 19 peer dependency conflicts
