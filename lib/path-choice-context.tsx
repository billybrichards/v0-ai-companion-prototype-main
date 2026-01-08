"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type PathChoice = "business" | "companions" | "create" | null

interface StoredPathChoice {
  choice: PathChoice
  expiresAt: number
}

interface PathChoiceContextType {
  pathChoice: PathChoice
  isLoading: boolean
  setPathChoice: (choice: PathChoice) => void
  clearPathChoice: () => void
  hasChosenPath: () => boolean
}

const PathChoiceContext = createContext<PathChoiceContextType | null>(null)

const STORAGE_KEY = "anplexa_path_choice"
const EXPIRY_DAYS = 30
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000

export function PathChoiceProvider({ children }: { children: ReactNode }) {
  const [pathChoice, setPathChoiceState] = useState<PathChoice>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load path choice from localStorage on mount
  useEffect(() => {
    // SSR guard - localStorage only available on client
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const storedData = localStorage.getItem(STORAGE_KEY)

      if (storedData) {
        const parsed: StoredPathChoice = JSON.parse(storedData)

        // Check if the stored choice has expired
        if (parsed.expiresAt > Date.now()) {
          setPathChoiceState(parsed.choice)
        } else {
          // Expired, clear it
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) or invalid data
      // Fail silently and continue with default state
    }

    setIsLoading(false)
  }, [])

  const setPathChoice = (choice: PathChoice) => {
    setPathChoiceState(choice)

    try {
      if (choice) {
        const storedData: StoredPathChoice = {
          choice,
          expiresAt: Date.now() + EXPIRY_MS,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage unavailable - state still updates in memory
    }
  }

  const clearPathChoice = () => {
    setPathChoiceState(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable - state still updates in memory
    }
  }

  const hasChosenPath = (): boolean => {
    return pathChoice !== null
  }

  return (
    <PathChoiceContext.Provider
      value={{
        pathChoice,
        isLoading,
        setPathChoice,
        clearPathChoice,
        hasChosenPath,
      }}
    >
      {children}
    </PathChoiceContext.Provider>
  )
}

export function usePathChoice() {
  const context = useContext(PathChoiceContext)
  if (!context) {
    throw new Error("usePathChoice must be used within a PathChoiceProvider")
  }
  return context
}
