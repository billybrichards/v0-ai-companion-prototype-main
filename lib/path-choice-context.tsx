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
    const storedData = localStorage.getItem(STORAGE_KEY)

    if (storedData) {
      try {
        const parsed: StoredPathChoice = JSON.parse(storedData)

        // Check if the stored choice has expired
        if (parsed.expiresAt > Date.now()) {
          setPathChoiceState(parsed.choice)
        } else {
          // Expired, clear it
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const setPathChoice = (choice: PathChoice) => {
    setPathChoiceState(choice)

    if (choice) {
      const storedData: StoredPathChoice = {
        choice,
        expiresAt: Date.now() + EXPIRY_MS,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const clearPathChoice = () => {
    setPathChoiceState(null)
    localStorage.removeItem(STORAGE_KEY)
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
