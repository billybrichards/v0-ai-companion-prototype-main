"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePathChoice } from "@/lib/path-choice-context"
import { MasterChoiceModal } from "@/components/modals/master-choice-modal"
import AnplexaLogo from "@/components/anplexa-logo"

export default function RootPage() {
  const router = useRouter()
  const { pathChoice, isLoading } = usePathChoice()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (pathChoice) {
      // User has already chosen a path, redirect to saved path
      if (pathChoice === "business") {
        router.replace("/business")
      } else if (pathChoice === "companions") {
        router.replace("/companions")
      } else if (pathChoice === "create") {
        router.replace("/create")
      }
    } else {
      // No choice made, show the modal
      setShowModal(true)
    }
  }, [pathChoice, isLoading, router])

  // Loading state while checking path choice
  if (isLoading || pathChoice) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Animated Anplexa logo with pulse-glow effect */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl opacity-50 animate-pulse-glow">
              <div className="h-16 w-16 rounded-full bg-primary" />
            </div>
            <AnplexaLogo
              size={64}
              className="relative animate-pulse-glow drop-shadow-[0_0_20px_rgba(123,44,191,0.5)]"
            />
          </div>

          {/* anplexa text below logo */}
          <span className="text-lg font-heading font-light tracking-wide lowercase text-foreground">
            anplexa
          </span>
        </div>
      </div>
    )
  }

  // Show modal when no path has been chosen
  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center">
      <MasterChoiceModal
        open={showModal}
        onOpenChange={setShowModal}
      />
    </div>
  )
}
