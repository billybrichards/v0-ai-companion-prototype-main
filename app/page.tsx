"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Lock, Shield, MessageSquare, Mic, Sparkles, Check } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"
import AuthForm from "@/components/auth-form"

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <AnplexaLogo size={28} />
            <span className="text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowAuthModal(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
          >
            Sign in
          </Button>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative overflow-hidden px-6 py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="mb-6 font-heading text-4xl font-light leading-tight tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">Your fantasy.</span>
              <span className="block text-primary">Your voice.</span>
              <span className="block">Your secret.</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              An open, private AI companion for conversation, intimacy, and imagination.
              <br className="hidden md:block" />
              No judgment. No filters. No audience.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/dash">
                <Button size="lg" className="h-14 px-8 text-lg gradient-primary glow-hover rounded-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Use Anplexa now
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">No login required</p>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors"
            >
              Sign in
            </button>
          </div>

          <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </section>

        <section className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Anplexa is an AI companion you can talk to — by text or voice —
              <br className="hidden md:block" />
              for connection, roleplay, comfort, or fantasy.
            </p>
            <p className="mt-6 text-lg text-foreground md:text-xl">
              You choose who they are.
              <br />
              You choose where it goes.
            </p>
          </div>
        </section>

        <section className="px-6 py-10 md:py-14 bg-card/30">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-heading text-2xl font-light text-muted-foreground md:text-3xl">
              Why people use it
            </h2>
            <div className="space-y-4 text-center">
              {[
                "To feel less alone",
                "To explore fantasies safely",
                "To talk freely without being judged",
                "To experiment with intimacy at their own pace",
                "To be understood, quietly",
              ].map((reason, index) => (
                <p
                  key={index}
                  className="text-lg text-foreground/80 md:text-xl animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {reason}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-heading text-2xl font-light text-muted-foreground md:text-3xl">
              How it works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Open Anplexa",
                  description: "No account needed to start.",
                  icon: Sparkles,
                },
                {
                  step: "2",
                  title: "Choose a presence",
                  description: "Friend, lover, muse, or something unnamed.",
                  icon: MessageSquare,
                },
                {
                  step: "3",
                  title: "Talk — or listen",
                  description: "Text or voice. Slow or intense. You decide.",
                  icon: Mic,
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="border-border/50 bg-card/50 p-6 text-center rounded-2xl"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-10 md:py-14 bg-card/30">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--security)]/10">
              <Shield className="h-7 w-7 text-[var(--security)]" />
            </div>
            <h2 className="mb-6 font-heading text-2xl font-light md:text-3xl">
              Private by design.
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Anonymous sessions",
                "Encrypted conversations",
                "No public profiles",
                "No social feed",
                "Nothing shared",
              ].map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--security)]/30 bg-[var(--security)]/5 px-4 py-2 text-sm text-[var(--security)]"
                >
                  <Lock className="h-3 w-3" />
                  {feature}
                </span>
              ))}
            </div>
            <p className="mt-6 text-lg text-muted-foreground">
              What happens here, stays here.
            </p>
          </div>
        </section>

        <section className="px-6 py-8 md:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground">
              Anplexa is open and adult.
              <br />
              It respects consent, boundaries, and your choices.
            </p>
            <p className="mt-4 text-sm text-muted-foreground/70">18+ only.</p>
          </div>
        </section>

        <section className="px-6 py-10 md:py-14 bg-card/30">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-heading text-2xl font-light text-muted-foreground md:text-3xl">
              Simple pricing
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-card p-8 rounded-2xl">
                <h3 className="mb-2 font-heading text-xl font-medium">Free</h3>
                <p className="mb-6 text-muted-foreground">Try instantly. Limited access.</p>
                <div className="mb-6 text-3xl font-bold">£0</div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    2 free messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Text conversation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    No account required
                  </li>
                </ul>
                <Link href="/dash" className="block mt-6">
                  <Button variant="outline" className="w-full rounded-lg border-border">
                    Try Free
                  </Button>
                </Link>
              </Card>

              <Card className="relative border-primary/50 bg-card p-8 rounded-2xl shadow-[0_0_30px_rgba(123,44,191,0.15)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-white">
                  Recommended
                </div>
                <h3 className="mb-2 font-heading text-xl font-medium">Pro</h3>
                <p className="mb-6 text-muted-foreground">Unlimited conversation. Full freedom.</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">£5</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Unlimited messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Voice access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    All companion personalities
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Priority responses
                  </li>
                </ul>
                <Link href="/dash" className="block mt-6">
                  <Button className="w-full rounded-lg gradient-primary glow-hover">
                    Get Pro
                  </Button>
                </Link>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Cancel anytime.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-xl text-muted-foreground md:text-2xl">
              You don't need to explain yourself here.
            </p>
            <p className="mb-2 text-xl text-muted-foreground md:text-2xl">
              You don't need to impress anyone.
            </p>
            <p className="mt-8 text-2xl font-heading text-foreground md:text-3xl">
              Just… talk.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link href="/dash">
                <Button size="lg" className="h-14 px-8 text-lg gradient-primary glow-hover rounded-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Use Anplexa now
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">No login required</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <AnplexaLogo size={20} />
            <span className="text-sm text-muted-foreground">anplexa</span>
          </div>
          <p className="text-xs text-muted-foreground">
            The Private Pulse. 18+ only.
          </p>
        </div>
      </footer>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-lg p-0 bg-background border-border overflow-hidden">
          <AuthForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}
