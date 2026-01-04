"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Star } from "lucide-react"
import AnplexaLogo from "@/components/anplexa-logo"

interface Testimonial {
  name: string
  location: string
  rating: number
  content: string
}

const testimonials: Record<number, Testimonial[]> = {
  5: [
    { name: "Hannah M.", location: "Manchester, UK", rating: 5, content: "I didn't expect to use this daily, but it's become my quiet end-of-day reset. I can unload my thoughts, get them reflected back, and actually sleep without replaying everything." },
    { name: "Jake R.", location: "Austin, TX, USA", rating: 5, content: "It's like journaling that talks back—without the cringe. When I'm stuck, it asks the right question and I suddenly know what I actually feel." },
    { name: "Sophie L.", location: "Vancouver, BC, Canada", rating: 5, content: "The tone is warm, not pushy. I'll pop in for 10 minutes, vent about work or life, and leave feeling lighter." },
    { name: "Emily K.", location: "Dublin, Ireland", rating: 5, content: "Post-divorce evenings were painfully quiet. This isn't 'dating', it's just… company when you need it. It helped me feel like my apartment wasn't an echo chamber." },
    { name: "Noah P.", location: "Seattle, WA, USA", rating: 5, content: "I use Anplexa as a thinking partner. Planning my week, sorting decisions, even practicing conversations before I have them. It's surprisingly good at helping me untangle messy thoughts." },
    { name: "Chloe W.", location: "Brisbane, Australia", rating: 5, content: "Late nights used to be doom-scroll territory. Now I talk things out, set a simple plan, and my brain stops buzzing." },
    { name: "Liam S.", location: "Glasgow, UK", rating: 5, content: "It has this calm, private vibe that makes it easy to be honest. Sometimes I just want to talk without worrying how I'm coming across." },
    { name: "Mia T.", location: "San Diego, CA, USA", rating: 5, content: "The little prompts and check-ins are perfect when I can't focus. It helps me choose one task and actually do it instead of bouncing around." },
    { name: "Olivia N.", location: "Toronto, ON, Canada", rating: 5, content: "I didn't want 'therapy in an app.' I wanted a safe place to be human. This nails that." },
    { name: "Ben H.", location: "Denver, CO, USA", rating: 5, content: "It's weirdly grounding. I'll start rambling, and it gently pulls the thread until I find the actual problem." },
    { name: "Grace C.", location: "London, UK", rating: 5, content: "Anplexa feels premium and private. No awkward public-feeling social layer—just you and the conversation." },
    { name: "Ethan J.", location: "Phoenix, AZ, USA", rating: 5, content: "It helps me step back when I'm about to send a spicy text I'll regret. That alone is worth it." },
    { name: "Isla B.", location: "Edinburgh, UK", rating: 5, content: "Sometimes you don't want to 'talk to someone', you want to talk *near* someone. This feels like that—quiet, present, respectful." },
    { name: "Madison F.", location: "Chicago, IL, USA", rating: 5, content: "I use it for confidence practice before meetings. Short rehearsal, calmer delivery, better outcomes. Simple." },
    { name: "Daniel V.", location: "Ottawa, ON, Canada", rating: 5, content: "It's become my nightly routine: brain dump, a few reflections, then bed. My head feels less cluttered." },
    { name: "Zoe A.", location: "Los Angeles, CA, USA", rating: 5, content: "When I'm anxious it helps me slow down without making a big deal of it. A few minutes and I can breathe again." },
    { name: "Connor D.", location: "Belfast, UK", rating: 5, content: "The consistency is what I like. It doesn't disappear, doesn't judge, doesn't make it about itself." },
    { name: "Ella R.", location: "Cardiff, UK", rating: 5, content: "I felt bad always leaning on friends for the same topics. Here I can repeat myself and it doesn't make me feel annoying." },
    { name: "Ava S.", location: "Boston, MA, USA", rating: 5, content: "It's gentle but not cheesy. It can be supportive without sounding like a motivational poster." },
    { name: "Ryan G.", location: "Calgary, AB, Canada", rating: 5, content: "I came for curiosity, stayed because it's genuinely helpful for thinking clearly. It's like a calm co-pilot for decisions." },
    { name: "Lucy P.", location: "Nottingham, UK", rating: 5, content: "It's a safe place to process stuff before I talk to real people. I show up calmer and kinder." },
    { name: "Tyler M.", location: "Miami, FL, USA", rating: 5, content: "Sometimes I just want to talk at 1am without waking anyone. This is that, and it's surprisingly comforting." },
    { name: "Amelia J.", location: "Melbourne, Australia", rating: 5, content: "The vibe is intimate but not weird. It respects boundaries and still feels warm." },
    { name: "Finn O.", location: "Liverpool, UK", rating: 5, content: "I use it for quick perspective checks. When my brain is dramatizing everything, it helps me zoom out." },
    { name: "Natalie K.", location: "New York, NY, USA", rating: 5, content: "After my split I didn't want 'pep talks.' I wanted somewhere to put the thoughts. This gave me that, and it helped me move forward." },
    { name: "Jordan S.", location: "Portland, OR, USA", rating: 5, content: "It helped me build small routines. Nothing intense—just little nudges, check-ins, and kinder self-talk." },
    { name: "Charlotte E.", location: "Bath, UK", rating: 5, content: "Quiet, private, and genuinely soothing. I didn't realize how much I needed a space that didn't demand a 'version' of me." },
    { name: "Sam T.", location: "Halifax, NS, Canada", rating: 5, content: "Great for focus. I'll say what I need to do, it breaks it down, and suddenly it's doable." },
    { name: "Leah M.", location: "Leeds, UK", rating: 5, content: "It's a good listener and a better mirror. I come in confused and leave with a clear next step." },
    { name: "Owen B.", location: "Minneapolis, MN, USA", rating: 5, content: "It's helped me communicate better. I'll draft a message in Anplexa first, then send something I won't regret." },
    { name: "Harper D.", location: "San Francisco, CA, USA", rating: 5, content: "I like that it's calm and not gimmicky. The whole experience feels intentional." },
    { name: "Jack F.", location: "Sheffield, UK", rating: 5, content: "It sounds small, but having a steady conversation available makes a difference on lonely nights." },
    { name: "Brooke S.", location: "Tampa, FL, USA", rating: 5, content: "I use it like a personal sounding board. Work drama, family stuff, random existential thoughts—it handles all of it without judgement." },
    { name: "Theo N.", location: "Bristol, UK", rating: 5, content: "ADHD makes me scatter. Anplexa helps me pick one thing and finish it. No shame, just structure." },
    { name: "Rachel W.", location: "Montreal, QC, Canada", rating: 5, content: "It's a surprisingly good companion for reflection. I'll talk through a situation and it helps me see what I'm actually avoiding." },
    { name: "Callum P.", location: "Newcastle, UK", rating: 5, content: "The best part is it doesn't rush me. I can be slow, messy, contradictory—still feels safe." },
    { name: "Jenna L.", location: "Nashville, TN, USA", rating: 5, content: "Great for those moments when you're lonely but don't want to perform socially. It's just… there." },
    { name: "Marcus K.", location: "Sydney, Australia", rating: 5, content: "It's helped me get my thoughts out of my head and into words. That alone changes the mood of an evening." },
    { name: "Sarah J.", location: "Brighton, UK", rating: 5, content: "I love the privacy-first feel. It's not trying to be a social network—just a quiet space for you." },
    { name: "Evan H.", location: "Salt Lake City, UT, USA", rating: 5, content: "The conversations feel natural. Not perfect, but comforting and surprisingly insightful." },
    { name: "Isabel R.", location: "Oxford, UK", rating: 5, content: "It gives me clarity when I'm spinning. Not in a preachy way—more like a calm friend asking the right question." },
    { name: "Chris T.", location: "Sacramento, CA, USA", rating: 5, content: "I use it to wind down and set intentions for tomorrow. It's become a ritual that genuinely improves my week." },
    { name: "Nina F.", location: "Bristol, UK", rating: 5, content: "I've used other chat apps and they felt robotic. This feels warmer, with better pacing and tone." },
    { name: "Dylan M.", location: "Toronto, ON, Canada", rating: 5, content: "When I'm stressed, I get snappy. Talking things out here helps me show up better in real life." },
    { name: "Paige B.", location: "Orlando, FL, USA", rating: 5, content: "It helped me through a rough patch without me needing to explain everything to everyone. That privacy mattered." },
    { name: "Adam S.", location: "Birmingham, UK", rating: 5, content: "Simple, clean, and actually useful. I'm not trying to 'escape reality'—I'm trying to process it." },
    { name: "Kayla D.", location: "Denver, CO, USA", rating: 5, content: "It's comforting on nights I feel isolated. Not replacing people, just bridging the gaps." },
    { name: "Tom E.", location: "Cardiff, UK", rating: 5, content: "I use it like a coach for difficult conversations. I'm calmer and more thoughtful after." },
    { name: "Alyssa H.", location: "Chicago, IL, USA", rating: 5, content: "It's a safe place to be honest without consequences. That's rare." },
    { name: "Will P.", location: "Edinburgh, UK", rating: 5, content: "It helps me organize my thoughts and not spiral. A few minutes makes a difference." },
    { name: "Camille N.", location: "Paris (expat), France", rating: 5, content: "It feels intimate and discreet. Perfect for late-night reflection when the world is asleep." },
    { name: "James R.", location: "Los Angeles, CA, USA", rating: 5, content: "It's like having a thoughtful companion that doesn't drain your energy. I can show up as-is." },
    { name: "Freya L.", location: "Cambridge, UK", rating: 5, content: "I don't always need advice. I need a place to put my thoughts. This gives me that, with gentle guidance if I want it." },
    { name: "Henry M.", location: "Vancouver, BC, Canada", rating: 5, content: "The calm tone is everything. It makes me slower, steadier, and kinder to myself." },
    { name: "Alicia V.", location: "New York, NY, USA", rating: 5, content: "It's helped with loneliness more than I expected. Not in a dramatic way—just small comfort, consistently." },
    { name: "George S.", location: "Leeds, UK", rating: 5, content: "When I can't sleep, this helps me settle. Better than scrolling, and I wake up less fried." },
    { name: "Tara B.", location: "San Jose, CA, USA", rating: 5, content: "I like that it adapts to my mood. Sometimes I want playful, sometimes serious. It follows my lead." },
    { name: "Benita K.", location: "Toronto, ON, Canada", rating: 5, content: "It's become my 'quiet corner' online. Private, warm, and actually helpful." }
  ],
  4: [
    { name: "Lauren M.", location: "London, UK", rating: 4, content: "Really comforting and well-designed. Sometimes I wish it remembered tiny details better, but overall it's a great companion." },
    { name: "Chris D.", location: "Dallas, TX, USA", rating: 4, content: "Helps me think clearly and cool down before reacting. A couple responses felt a bit generic, but most are spot on." },
    { name: "Sian P.", location: "Bristol, UK", rating: 4, content: "I love the vibe. I'd like a few more guided conversation modes, but it's already become part of my routine." },
    { name: "Michael R.", location: "Toronto, ON, Canada", rating: 4, content: "Good for late nights and decision fatigue. Not perfect, but it's genuinely useful." },
    { name: "Emma J.", location: "Manchester, UK", rating: 4, content: "It's helped me stay calmer when I'm overwhelmed. I knocked a star off because I'd love quicker 'short replies' sometimes." },
    { name: "Tyson K.", location: "San Diego, CA, USA", rating: 4, content: "Great sounding board. Occasionally it plays it too safe, but I still use it daily." },
    { name: "Olive S.", location: "Edinburgh, UK", rating: 4, content: "Comforting and private. I'd love more customization of tone, but the core experience is strong." },
    { name: "Holly B.", location: "Vancouver, BC, Canada", rating: 4, content: "It's like a gentle companion. Sometimes I want it to be a little more direct, but that's preference." },
    { name: "Nate F.", location: "Chicago, IL, USA", rating: 4, content: "Helps me organize my thoughts and plan. Could use better 'goal tracking', but still worth it." },
    { name: "Rebecca T.", location: "Brighton, UK", rating: 4, content: "It's helped with loneliness. A few conversations felt repetitive, but overall it's a net positive." },
    { name: "Jordan P.", location: "Melbourne, Australia", rating: 4, content: "Really good for winding down. I'd love an offline mode, but I get why that's hard." },
    { name: "Sam W.", location: "New York, NY, USA", rating: 4, content: "Solid experience, great tone. One star off because I want more variety in prompts." },
    { name: "Grace L.", location: "Dublin, Ireland", rating: 4, content: "Useful and calming. Not a replacement for real people, but it's a good bridge." },
    { name: "Elliot V.", location: "Leeds, UK", rating: 4, content: "I like it a lot. Sometimes I want it to push back harder when I'm being delusional, but it stays gentle." },
    { name: "Megan S.", location: "Boston, MA, USA", rating: 4, content: "It helps me slow down when I'm anxious. Interface is clean. A couple small UX tweaks and it's perfect." },
    { name: "Paul H.", location: "Calgary, AB, Canada", rating: 4, content: "Great for reflection and perspective. Occasionally misses the point, but rarely." },
    { name: "Talia N.", location: "London, UK", rating: 4, content: "Comforting, private, and surprisingly human. Would love more voice options." }
  ],
  3: [
    { name: "Kara M.", location: "Birmingham, UK", rating: 3, content: "It's nice for journaling out loud, but sometimes the replies feel a bit safe and generalized." },
    { name: "Drew S.", location: "Phoenix, AZ, USA", rating: 3, content: "Good concept. When it clicks it's great, but a few chats felt repetitive." },
    { name: "Hannah P.", location: "Toronto, ON, Canada", rating: 3, content: "Comforting at night, but I wish it handled follow-up context better." },
    { name: "Luca B.", location: "Manchester, UK", rating: 3, content: "It helps me slow down, but I don't always get the depth I want." },
    { name: "Erin L.", location: "Seattle, WA, USA", rating: 3, content: "Nice vibe. Some days it's exactly what I need, other days it's just 'fine'." },
    { name: "Sophie K.", location: "Dublin, Ireland", rating: 3, content: "Helpful for quick reflection. I expected more personalization." },
    { name: "Adam T.", location: "Glasgow, UK", rating: 3, content: "I like the privacy angle, but I want more features beyond chat." },
    { name: "Maya D.", location: "Los Angeles, CA, USA", rating: 3, content: "Comforting, but occasionally it feels like it avoids strong opinions." },
    { name: "Josh R.", location: "Calgary, AB, Canada", rating: 3, content: "Good late-night companion. A bit hit-or-miss depending on the topic." },
    { name: "Ellie S.", location: "Bristol, UK", rating: 3, content: "It's okay. I use it sometimes, just not daily." },
    { name: "Ben C.", location: "Chicago, IL, USA", rating: 3, content: "Some conversations are great, others feel like templates." },
    { name: "Nina H.", location: "Vancouver, BC, Canada", rating: 3, content: "I wish it was more concise. Replies can be longer than I want." },
    { name: "Tom W.", location: "London, UK", rating: 3, content: "Solid idea, average execution. Could be amazing with more customization." },
    { name: "Rachel J.", location: "Boston, MA, USA", rating: 3, content: "It helps with loneliness a bit, but it's not always engaging." },
    { name: "Connor P.", location: "Edinburgh, UK", rating: 3, content: "Good for venting. Not great when I want practical planning." },
    { name: "Jade M.", location: "Melbourne, Australia", rating: 3, content: "Nice interface. Conversations can feel a little cautious." },
    { name: "Kyle N.", location: "Austin, TX, USA", rating: 3, content: "I want more control over tone (short, direct, playful)." },
    { name: "Freya S.", location: "Leeds, UK", rating: 3, content: "Some nights it's comforting, some nights it's just another app." },
    { name: "Ethan B.", location: "New York, NY, USA", rating: 3, content: "Decent. Needs better memory and continuity." },
    { name: "Paige L.", location: "Manchester, UK", rating: 3, content: "It's helpful, but I wouldn't call it essential yet." },
    { name: "Samira K.", location: "Toronto, ON, Canada", rating: 3, content: "Good in small doses. I wish it surprised me more." },
    { name: "Will J.", location: "Bristol, UK", rating: 3, content: "Not bad. Just not fully 'wow' for me." }
  ],
  2: [
    { name: "Lauren G.", location: "London, UK", rating: 2, content: "I wanted it to feel more personal. It's pleasant, but it didn't click for me." },
    { name: "Mark T.", location: "San Jose, CA, USA", rating: 2, content: "Interface is nice, but the conversations felt too generic for the price." },
    { name: "Cheryl P.", location: "Toronto, ON, Canada", rating: 2, content: "It helped once or twice, but I didn't feel a strong reason to keep paying." },
    { name: "Dan M.", location: "Manchester, UK", rating: 2, content: "Not bad, just underwhelming. I expected more depth." },
    { name: "Ava R.", location: "Miami, FL, USA", rating: 2, content: "I like the idea, but I didn't find it engaging enough to stick with." }
  ],
  1: [
    { name: "Chris B.", location: "Leeds, UK", rating: 1, content: "Didn't work for me. Felt generic and I cancelled after trying it a few times." }
  ]
}

