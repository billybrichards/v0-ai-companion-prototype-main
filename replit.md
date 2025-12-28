# Anplexa - The Private Pulse

## Overview
A Next.js 16 frontend application with Anplexa branding - a private AI companion for meaningful adult conversations. Uses Tailwind CSS and shadcn/ui components with a custom dark theme.

## Design System
Anplexa uses a luxury/wellness aesthetic with:
- **Primary Color**: Anplexa Purple (#7B2CBF)
- **Background**: Midnight Void (#121212)
- **Text**: Ghost Silver (#E0E1DD)
- **Typography**: Montserrat (headings), Inter (body), Fira Code (mono)
- **Effects**: Purple glow shadows, gradient buttons

## Backend API
The app connects to the backend at: `https://2-terminal-companion--billy130.replit.app`

Environment variables:
- `API_URL` - Backend URL for server-side API calls
- `NEXT_PUBLIC_API_URL` - Backend URL for client-side API calls

## Project Structure
- `app/` - Next.js App Router pages and API routes
  - `page.tsx` - Landing page (marketing/conversion)
  - `dash/page.tsx` - Main chat interface (gender setup + chat)
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

## Chat Streaming
The chat interface uses AI SDK v5 with streaming responses:
- Text appears progressively (token by token) like ChatGPT/Claude
- Blinking cursor indicator while streaming
- Stop button (square icon) to cancel mid-generation
- Bouncing dots shown only before first text arrives

## Logo
The Anplexa logo is a stylized drop/flame shape with purple gradient, available as:
- SVG file: `public/anplexa-logo.svg`
- React component: `components/anplexa-logo.tsx`

## Guest/Freemium Flow
- Users can try 2 free messages without logging in
- Guest preferences and messages stored in localStorage
- After 2nd message, auth modal prompts sign up
- Guest data migrates to user account on login

## Responsive Design
The app is fully responsive with mobile-first design:
- **Fluid Typography**: Uses clamp() for text sizes that scale smoothly (text-fluid-xs to text-fluid-5xl)
- **Mobile Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Safe Area Insets**: Proper padding for iPhone notch and home indicator
- **Touch Targets**: Minimum 44px touch targets for accessibility
- **Dynamic Viewport**: Uses 100dvh for proper mobile viewport handling
- **Sticky Composer**: Chat input stays at bottom on mobile

## Performance Optimizations
- **Dynamic Imports**: ThemeCustomizer lazy-loaded with next/dynamic
- **SSR Disabled**: For client-only components like theme settings
- **Accessibility**: VisuallyHidden components for screen reader support in dialogs

## GDPR Account Settings
The app includes a full account settings page at `/account` with GDPR compliance:
- **Profile Section**: View account info and subscription status
- **Privacy Settings**: Toggle analytics, personalized AI, and marketing preferences
- **Data Management**: Export personal data as JSON, delete account permanently
- **API Routes**:
  - POST `/api/account/export` - Download user data
  - DELETE `/api/account/delete` - Permanently delete account
  - GET/PATCH `/api/account/privacy` - Manage privacy settings
- **Security**: Requires authentication, confirmation dialog for deletion with "DELETE" text input

## Recent Changes
- December 28, 2025: Security hardening
  - Added security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - Removed ignoreBuildErrors from next.config.mjs
  - Added Zod schema validation to chat and privacy API routes
  - Removed unused gender/customGender variables from chat route
  - Added release notes section to landing page footer
- December 28, 2025: Added GDPR-compliant account/settings page
  - Profile section showing user info and subscription status
  - Privacy settings with toggles for analytics, personalized AI, marketing emails
  - Data export functionality (download as JSON)
  - Account deletion with double confirmation
  - Added switch and alert-dialog UI components
  - Settings icon in chat header links to /account page
- December 28, 2025: Go Pro flow improvement
  - "Get Pro" button on landing page now opens login modal first for unauthenticated users
  - After successful login/signup, automatically redirects to /dash?upgrade=true
  - Chat interface detects ?upgrade=true query param and shows upgrade modal
  - Logged-in users clicking "Get Pro" go directly to upgrade modal
- December 28, 2025: Major responsive design overhaul
  - Added fluid typography system with clamp() utilities
  - Mobile-first layouts across all pages (landing, chat, auth, gender setup)
  - Safe-area inset padding for iPhone notch support
  - Sticky bottom composer in chat interface
  - Touch-friendly buttons with 44px minimum targets
  - Responsive spacing and padding across all components
  - Dynamic imports for theme customizer (bundle optimization)
  - Added accessibility improvements (VisuallyHidden for dialog titles)
- December 27, 2025: Added landing page at root with hero, features, privacy, and pricing sections
- December 27, 2025: Moved chat interface to `/dash` route
- December 27, 2025: Added guest freemium flow (2 free messages before login required)
- December 27, 2025: Updated UI to match Anplexa design samples
  - Added custom SVG logo component
  - Redesigned login page with rounded cards and password toggle
  - Updated gender selection with icon-based options
  - Added logo to chat header
- December 27, 2025: Added Stripe subscription integration
  - Created checkout, webhook, and subscription status API routes
  - Added PRO badge with Crown icon and Upgrade button to chat interface
  - Implemented refreshSubscriptionStatus in AuthContext for UI state sync
  - Token validation on checkout API to prevent spoofing
- December 27, 2025: Initial import and Replit environment setup
  - Configured Next.js allowedDevOrigins for Replit proxy
  - Set up workflow for development server on port 5000
  - Installed dependencies with --legacy-peer-deps due to React 19 peer dependency conflicts
