import { NextRequest, NextResponse } from "next/server"
import { sendMagicLinkEmail } from "@/lib/email"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE}/api/auth/magic-link`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-API-Key": process.env.BACKEND_API_KEY || "",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || "Failed to generate magic link" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    const emailResult = await sendMagicLinkEmail(email, data.token, data.displayName)
    
    if (!emailResult.success) {
      console.error("Failed to send magic link email:", emailResult.error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Magic link sent" })
  } catch (error) {
    console.error("Magic link send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
