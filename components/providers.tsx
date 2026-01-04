"use client"

import { type ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { PostHogProvider } from "@/lib/posthog"
import { ClarityProvider } from "@/lib/clarity"
import { ErrorBoundary } from "@/components/error-boundary"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <PostHogProvider>
        <ClarityProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ClarityProvider>
      </PostHogProvider>
    </ErrorBoundary>
  )
}
