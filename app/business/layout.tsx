import Link from "next/link"
import AnplexaLogo from "@/components/anplexa-logo"
import { Button } from "@/components/ui/button"

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Logo + Badge */}
          <Link href="/business" className="flex items-center gap-2">
            <AnplexaLogo size={24} className="sm:w-7 sm:h-7" />
            <span className="text-base sm:text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
            <span className="rounded-full bg-[var(--security)]/20 border border-[var(--security)]/50 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-[var(--security)]">
              for Business
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#use-cases"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Use Cases
            </Link>
            <Link
              href="/business/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/business/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/companions">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-primary/10 h-9 sm:h-10 px-3 sm:px-4 text-sm min-touch-target"
              >
                For Individuals
              </Button>
            </Link>
            <Link href="/business/contact">
              <Button
                className="gradient-primary glow-hover h-9 sm:h-10 px-3 sm:px-4 text-sm min-touch-target rounded-full"
              >
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 sm:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 safe-bottom">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid gap-8 sm:gap-12 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
            {/* Logo Column */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <Link href="/business" className="flex items-center gap-2 mb-4">
                <AnplexaLogo size={28} />
                <span className="text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
              </Link>
              <p className="text-xs text-muted-foreground max-w-xs">
                Enterprise AI companion solutions powered by Conversational Dynamics.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#use-cases" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    Use Cases
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/business/about" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/business/contact" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 sm:mt-14 pt-6 border-t border-border/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <span className="font-medium">Built by Brantingham Engineering</span>
                <span className="hidden sm:inline text-muted-foreground/50">|</span>
                <span>Oxford, UK</span>
              </div>
              <p className="text-xs text-muted-foreground/60">
                2025 Anplexa. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
