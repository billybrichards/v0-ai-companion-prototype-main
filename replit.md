# Anplexa - The Private Pulse

## Overview
Anplexa is a Next.js 16 frontend application designed as a private AI companion for meaningful adult conversations. It aims to provide a luxury/wellness experience, offering a secure and personalized environment for users. The project includes features for user authentication, subscription management, GDPR-compliant account settings, and a responsive chat interface with AI-driven conversation starters. Its business vision is to offer a unique, private AI interaction experience, targeting a market seeking personal and secure AI companionship.

## User Preferences
I prefer detailed explanations. Ask before making major changes. I want iterative development. I prefer simple language. I like functional programming.

## System Architecture
The application is built with Next.js 16, React 19, and TypeScript, utilizing Tailwind CSS 4 and shadcn/ui components for a custom dark theme.

**UI/UX Decisions:**
- **Aesthetic:** Luxury/wellness with a custom dark theme.
- **Color Palette:** Primary Anplexa Purple (#7B2CBF), Midnight Void (#121212) background, Ghost Silver (#E0E1DD) text.
- **Typography:** Montserrat (headings), Inter (body), Fira Code (monospace).
- **Effects:** Purple glow shadows, gradient buttons.
- **Responsive Design:** Mobile-first approach with fluid typography (clamp()), safe area insets, 100dvh for viewport handling, and minimum 44px touch targets.
- **Components:** Uses shadcn/ui (based on Radix UI) for a consistent and accessible UI.

**Technical Implementations & Feature Specifications:**
- **Project Structure:**
    - `app/`: Next.js App Router for pages and API routes (e.g., `page.tsx` for landing, `dash/page.tsx` for chat, `api/chat/route.ts`).
    - `components/`: Reusable React UI components.
    - `lib/`: Utility functions.
    - `public/`: Static assets.
- **Authentication & Authorization:**
    - Guest/Freemium flow: 2 free messages, then prompts for sign-up/login; guest data migrates on login.
    - Magic Link Authentication: Password-less login option.
    - Funnel Query String Handling: Supports various query parameters (`email`, `Funnel`, `subscription`, `plan`, `magic`) for directing users through different onboarding and subscription flows.
- **Chat Interface:**
    - AI SDK v5 for streaming responses (token-by-token display, stop button, loading indicators).
    - Backend-driven new chat ice-breaker flow for dynamic conversation starters.
    - Responsive sticky composer for mobile.
    - PRO badge and upgrade button for subscription status.
    - Dynamic personality modes fetched from API (`/api/personality-modes`) with selector dropdown on desktop.
- **Subscription Management (Stripe Integration):**
    - Checkout API, Webhook Handler, Verify Checkout API, and Subscription Status API for managing PRO subscriptions.
    - Fallback mechanism for webhook failures.
- **GDPR-compliant Account Settings (`/account`):**
    - Profile, Privacy Settings (analytics, personalized AI, marketing), Data Management (export JSON, delete account).
- **Email Integration:** Uses Resend for transactional emails (welcome, subscription confirmation, data export/deletion, password reset).
- **SEO & Metadata:** Comprehensive Open Graph, Twitter card meta tags, JSON-LD, PWA manifest, `robots.txt`, dynamic `sitemap.ts`.
- **Performance:** Dynamic imports for lazy loading, SSR disabled for client-only components.
- **Security:** Bearer token validation, webhook secrets, Zod schema validation for API routes, security headers.
- **Legal Pages:** `/terms` and `/privacy` pages with links in the footer.

**System Design Choices:**
- **Next.js App Router:** For modern routing and API routes.
- **TypeScript:** For type safety and improved developer experience.
- **Tailwind CSS:** For utility-first styling.
- **shadcn/ui:** For accessible and customizable UI components.
- **PostHog Analytics:** For comprehensive event tracking and user behavior analysis.
- **AI SDK (@ai-sdk/react):** For integrating AI functionalities.
- **Error Boundary:** Global error boundary (`components/error-boundary.tsx`) catches client-side crashes and displays a recovery UI.
- **Guest State Management:** `lib/guest-state.ts` provides safe localStorage operations for unauthenticated users with proper SSR guards.
- **Providers Wrapper:** `components/providers.tsx` wraps ErrorBoundary, PostHog, Clarity, and Auth providers in a stable tree to prevent remounts.

**Analytics (PostHog):**
- Provider: `lib/posthog.tsx` wraps the app with PostHog context
- Events tracked: `user_signed_up`, `user_logged_in`, `user_logged_out`, `magic_link_verified`, `checkout_started`, `checkout_completed`, `subscription_verified`, `upgrade_modal_shown`, `upgrade_clicked`, `message_sent`, `ai_response_received`, `gender_selected`, `companion_name_set`, `onboarding_completed`, `funnel_detected`
- User identification: Called on login/register/magic link verification with email, plan, and subscription status
- Page views: Automatic capture on navigation
- Environment: `NEXT_PUBLIC_POSTHOG_KEY` (secret), `NEXT_PUBLIC_POSTHOG_HOST` (https://us.i.posthog.com)

**Analytics (Microsoft Clarity):**
- Provider: `lib/clarity.tsx` wraps the app with Clarity initialization
- Project ID: `uv8hptph57` (hardcoded)
- Features: Session replays, heatmaps, behavior insights
- Helper functions: `identifyClarity()`, `setClarityTag()`, `trackClarityEvent()` available for custom tracking

**Analytics (Meta Pixel):**
- Location: `app/layout.tsx` in the `<head>` section
- Pixel ID: `2042123676520826`
- Events: Automatic PageView tracking on every page load
- Includes noscript fallback for users with JavaScript disabled

## External Dependencies
- **Backend API:** `https://api.anplexa.com` (with `/api/stripe/verify-checkout` for checkout verification)
- **Stripe:** For subscription management and payment processing.
- **Resend:** For sending transactional emails.
- **PostHog:** For product analytics and event tracking.