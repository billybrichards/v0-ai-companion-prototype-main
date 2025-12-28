import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

const requestSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message).join(", ")
      return NextResponse.json({ error: errors }, { status: 400 })
    }
    
    const { token, password } = parsed.data
    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 400 || response.status === 401) {
        return NextResponse.json({ 
          error: errorData.error || "Invalid or expired reset link. Please request a new one." 
        }, { status: 400 })
      }
      
      console.error("[Reset Password] Backend error:", response.status, errorData)
      return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successfully. You can now log in with your new password." 
    })
  } catch (error) {
    console.error("[Reset Password] Error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