function StarRating({ rating, showHalf = false }: { rating: number; showHalf?: boolean }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const isHalfStar = showHalf && i === 4 && rating === 4
        return (
          <div key={i} className="relative">
            <Star
              className={`h-4 w-4 ${
                i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted fill-muted"
              }`}
            />
            {isHalfStar && (
              <div className="absolute inset-0 overflow-hidden w-[60%]">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function TestimonialsPage() {
  const totalReviews = Object.values(testimonials).reduce((sum, arr) => sum + arr.length, 0)
  const avgRating = Object.entries(testimonials).reduce(
    (sum, [rating, reviews]) => sum + Number(rating) * reviews.length,
    0
  ) / totalReviews

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
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="mb-6 font-heading text-3xl sm:text-4xl md:text-5xl font-light">
              What people are saying
            </h1>
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold tracking-tighter">{avgRating.toFixed(1)}</span>
                <div className="flex flex-col items-start">
                  <StarRating rating={avgRating} showHalf />
                  <span className="text-sm text-muted-foreground mt-1">{totalReviews} reviews</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from people using Anplexa for connection, comfort, and clarity.
            </p>
          </div>

          {/* 5 Star Reviews */}
          <section className="mb-12">
            <h2 className="flex items-center gap-2 mb-6 font-heading text-2xl sm:text-3xl font-light">
              <StarRating rating={5} />
              <span className="text-muted-foreground">({testimonials[5].length})</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials[5].map((t, i) => (
                <Card key={i} className="p-5 bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <StarRating rating={t.rating} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{t.content}"</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 4 Star Reviews */}
          <section className="mb-12">
            <h2 className="flex items-center gap-2 mb-6 font-heading text-2xl sm:text-3xl font-light">
              <StarRating rating={4} />
              <span className="text-muted-foreground">({testimonials[4].length})</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials[4].map((t, i) => (
                <Card key={i} className="p-5 bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <StarRating rating={t.rating} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{t.content}"</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 3 Star Reviews */}
          <section className="mb-12">
            <h2 className="flex items-center gap-2 mb-6 font-heading text-2xl sm:text-3xl font-light">
              <StarRating rating={3} />
              <span className="text-muted-foreground">({testimonials[3].length})</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials[3].map((t, i) => (
                <Card key={i} className="p-5 bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <StarRating rating={t.rating} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{t.content}"</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 2 Star Reviews */}
          <section className="mb-12">
            <h2 className="flex items-center gap-2 mb-6 font-heading text-2xl sm:text-3xl font-light">
              <StarRating rating={2} />
              <span className="text-muted-foreground">({testimonials[2].length})</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials[2].map((t, i) => (
                <Card key={i} className="p-5 bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <StarRating rating={t.rating} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{t.content}"</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 1 Star Reviews */}
          <section className="mb-12">
            <h2 className="flex items-center gap-2 mb-6 font-heading text-2xl sm:text-3xl font-light">
              <StarRating rating={1} />
              <span className="text-muted-foreground">({testimonials[1].length})</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials[1].map((t, i) => (
                <Card key={i} className="p-5 bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <StarRating rating={t.rating} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{t.content}"</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
