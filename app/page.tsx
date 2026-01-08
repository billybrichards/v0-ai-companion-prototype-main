"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { usePathChoice } from "@/lib/path-choice-context"
import { Building2, Heart, Sparkles, PenTool, ArrowRight, ArrowLeft } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

type View = "main" | "individual"

// Full-screen choice card component
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
      className="group relative flex-1 min-h-[50vh] md:min-h-screen overflow-hidden transition-all duration-700 hover:flex-[1.2] focus:outline-none"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="50vw"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-85 group-hover:opacity-75 transition-opacity duration-700`}
      />

      {/* Sci-fi Grid Lines */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(123,44,191,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(123,44,191,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
        boxShadow: 'inset 0 0 100px rgba(123,44,191,0.3)'
      }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 md:p-12">
        {/* Icon */}
        <div className="mb-6 md:mb-8 h-20 w-20 md:h-28 md:w-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
          <Icon className="h-10 w-10 md:h-14 md:w-14 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 drop-shadow-lg text-center">
          {title}
        </h2>

        {/* Description */}
        <p className="text-base md:text-xl text-white/80 max-w-md text-center mb-6 md:mb-8 drop-shadow-md">
          {description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors duration-300">
          <span className="text-sm md:text-base font-medium">Enter</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
        </div>

        {/* Corner Accents */}
        <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-primary animate-pulse" />
        <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-white/30" />
      </div>

      {/* Divider Line (visible on desktop) */}
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-px bg-white/10 group-hover:bg-primary/30 transition-colors duration-500" />
    </button>
  )
}

export default function RootPage() {
  const router = useRouter()
  const { pathChoice, isLoading, setPathChoice } = usePathChoice()
  const [view, setView] = useState<View>("main")

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
    }
  }, [pathChoice, isLoading, router])

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

  // Full-screen choice page
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Logo Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background/30 backdrop-blur-xl border border-white/10 pointer-events-auto">
          <div className="relative">
            <div className="absolute inset-0 blur-lg opacity-60">
              <div className="h-8 w-8 rounded-full bg-primary" />
            </div>
            <AnplexaLogo size={32} className="relative drop-shadow-[0_0_12px_rgba(123,44,191,0.8)]" />
          </div>
          <span className="text-lg font-heading font-light tracking-wide lowercase text-white">
            anplexa
          </span>
        </div>
      </div>

      {view === "main" ? (
        /* Main View: Business | Individual */
        <div className="flex flex-col md:flex-row min-h-[100dvh]">
          <ChoiceCard
            title="Business"
            description="Enterprise LLM API & Conversational Dynamics for your applications"
            icon={Building2}
            imageUrl="/images/hooks/hook_img_04.png"
            gradientFrom="from-indigo-950/95"
            gradientTo="to-slate-950/95"
            onClick={handleBusinessClick}
          />
          <ChoiceCard
            title="Individual"
            description="Personal AI companions & creative tools for connection"
            icon={Heart}
            imageUrl="/images/hooks/hook_img_08.png"
            gradientFrom="from-purple-950/95"
            gradientTo="to-pink-950/95"
            onClick={handleIndividualClick}
          />
        </div>
      ) : (
        /* Individual View: Companions | Creator */
        <div className="min-h-[100dvh]">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/30 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white hover:bg-background/50 transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row min-h-[100dvh]">
            <ChoiceCard
              title="Companions"
              description="Explore AI companions for conversation, connection & imagination"
              icon={Sparkles}
              imageUrl="/images/hooks/hook_img_12.png"
              gradientFrom="from-violet-950/95"
              gradientTo="to-fuchsia-950/95"
              onClick={handleCompanionsClick}
            />
            <ChoiceCard
              title="Creator"
              description="Build and monetize your own AI companions"
              icon={PenTool}
              imageUrl="/images/hooks/hook_img_16.png"
              gradientFrom="from-cyan-950/95"
              gradientTo="to-blue-950/95"
              onClick={handleCreatorClick}
            />
          </div>
        </div>
      )}
    </div>
  )
}
