import { type NextRequest, NextResponse } from "next/server"
import { sendSubscriptionConfirmationEmail } from "@/lib/email"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = await req.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE}/api/stripe/verify-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ sessionId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Backend verification failed" }))
      console.error("Backend verify-checkout failed:", errorData)
      return NextResponse.json(errorData, { status: response.status })
    }
    
    const data = await response.json()
    console.log(`Subscription verified via backend: ${JSON.stringify(data)}`)
    
    if (data.success && data.email) {
      sendSubscriptionConfirmationEmail(data.email, data.customerName).catch(err => {
        console.error("Failed to send subscription confirmation email:", err)
      })
    }

    return NextResponse.json({
      success: data.success,
      subscriptionStatus: data.subscriptionStatus,
      plan: data.plan,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
    })
  } catch (error: unknown) {
    console.error("Verify checkout error:", error)
    const message = error instanceof Error ? error.message : "Failed to verify checkout"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
