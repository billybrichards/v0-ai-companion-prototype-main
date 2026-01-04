"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  content: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <AnplexaLogo size={24} className="sm:w-7 sm:h-7" />
              <span className="text-base sm:text-lg font-heading font-light tracking-wide lowercase">anplexa</span>
            </Link>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 font-heading text-3xl sm:text-4xl font-light text-center">Testimonials</h1>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {testimonials.map((t) => (
                <Card key={t.id} className="p-6 bg-card/50 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-sm text-muted-foreground">in {t.location}</span>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{t.content}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
