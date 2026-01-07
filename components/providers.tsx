"use client"

import { type ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { PathChoiceProvider } from "@/lib/path-choice-context"
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
          <PathChoiceProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </PathChoiceProvider>
        </ClarityProvider>
      </PostHogProvider>
    </ErrorBoundary>
  )
}
