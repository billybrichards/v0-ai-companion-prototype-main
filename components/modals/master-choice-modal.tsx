"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Building2, Heart, Sparkles, PenTool, ArrowRight, ArrowLeft } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"
import { usePathChoice } from "@/lib/path-choice-context"

type View = "main" | "individual"

interface MasterChoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MasterChoiceModal({ open, onOpenChange }: MasterChoiceModalProps) {
  const [view, setView] = useState<View>("main")
  const router = useRouter()
  const { setPathChoice } = usePathChoice()

  const handleBusinessClick = () => {
    setPathChoice("business")
    router.push("/business")
  }

  const handleIndividualClick = () => {
    setView("individual")
  }

  const handleCompanionsClick = () => {
    setPathChoice("companions")
    router.push("/companions")
  }

  const handleCreatorClick = () => {
    setPathChoice("create")
    router.push("/create")
  }

  const handleBack = () => {
    setView("main")
  }

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing - forces user to make a choice
    if (!newOpen) return
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-card border-border p-6 sm:p-8 rounded-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton
      >
        <VisuallyHidden>
          <DialogTitle>Choose Your Path</DialogTitle>
          <DialogDescription>Select how you want to use Anplexa</DialogDescription>
        </VisuallyHidden>

        {view === "main" ? (
          <div className="space-y-6">
            {/* Logo and Header */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-fit relative">
                <div className="absolute inset-0 blur-xl opacity-50">
                  <div className="h-12 w-12 rounded-full bg-primary" />
                </div>
                <AnplexaLogo size={48} className="relative drop-shadow-[0_0_12px_rgba(123,44,191,0.6)]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
                  Welcome to Anplexa
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to get started
                </p>
              </div>
            </div>

            {/* Main Choice Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBusinessClick}
                className="w-full h-14 text-base font-medium gradient-primary glow-hover text-white rounded-xl justify-between px-5 group"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5" />
                  <span>Business</span>
                </div>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={handleIndividualClick}
                className="w-full h-14 text-base font-medium gradient-primary glow-hover text-white rounded-xl justify-between px-5 group"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <span>Individual</span>
                </div>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button and Header */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <div className="text-center space-y-2">
                <div className="mx-auto w-fit relative">
                  <div className="absolute inset-0 blur-xl opacity-50">
                    <div className="h-12 w-12 rounded-full bg-primary" />
                  </div>
                  <AnplexaLogo size={48} className="relative drop-shadow-[0_0_12px_rgba(123,44,191,0.6)]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
                  Choose Your Experience
                </h2>
                <p className="text-sm text-muted-foreground">
                  What brings you to Anplexa?
                </p>
              </div>
            </div>

            {/* Individual Sub-options */}
            <div className="space-y-3">
              <Button
                onClick={handleCompanionsClick}
                className="w-full h-14 text-base font-medium gradient-primary glow-hover text-white rounded-xl justify-between px-5 group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  <span>I want to see companions</span>
                </div>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={handleCreatorClick}
                className="w-full h-14 text-base font-medium gradient-primary glow-hover text-white rounded-xl justify-between px-5 group"
              >
                <div className="flex items-center gap-3">
                  <PenTool className="h-5 w-5" />
                  <span>I am a creator</span>
                </div>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default MasterChoiceModal
