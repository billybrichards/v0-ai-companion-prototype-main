import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || "https://api.anplexa.com"

export async function POST(request: NextRequest) {
  try {
    const { email, funnel } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE}/api/auth/guest-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, funnel }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 404) {
        return NextResponse.json({ 
          success: false,
          exists: false,
          error: "User not found" 
        }, { status: 404 })
      }
      
      return NextResponse.json({ 
        success: false,
        error: errorData.error || "Failed to create guest session" 
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      exists: true,
      hasPassword: data.hasPassword || false,
      accessToken: data.accessToken,
      user: data.user,
      refreshToken: data.refreshToken,
      creditsRemaining: data.creditsRemaining,
      maxCredits: data.maxCredits,
    })
  } catch (error) {
    console.error("[Guest Session] Error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
