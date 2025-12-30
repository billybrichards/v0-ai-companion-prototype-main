"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AnplexaLogo from "@/components/anplexa-logo"
import Link from "next/link"
import { ArrowLeft, Check, Crown, Lock, MessageSquare, Sparkles } from "lucide-react"

export default function StyleGuidePage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4" />
              <AnplexaLogo size={24} />
              <span className="text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
            </Link>
          </div>
          <span className="text-sm text-muted-foreground">Design System</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-4">
          <AnplexaLogo size={64} className="mx-auto animate-pulse-glow" />
          <h1 className="text-4xl md:text-5xl font-heading font-light">Anplexa Design System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A luxury, intimate aesthetic for private AI companionship. 
            Dark, warm, and judgment-free.
          </p>
        </section>

        {/* Brand Values */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Brand Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Private", description: "Everything stays between you and your companion. No tracking, no judgment." },
              { title: "Intimate", description: "Warm, personal, and deeply connected experiences." },
              { title: "Luxurious", description: "Premium feel with elegant, refined design choices." },
            ].map((value) => (
              <Card key={value.title} className="p-6 border-border/50 bg-card/50">
                <h3 className="font-heading text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Anplexa Purple", value: "#7B2CBF", var: "--primary", className: "bg-primary" },
              { name: "Midnight Void", value: "#121212", var: "--background", className: "bg-background border border-border" },
              { name: "Ghost Silver", value: "#E0E1DD", var: "--foreground", className: "bg-foreground" },
              { name: "Security Green", value: "#27ae60", var: "--security", className: "bg-[var(--security)]" },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-24 rounded-xl ${color.className}`} />
                <div>
                  <p className="font-medium text-sm">{color.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.value}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.var}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-heading mb-4">Gradients & Effects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-xl gradient-primary" />
                <p className="text-sm font-medium">Primary Gradient</p>
                <p className="text-xs text-muted-foreground font-mono">.gradient-primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-xl gradient-primary glow" />
                <p className="text-sm font-medium">Glow Effect</p>
                <p className="text-xs text-muted-foreground font-mono">.glow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Typography</h2>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-heading">Headings — Montserrat</h3>
              <div className="space-y-2 border-l-2 border-primary pl-4">
                <p className="text-5xl font-heading font-light">Display Large</p>
                <p className="text-4xl font-heading font-light">Heading 1</p>
                <p className="text-3xl font-heading font-light">Heading 2</p>
                <p className="text-2xl font-heading font-light">Heading 3</p>
                <p className="text-xl font-heading font-medium">Heading 4</p>
                <p className="text-lg font-heading font-medium">Heading 5</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-heading">Body — Inter</h3>
              <div className="space-y-2 border-l-2 border-muted pl-4">
                <p className="text-xl">Body Large — For hero text and introductions</p>
                <p className="text-base">Body Regular — Primary body text for content</p>
                <p className="text-sm text-muted-foreground">Body Small — Secondary information and captions</p>
                <p className="text-xs text-muted-foreground">Caption — Fine print and metadata</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-heading">Monospace — Fira Code</h3>
              <div className="space-y-2 border-l-2 border-muted pl-4">
                <p className="font-mono text-sm">font-mono: For code and technical content</p>
                <p className="font-mono text-xs text-muted-foreground">Used in color values, variable names, etc.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Logo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Logo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="p-8 flex items-center justify-center bg-card/50 border-border/50">
              <AnplexaLogo size={48} />
            </Card>
            <Card className="p-8 flex items-center justify-center bg-card/50 border-border/50">
              <AnplexaLogo size={32} />
            </Card>
            <Card className="p-8 flex items-center justify-center bg-card/50 border-border/50">
              <AnplexaLogo size={24} />
            </Card>
            <Card className="p-8 flex items-center justify-center bg-card/50 border-border/50">
              <AnplexaLogo size={16} />
            </Card>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <AnplexaLogo size={24} />
              <span className="text-xl font-heading font-light tracking-wide lowercase">anplexa</span>
            </div>
            <p className="text-sm text-muted-foreground">Logo + Wordmark (lowercase, light weight)</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Buttons</h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-heading">Primary Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="gradient-primary glow-hover rounded-full px-6">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Primary CTA
                </Button>
                <Button className="gradient-primary glow-hover rounded-xl px-6">
                  Rounded XL
                </Button>
                <Button className="gradient-primary glow-hover rounded-lg px-6">
                  Rounded LG
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-heading">Secondary Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-full px-6">
                  Outline Primary
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10">
                  Ghost
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-heading">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="gradient-primary" disabled>Disabled</Button>
                <Button className="gradient-primary glow">With Glow</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-heading">Inputs</h3>
              <Input 
                placeholder="Default input" 
                className="border-border bg-background rounded-xl focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)]"
              />
              <Input 
                placeholder="With value" 
                value="user@example.com"
                readOnly
                className="border-border bg-background rounded-xl"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-heading">Textarea</h3>
              <Textarea 
                placeholder="Type your message..." 
                className="border-border bg-background rounded-xl focus:border-primary focus:shadow-[0_0_8px_rgba(123,44,191,0.3)] min-h-[100px]"
              />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-border/50 bg-card/50 rounded-2xl">
              <h3 className="font-heading text-lg mb-2">Standard Card</h3>
              <p className="text-sm text-muted-foreground">Basic card with subtle border and semi-transparent background.</p>
            </Card>
            <Card className="p-6 border-border/50 bg-card/50 rounded-2xl shadow-[var(--shadow-card)]">
              <h3 className="font-heading text-lg mb-2">Elevated Card</h3>
              <p className="text-sm text-muted-foreground">With purple glow shadow for emphasis.</p>
            </Card>
            <Card className="p-6 border-primary/50 bg-card/50 rounded-2xl hover:border-primary transition-colors">
              <h3 className="font-heading text-lg mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">Hover to see the border highlight effect.</p>
            </Card>
          </div>
        </section>

        {/* Badges & Tags */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Badges & Tags</h2>
          <div className="flex flex-wrap gap-4">
            <span className="rounded-full bg-primary/20 border border-primary/50 px-3 py-1 text-xs font-medium text-primary">
              BETA
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary/20 border border-primary/50 px-3 py-1 text-xs font-medium text-primary glow">
              <Crown className="h-3 w-3" />
              PRO
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--security)]/30 bg-[var(--security)]/5 px-4 py-2 text-sm text-[var(--security)]">
              <Lock className="h-3 w-3" />
              Encrypted
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Check className="h-3 w-3" />
              Feature Tag
            </span>
          </div>
        </section>

        {/* Message Bubbles */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Message Bubbles</h2>
          <div className="max-w-2xl space-y-4">
            <div className="flex justify-start gap-2">
              <AnplexaLogo size={24} className="shrink-0 mt-1 drop-shadow-[0_0_6px_rgba(123,44,191,0.4)]" />
              <div className="max-w-[80%] rounded-2xl bg-muted border-l-[3px] border-l-primary px-4 py-3">
                <p className="text-sm leading-relaxed">
                  Hey there... I've been waiting for you. 💜 This is how assistant messages appear, with the Anplexa logo and a purple accent border.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl bg-secondary px-4 py-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is a user message. It appears on the right with a secondary background color.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">Spacing Scale</h2>
          <div className="space-y-4">
            {[
              { name: "xs", value: "4px", class: "w-1" },
              { name: "sm", value: "8px", class: "w-2" },
              { name: "md", value: "16px", class: "w-4" },
              { name: "lg", value: "24px", class: "w-6" },
              { name: "xl", value: "32px", class: "w-8" },
              { name: "2xl", value: "48px", class: "w-12" },
              { name: "3xl", value: "64px", class: "w-16" },
            ].map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <div className={`h-4 bg-primary rounded ${space.class}`} />
                <span className="text-sm font-mono w-12">{space.name}</span>
                <span className="text-sm text-muted-foreground">{space.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CSS Variables Reference */}
        <section className="space-y-6">
          <h2 className="text-2xl font-heading font-light text-muted-foreground">CSS Variables</h2>
          <Card className="p-6 border-border/50 bg-card/30 rounded-2xl overflow-auto">
            <pre className="text-xs font-mono text-muted-foreground">
{`:root {
  --primary: #7B2CBF;
  --background: #121212;
  --foreground: #E0E1DD;
  --card: #1a1a1a;
  --muted: #2a2a2a;
  --muted-foreground: #9CA3AF;
  --border: #333333;
  --security: #27ae60;
  
  --shadow-card: 0 0 20px rgba(123, 44, 191, 0.1);
  --shadow-glow: 0 0 30px rgba(123, 44, 191, 0.3);
  
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;
}`}
            </pre>
          </Card>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-8 border-t border-border/50 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AnplexaLogo size={20} />
            <span className="font-heading font-light lowercase">anplexa</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Design System v1.0 • The Private Pulse
          </p>
        </footer>
      </main>
    </div>
  )
}
