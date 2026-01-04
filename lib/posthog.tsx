"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense, useRef, type ReactNode } from "react"

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (pathname && posthogClient) {
      try {
        let url = window.origin + pathname
        if (searchParams?.toString()) {
          url = url + "?" + searchParams.toString()
        }
        posthogClient.capture("$pageview", { $current_url: url })
      } catch (error) {
        console.error("[PostHog] Failed to capture pageview:", error)
      }
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

function PostHogInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    if (typeof window === "undefined") return
    if (!POSTHOG_KEY) return

    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "localStorage+cookie",
        autocapture: {
          dom_event_allowlist: ["click", "submit"],
          element_allowlist: ["button", "a", "input"],
        },
        loaded: () => {
          console.log("[PostHog] Initialized successfully")
        },
      })
      initialized.current = true
    } catch (error) {
      console.error("[PostHog] Failed to initialize:", error)
    }
  }, [])

  return null
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  if (!POSTHOG_KEY) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <PostHogInitializer />
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}

export { posthog }
