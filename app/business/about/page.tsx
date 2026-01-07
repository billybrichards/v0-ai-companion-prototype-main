"use client"

import { Card } from "@/components/ui/card"
import { Shield, GraduationCap, Dna } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Our Story
          </p>
          <h1 className="mb-6 font-heading text-fluid-4xl font-light">
            The House of Brantingham
          </h1>
          <p className="text-lg text-muted-foreground">
            Where ancient wisdom meets artificial intelligence
          </p>
        </div>
      </section>

      {/* Brantingham Origins */}
      <section className="px-4 sm:px-6 py-16 md:py-24 bg-card/20">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-10 w-10" />
            </div>
          </div>

          <div className="prose prose-invert prose-lg mx-auto text-center">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              In the annals of the Treasury of England, one name emerges from the fog of medieval bureaucracy
              with unusual clarity: <span className="text-foreground font-medium">Thomas de Brantingham</span>.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Serving as Lord High Treasurer to Edward III in the 14th century, Brantingham administered
              the finances of a kingdom during one of its most transformative eras. He understood something
              fundamental: that the flow of resources through complex systems follows patterns - patterns
              that, once understood, could be orchestrated for remarkable outcomes.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Seven centuries later, <span className="text-foreground font-medium">Brantingham Engineering</span> carries
              forward this legacy. Not of treasury ledgers and royal coffers, but of a different kind of flow -
              the flow of conversation, of emotional data, of human connection through digital interfaces.
            </p>

            <blockquote className="border-l-2 border-primary pl-6 my-12 text-left">
              <p className="text-xl italic text-muted-foreground">
                "Where Brantingham once traced the movement of gold through a kingdom,
                we now trace the movement of meaning through conversation."
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Modern Team */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-primary">
                Present Day
              </p>
            </div>
            <h2 className="mb-4 font-heading text-3xl md:text-4xl font-light">
              Oxford University LLM Engineers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              A team continuing the legacy of understanding complex systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 p-8 rounded-2xl text-center">
              <div className="mb-4 text-4xl font-light text-primary">15+</div>
              <p className="text-muted-foreground">Research Publications</p>
            </Card>
            <Card className="border-border/50 bg-card/50 p-8 rounded-2xl text-center">
              <div className="mb-4 text-4xl font-light text-primary">Oxford</div>
              <p className="text-muted-foreground">Research Partnership</p>
            </Card>
            <Card className="border-border/50 bg-card/50 p-8 rounded-2xl text-center">
              <div className="mb-4 text-4xl font-light text-primary">2024</div>
              <p className="text-muted-foreground">Founded</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="px-4 sm:px-6 py-16 md:py-24 bg-card/20">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Dna className="h-10 w-10" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-8 font-heading text-3xl md:text-4xl font-light">
              The Origin
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                The founder spent years building mathematical models of how cells behave over time —
                predicting biological cascades at Oxford.
              </p>

              <p>
                Cells communicate. They signal, respond, and adapt. They remember past interactions
                and anticipate future ones. They exist in a constant state of dynamic conversation
                with their environment.
              </p>

              <p className="text-xl text-foreground font-medium py-4">
                Then came the insight: conversations are biological systems too.
              </p>

              <p>
                Human dialogue follows the same cascading patterns. Each exchange triggers responses,
                builds context, and shapes the trajectory of what comes next. The same mathematics
                that predicts cellular response can model emotional dynamics.
              </p>

              <p className="text-primary font-medium">
                Anplexa was born from this collision of computational biochemistry and artificial intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
