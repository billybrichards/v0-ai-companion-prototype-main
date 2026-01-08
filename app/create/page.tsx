"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PenTool, DollarSign, BarChart3, ArrowLeft, Check } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

export default function CreatorComingSoonPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // TODO: Implement actual email collection API (e.g., /api/waitlist or integrate with email service)
  // Currently this is a placeholder that simulates submission but doesn't store the email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulated delay - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  const features = [
    {
      icon: PenTool,
      title: "Create Characters",
      description: "Design unique AI companions with custom personalities and backstories."
    },
    {
      icon: DollarSign,
      title: "Monetize",
      description: "Earn revenue when users interact with your creations."
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track engagement and earnings with detailed dashboards."
    }
  ]

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <AnplexaLogo size={24} className="sm:w-7 sm:h-7" />
            <span className="text-base sm:text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
          </div>
          <Link href="/companions">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 h-9 sm:h-10 px-3 sm:px-4 text-sm min-touch-target flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Companions</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Glowing Icon */}
            <div className="relative inline-flex mb-6 sm:mb-8">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full gradient-primary glow flex items-center justify-center">
                <PenTool className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">Coming Q2 2025</span>
            </div>

            {/* Headline */}
            <h1 className="mb-4 sm:mb-6 font-heading text-fluid-4xl font-light leading-tight tracking-tight">
              <span className="block">Create and Build</span>
              <span className="block text-primary">with Anplexa</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              Design, train, and monetize your own AI companions.
              Build characters that connect with users worldwide.
            </p>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-12 sm:mb-16">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/50 bg-card/50 overflow-hidden rounded-xl sm:rounded-2xl group hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="mb-2 font-heading text-base sm:text-lg font-medium">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Email Waitlist Signup */}
          <div className="mx-auto max-w-md text-center">
            <Card className="border-border/50 bg-card/50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <CardContent className="p-0">
                {isSubmitted ? (
                  <div className="animate-fade-in">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-heading text-lg sm:text-xl font-medium">You're on the list!</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll notify you at <span className="text-foreground font-medium">{email}</span> when Creator launches.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="mb-2 font-heading text-lg sm:text-xl font-medium">Get early access</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Be the first to know when we launch the Creator program.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 sm:h-12 bg-background/50 border-border/50 focus:border-primary"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full h-11 sm:h-12 gradient-primary glow-hover rounded-lg text-sm sm:text-base min-touch-target"
                      >
                        {isLoading ? "Joining..." : "Notify Me"}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Back Link */}
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/companions"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-touch-target py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companions
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
