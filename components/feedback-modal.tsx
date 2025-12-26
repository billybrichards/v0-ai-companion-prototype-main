"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { X, CheckCircle } from "lucide-react"

interface FeedbackModalProps {
  onClose: () => void
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<"feedback" | "feature">("feedback")
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!content.trim()) return

    // Store feedback in localStorage
    const existingFeedback = JSON.parse(localStorage.getItem("user-feedback") || "[]")
    existingFeedback.push({
      type: feedbackType,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("user-feedback", JSON.stringify(existingFeedback))

    setSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-2xl border-2 border-border bg-card p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle className="h-16 w-16 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">THANK YOU!</h2>
            <p className="text-muted-foreground font-mono">
              Your {feedbackType} has been recorded. We appreciate your input as we improve Terminal Companion.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl border-2 border-border bg-card p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">BETA FEEDBACK</h2>
                <span className="rounded bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">v0.1.0</span>
              </div>
              <p className="text-pretty text-sm text-muted-foreground font-mono">Help us improve Terminal Companion</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setFeedbackType("feedback")}
              variant={feedbackType === "feedback" ? "default" : "outline"}
              className="flex-1"
            >
              General Feedback
            </Button>
            <Button
              onClick={() => setFeedbackType("feature")}
              variant={feedbackType === "feature" ? "default" : "outline"}
              className="flex-1"
            >
              Feature Request
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback-content" className="text-sm font-bold text-foreground">
              {feedbackType === "feedback" ? "YOUR FEEDBACK" : "FEATURE REQUEST"}
            </label>
            <Textarea
              id="feedback-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                feedbackType === "feedback"
                  ? "Share your thoughts, report issues, or suggest improvements..."
                  : "Describe the feature you'd like to see..."
              }
              className="min-h-[150px] resize-none border-2 border-border bg-background font-mono"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!content.trim()} className="flex-1">
              Submit {feedbackType === "feedback" ? "Feedback" : "Request"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground font-mono">
            [SECURE] Feedback stored locally • No personal data collected
          </p>
        </div>
      </Card>
    </div>
  )
}
