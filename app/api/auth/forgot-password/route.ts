import { type NextRequest, NextResponse } from "next/server"
import { sendPasswordResetEmail } from "@/lib/email"
import { z } from "zod"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

const requestSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }
    
    const { email } = parsed.data
    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 404) {
        return NextResponse.json({ 
          success: true, 
          message: "If an account with that email exists, you will receive a password reset link." 
        })
      }
      
      console.error("[Forgot Password] Backend error:", response.status, errorData)
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
    }

    const data = await response.json()
    const resetToken = data.resetToken || data.token

    if (resetToken) {
      const userName = data.name || data.displayName
      await sendPasswordResetEmail(email, resetToken, userName)
    }

    return NextResponse.json({ 
      success: true, 
      message: "If an account with that email exists, you will receive a password reset link." 
    })
  } catch (error) {
    console.error("[Forgot Password] Error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
