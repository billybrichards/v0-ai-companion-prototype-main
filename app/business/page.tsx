"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Brain, Heart, Clock, Zap, ExternalLink } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

export default function BusinessPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Conversational AI, Reimagined
          </p>

          <h1 className="mb-8 font-heading text-fluid-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
            Anplexa doesn't just respond to what you say.{" "}
            <span className="text-primary font-medium">
              It remembers how you felt when you said it.
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-xl md:text-2xl text-muted-foreground font-light">
            AI that feels the conversation, not just processes it.
          </p>

          <p className="mb-12 text-lg text-muted-foreground/80">
            Powered by <span className="text-foreground font-medium">Conversational Dynamics</span>
          </p>

          <Link href="/business/contact">
            <Button size="lg" className="h-14 px-10 text-lg gradient-primary glow-hover rounded-full">
              Request Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-border/50 bg-card/30 px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-sm uppercase tracking-[0.15em] text-muted-foreground">
            Trusted by innovative teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <span className="text-lg font-medium text-foreground/70 hover:text-foreground transition-colors">pmuAI</span>
            <span className="text-lg font-medium text-foreground/70 hover:text-foreground transition-colors">PMU Elite Academy</span>
            <span className="text-lg font-medium text-foreground/70 hover:text-foreground transition-colors">Beauty Business AI</span>
            <span className="text-lg font-medium text-foreground/70 hover:text-foreground transition-colors">Anplexa Companions</span>
          </div>
        </div>
      </section>

      {/* Conversational Dynamics Section */}
      <section className="px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-heading text-3xl md:text-4xl font-light">
              Conversational Dynamics
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A fundamentally different approach to AI conversation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-medium">Emotional Persistence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Context isn't just remembered - it's felt. Emotional undertones persist across conversations, creating genuine continuity.
              </p>
            </Card>

            <Card className="border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-medium">Cascade Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ideas and emotions ripple through interactions, building meaning over time rather than resetting with each message.
              </p>
            </Card>

            <Card className="border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-medium">Multi-Timescale Memory</h3>
              <p className="text-muted-foreground leading-relaxed">
                Short-term reactivity meets long-term understanding. Your AI companion learns across seconds, days, and months.
              </p>
            </Card>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <blockquote className="relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-primary/20 font-serif">"</div>
              <p className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed pt-8">
                The architecture emerged from studying biological cascades at Oxford -
                how signals propagate through neural networks with temporal depth and emotional weight.
              </p>
              <footer className="mt-6 text-sm text-muted-foreground/70">
                - Origin of Conversational Dynamics
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section id="use-cases" className="px-4 sm:px-6 py-20 md:py-28 bg-card/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-heading text-3xl md:text-4xl font-light">
              Deployed Across Industries
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              See how leading organizations leverage Conversational Dynamics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="group border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Brain className="h-6 w-6" />
                  </div>
                  <a
                    href="https://pmuelite.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <h3 className="mb-2 font-heading text-xl font-medium">pmuAI</h3>
                <p className="mb-3 text-sm text-primary">PMU Elite Academy</p>
                <p className="text-muted-foreground">
                  AI-powered training and consultation platform for permanent makeup professionals,
                  delivering personalized learning experiences through dynamic conversation.
                </p>
                <p className="mt-4 text-sm text-muted-foreground/70">pmuelite.com</p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Brain className="h-6 w-6" />
                  </div>
                  <a
                    href="https://v0-pmu-elite-academy-spa.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <h3 className="mb-2 font-heading text-xl font-medium">Beauty Business AI</h3>
                <p className="mb-3 text-sm text-primary">Spa & Wellness Intelligence</p>
                <p className="text-muted-foreground">
                  Intelligent business companion for beauty and wellness entrepreneurs,
                  providing real-time guidance and emotionally-aware support.
                </p>
                <p className="mt-4 text-sm text-muted-foreground/70">v0-pmu-elite-academy-spa.vercel.app</p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Brain className="h-6 w-6" />
                  </div>
                  <a
                    href="https://pmuai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <h3 className="mb-2 font-heading text-xl font-medium">pmuai.com</h3>
                <p className="mb-3 text-sm text-primary">Industry-Leading AI Platform</p>
                <p className="text-muted-foreground">
                  The flagship platform showcasing Conversational Dynamics in action,
                  with specialized AI assistants for professional services.
                </p>
                <p className="mt-4 text-sm text-muted-foreground/70">pmuai.com</p>
              </CardContent>
            </Card>

            <Card className="group border-border/50 bg-card/50 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-2 font-heading text-xl font-medium">Anplexa Companions</h3>
                <p className="mb-3 text-sm text-primary">Consumer AI Companion</p>
                <p className="text-muted-foreground">
                  Personal AI companions with emotional depth and memory,
                  providing meaningful connection through Conversational Dynamics technology.
                </p>
                <p className="mt-4 text-sm text-muted-foreground/70">anplexa.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Attribution Section */}
      <section className="px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <p className="text-muted-foreground/70 uppercase tracking-[0.15em] text-sm mb-2">Leadership</p>
            <h2 className="font-heading text-2xl md:text-3xl font-light mb-8">
              Designed and architected by{" "}
              <span className="text-foreground font-medium">Billy Richards</span>
            </h2>
          </div>

          <div className="border-t border-border/50 pt-12">
            <p className="text-muted-foreground/70 uppercase tracking-[0.15em] text-sm mb-2">Engineering</p>
            <h3 className="font-heading text-xl md:text-2xl font-light text-muted-foreground">
              Built by{" "}
              <span className="text-foreground font-medium">Brantingham Engineering</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 py-24 md:py-32 bg-gradient-to-b from-card/30 to-card/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-3xl md:text-4xl font-light">
            Ready to transform your AI experience?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Discover how Conversational Dynamics can revolutionize engagement for your business.
          </p>
          <Link href="/business/contact">
            <Button size="lg" className="h-14 px-12 text-lg gradient-primary glow-hover rounded-full">
              Request Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
