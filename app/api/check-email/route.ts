import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE}/api/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ exists: false })
      }
      throw new Error("Failed to check email")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Check email error:", error)
    return NextResponse.json({ exists: false })
  }
}
