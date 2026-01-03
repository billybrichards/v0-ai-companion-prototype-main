"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Lock, Shield, MessageSquare, Mic, Sparkles, Check, Crown, User, Image, Video, Headphones } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"
import AuthForm from "@/components/auth-form"
import { useAuth } from "@/lib/auth-context"
import dynamic from "next/dynamic"
const PhoneMockup = dynamic(() => import("@/components/phone-mockup"), { ssr: false })

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [upgradeIntent, setUpgradeIntent] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleGoProClick = () => {
    if (user) {
      router.push("/dash?upgrade=true")
    } else {
      setUpgradeIntent(true)
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    if (upgradeIntent) {
      router.push("/dash?upgrade=true")
      setUpgradeIntent(false)
    } else {
      router.push("/dash")
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <AnplexaLogo size={24} className="sm:w-7 sm:h-7" />
            <span className="text-base sm:text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
            <span className="rounded-full bg-primary/20 border border-primary/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">BETA</span>
          </div>
          {user ? (
            <Link href="/dash">
              <Button
                variant="ghost"
                className="text-foreground hover:bg-primary/10 h-9 sm:h-10 px-3 sm:px-4 text-sm min-touch-target flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.displayName || user.email?.split("@")[0] || "Dashboard"}</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-primary/10 h-9 sm:h-10 px-3 sm:px-4 text-sm min-touch-target"
              >
                Sign in
              </Button>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="gradient-primary glow-hover h-9 sm:h-10 px-3 sm:px-4 text-sm min-touch-target rounded-full"
              >
                Create account
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="pt-16 sm:pt-20">
        <section className="relative overflow-hidden px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-4 sm:mb-6 font-heading text-fluid-4xl font-light leading-tight tracking-tight">
                  <span className="block">Your fantasy.</span>
                  <span className="block text-primary">Your voice.</span>
                  <span className="block">Your secret.</span>
                </h1>
                
                <p className="mx-auto md:mx-0 mb-8 sm:mb-10 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground px-2 md:px-0">
                  An open, private AI companion for conversation, intimacy, and imagination.
                  <br className="hidden md:block" />
                  No judgment. No filters. No audience.
                </p>

                <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row md:justify-start sm:justify-center">
                  <Link href="/dash" className="w-full sm:w-auto">
                    <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg gradient-primary glow-hover rounded-full w-full sm:w-auto min-touch-target">
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Use Anplexa now
                    </Button>
                  </Link>
                  <p className="text-xs sm:text-sm text-muted-foreground">No login required</p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-xs sm:text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors min-touch-target py-2"
                  >
                    Sign in
                  </button>
                  <span className="text-muted-foreground/50">•</span>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-xs sm:text-sm text-primary underline-offset-4 hover:underline transition-colors min-touch-target py-2 font-medium"
                  >
                    Create account
                  </button>
                </div>
              </div>

              <div className="hidden md:block flex-shrink-0 mt-10 md:mt-0">
                <PhoneMockup 
                  images={["/images/companion-1.png", "/images/companion-2.png"]}
                  interval={6000}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground">
              Anplexa is an AI companion you can talk to — by text or voice —
              <br className="hidden md:block" />
              for connection, roleplay, comfort, or fantasy.
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground">
              You choose who they are.
              <br />
              You choose where it goes.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10 md:py-14 bg-card/30">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 sm:mb-8 text-center font-heading text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground">
              Why people use it
            </h2>
            <div className="space-y-3 sm:space-y-4 text-center">
              {[
                "To feel less alone",
                "To explore fantasies safely",
                "To talk freely without being judged",
                "To experiment with intimacy at their own pace",
                "To be understood, quietly",
              ].map((reason, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg md:text-xl text-foreground/80 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {reason}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10 md:py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 sm:mb-8 text-center font-heading text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground">
              How it works
            </h2>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Open Anplexa",
                  description: "No account needed to start.",
                  icon: Sparkles,
                  image: "/images/how-it-works-1.png",
                },
                {
                  step: "2",
                  title: "Choose a presence",
                  description: "Friend, lover, muse, or something unnamed.",
                  icon: MessageSquare,
                  image: "/images/how-it-works-2.png",
                },
                {
                  step: "3",
                  title: "Talk — or listen",
                  description: "Text or voice. Slow or intense. You decide.",
                  icon: Mic,
                  image: "/images/how-it-works-3.png",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="border-border/50 bg-card/50 overflow-hidden rounded-xl sm:rounded-2xl group hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 text-center">
                    <h3 className="mb-1.5 sm:mb-2 font-heading text-base sm:text-lg font-medium">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Coming Soon</span>
            </div>
            <h2 className="mb-4 sm:mb-6 font-heading text-xl sm:text-2xl md:text-3xl font-light">
              More ways to connect
            </h2>
            <p className="mb-6 sm:mb-8 text-muted-foreground text-sm sm:text-base">
              We're building new experiences to deepen your connection
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { icon: Image, label: "Image Generation", description: "Visual experiences" },
                { icon: Video, label: "Video Chat", description: "Face-to-face moments" },
                { icon: Headphones, label: "Voice & Audio", description: "Intimate conversations" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-xl bg-card/50 border border-border/50 min-w-[120px] sm:min-w-[140px]"
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary/70" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10 md:py-14 bg-card/30">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 sm:mb-4 inline-flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[var(--security)]/10">
              <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-[var(--security)]" />
            </div>
            <h2 className="mb-4 sm:mb-6 font-heading text-xl sm:text-2xl md:text-3xl font-light">
              Private by design.
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {[
                "Anonymous sessions",
                "Encrypted conversations",
                "No public profiles",
                "No social feed",
                "Nothing shared",
              ].map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[var(--security)]/30 bg-[var(--security)]/5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[var(--security)]"
                >
                  <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {feature}
                </span>
              ))}
            </div>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground">
              What happens here, stays here.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-6 sm:py-8 md:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Anplexa is open and adult.
              <br />
              It respects consent, boundaries, and your choices.
            </p>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground/70">18+ only.</p>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-8 sm:py-10 md:py-14 bg-card/30">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 sm:mb-8 text-center font-heading text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground">
              Simple pricing
            </h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="border-border/50 bg-card p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
                <h3 className="mb-1.5 sm:mb-2 font-heading text-lg sm:text-xl font-medium">Free</h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">Try instantly. Limited access.</p>
                <div className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">£0</div>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    2 free messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    Text conversation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    No account required
                  </li>
                </ul>
                <Link href="/dash" className="block mt-4 sm:mt-6">
                  <Button variant="outline" className="w-full rounded-lg border-border h-10 sm:h-11 text-sm min-touch-target">
                    Try Free
                  </Button>
                </Link>
              </Card>

              <Card className="relative border-primary/50 bg-card p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-[0_0_30px_rgba(123,44,191,0.15)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-medium text-white whitespace-nowrap">
                  Recommended
                </div>
                <h3 className="mb-1.5 sm:mb-2 font-heading text-lg sm:text-xl font-medium">Pro</h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">Unlimited conversation. Full freedom.</p>
                <div className="mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl font-bold">£5</span>
                  <span className="text-sm sm:text-base text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    Unlimited messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    Voice access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    All companion personalities
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    Priority responses
                  </li>
                </ul>
                <Button 
                  onClick={handleGoProClick}
                  className="w-full mt-4 sm:mt-6 rounded-lg gradient-primary glow-hover h-10 sm:h-11 text-sm min-touch-target"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Get Pro
                </Button>
                <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-xs text-muted-foreground">
                  Cancel anytime.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-10 sm:py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-1.5 sm:mb-2 text-lg sm:text-xl md:text-2xl text-muted-foreground">
              You don't need to explain yourself here.
            </p>
            <p className="mb-1.5 sm:mb-2 text-lg sm:text-xl md:text-2xl text-muted-foreground">
              You don't need to impress anyone.
            </p>
            <p className="mt-6 sm:mt-8 text-xl sm:text-2xl md:text-3xl font-heading text-foreground">
              Just… talk.
            </p>

            <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4">
              <Link href="/dash" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg gradient-primary glow-hover rounded-full w-full sm:w-auto min-touch-target">
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Use Anplexa now
                </Button>
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground">No login required</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-xs sm:text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors min-touch-target py-2"
              >
                Sign in
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 px-4 sm:px-6 py-6 sm:py-8 safe-bottom">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <AnplexaLogo size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm text-muted-foreground">anplexa</span>
              <span className="text-sm ml-1" title="Made in the UK">🇬🇧</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] sm:text-xs text-muted-foreground">
              <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border/30">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground mb-3">Release Notes</p>
              <div className="space-y-2 text-[10px] sm:text-xs text-muted-foreground/70">
                <p><span className="text-primary">v1.2.0</span> - GDPR account settings, data export, privacy controls</p>
                <p><span className="text-primary">v1.1.0</span> - Mobile-first responsive design, fluid typography</p>
                <p><span className="text-primary">v1.0.0</span> - Launch with guest access, PRO subscriptions, streaming chat</p>
              </div>
              <p className="mt-6 text-[10px] sm:text-xs text-muted-foreground/50">
                © 2025 Anplexa. All rights reserved. 18+ only.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={showAuthModal} onOpenChange={(open) => {
        setShowAuthModal(open)
        if (!open) setUpgradeIntent(false)
      }}>
        <DialogContent className="sm:max-w-lg p-0 bg-background border-border overflow-hidden h-auto max-h-[90vh]">
          <VisuallyHidden>
            <DialogTitle>{upgradeIntent ? "Sign in to upgrade to Pro" : "Sign in to Anplexa"}</DialogTitle>
            <DialogDescription>Create an account or sign in to access your private AI companion.</DialogDescription>
          </VisuallyHidden>
          <AuthForm onSuccess={handleAuthSuccess} embedded />
        </DialogContent>
      </Dialog>
    </div>
  )
}
