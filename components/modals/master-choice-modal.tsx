"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Building2, Heart, Sparkles, PenTool, ArrowRight, ArrowLeft } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"
import { usePathChoice } from "@/lib/path-choice-context"

type View = "main" | "individual"

interface MasterChoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sci-fi choice card component
function ChoiceCard({
  title,
  description,
  icon: Icon,
  imageUrl,
  gradientFrom,
  gradientTo,
  onClick,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  imageUrl: string
  gradientFrom: string
  gradientTo: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full h-[200px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(123,44,191,0.4)] focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-80 group-hover:opacity-70 transition-opacity duration-500`}
      />

      {/* Sci-fi Grid Lines */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(123,44,191,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(123,44,191,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 group-hover:border-primary/60 transition-all duration-500">
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
          boxShadow: 'inset 0 0 30px rgba(123,44,191,0.3)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div className="h-14 w-14 rounded-xl bg-primary/30 backdrop-blur-md border border-primary/40 flex items-center justify-center">
            <Icon className="h-7 w-7 text-white" />
          </div>
          <ArrowRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        </div>

        <div className="text-left">
          <h3 className="text-2xl font-heading font-semibold text-white mb-2 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm text-white/80 drop-shadow-md">
            {description}
          </p>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-primary/30 rounded-tr-2xl group-hover:border-primary/60 transition-all duration-500" />
      </div>
    </button>
  )
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
        className="sm:max-w-xl md:max-w-2xl bg-background/95 backdrop-blur-xl border-primary/20 p-6 sm:p-8 rounded-3xl shadow-[0_0_60px_rgba(123,44,191,0.2)]"
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
                <div className="absolute inset-0 blur-2xl opacity-60 animate-pulse">
                  <div className="h-16 w-16 rounded-full bg-primary" />
                </div>
                <AnplexaLogo size={64} className="relative drop-shadow-[0_0_20px_rgba(123,44,191,0.8)]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground">
                  Welcome to <span className="text-primary">Anplexa</span>
                </h2>
                <p className="text-muted-foreground">
                  Choose your path to begin
                </p>
              </div>
            </div>

            {/* Choice Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceCard
                title="Business"
                description="Enterprise LLM API & Conversational Dynamics"
                icon={Building2}
                imageUrl="/images/hooks/hook_img_04.png"
                gradientFrom="from-indigo-900/90"
                gradientTo="to-slate-900/90"
                onClick={handleBusinessClick}
              />
              <ChoiceCard
                title="Individual"
                description="Personal AI companions & creative tools"
                icon={Heart}
                imageUrl="/images/hooks/hook_img_08.png"
                gradientFrom="from-purple-900/90"
                gradientTo="to-pink-900/90"
                onClick={handleIndividualClick}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button and Header */}
            <div className="space-y-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back</span>
              </button>

              <div className="text-center space-y-2">
                <div className="mx-auto w-fit relative">
                  <div className="absolute inset-0 blur-2xl opacity-60 animate-pulse">
                    <div className="h-16 w-16 rounded-full bg-primary" />
                  </div>
                  <AnplexaLogo size={64} className="relative drop-shadow-[0_0_20px_rgba(123,44,191,0.8)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground">
                  Choose Your <span className="text-primary">Experience</span>
                </h2>
                <p className="text-muted-foreground">
                  What brings you to Anplexa?
                </p>
              </div>
            </div>

            {/* Individual Sub-options */}
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceCard
                title="Companions"
                description="Explore AI companions for conversation & connection"
                icon={Sparkles}
                imageUrl="/images/hooks/hook_img_12.png"
                gradientFrom="from-violet-900/90"
                gradientTo="to-fuchsia-900/90"
                onClick={handleCompanionsClick}
              />
              <ChoiceCard
                title="Creator"
                description="Build and monetize your own AI companions"
                icon={PenTool}
                imageUrl="/images/hooks/hook_img_16.png"
                gradientFrom="from-cyan-900/90"
                gradientTo="to-blue-900/90"
                onClick={handleCreatorClick}
              />
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </DialogContent>
    </Dialog>
  )
}

export default MasterChoiceModal
