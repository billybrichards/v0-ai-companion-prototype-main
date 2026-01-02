"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

const CLARITY_PROJECT_ID = "uv8hptph57"

export function ClarityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && CLARITY_PROJECT_ID) {
      Clarity.init(CLARITY_PROJECT_ID)
    }
  }, [])

  return <>{children}</>
}

export function identifyClarity(userId: string, sessionId?: string, pageId?: string, friendlyName?: string) {
  if (typeof window !== "undefined") {
    Clarity.identify(userId, sessionId, pageId, friendlyName)
  }
}

export function setClarityTag(key: string, value: string | string[]) {
  if (typeof window !== "undefined") {
    Clarity.setTag(key, value)
  }
}

export function trackClarityEvent(eventName: string) {
  if (typeof window !== "undefined") {
    Clarity.event(eventName)
  }
}
