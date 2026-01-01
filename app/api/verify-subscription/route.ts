import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE}/api/auth/subscription-status`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to verify subscription" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Subscription verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
