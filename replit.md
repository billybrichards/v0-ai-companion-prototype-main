# Terminal Companion

## Overview
A Next.js 16 application with Tailwind CSS, featuring a login/authentication interface. The app uses the App Router and includes an API route for chat functionality.

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

## Recent Changes
- December 27, 2025: Initial import and Replit environment setup
  - Configured Next.js allowedDevOrigins for Replit proxy
  - Set up workflow for development server on port 5000
  - Installed dependencies with --legacy-peer-deps due to React 19 peer dependency conflicts
