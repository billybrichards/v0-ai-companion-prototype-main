"use client"

import { useEffect, useState, type ReactNode } from "react"
import Clarity from "@microsoft/clarity"

const CLARITY_PROJECT_ID = "uv8hptph57"

let clarityInitialized = false

function initClarity(): boolean {
  if (typeof window === "undefined") return false
  if (clarityInitialized) return true
  if (!CLARITY_PROJECT_ID) return false

  try {
    Clarity.init(CLARITY_PROJECT_ID)
    clarityInitialized = true
    console.log("[Clarity] Initialized successfully")
    return true
  } catch (error) {
    console.error("[Clarity] Failed to initialize:", error)
    return false
  }
}

export function ClarityProvider({ children }: { children: ReactNode }) {
  const [, setIsReady] = useState(false)

  useEffect(() => {
    const initialized = initClarity()
    setIsReady(initialized)
  }, [])

  return <>{children}</>
}

export function identifyClarity(userId: string, sessionId?: string, pageId?: string, friendlyName?: string) {
  if (typeof window === "undefined" || !clarityInitialized) return
  
  try {
    Clarity.identify(userId, sessionId, pageId, friendlyName)
  } catch (error) {
    console.error("[Clarity] Failed to identify:", error)
  }
}

export function setClarityTag(key: string, value: string | string[]) {
  if (typeof window === "undefined" || !clarityInitialized) return
  
  try {
    Clarity.setTag(key, value)
  } catch (error) {
    console.error("[Clarity] Failed to set tag:", error)
  }
}

export function trackClarityEvent(eventName: string) {
  if (typeof window === "undefined" || !clarityInitialized) return
  
  try {
    Clarity.event(eventName)
  } catch (error) {
    console.error("[Clarity] Failed to track event:", error)
  }
}
