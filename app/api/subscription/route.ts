import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    
    const response = await fetch(`${API_BASE}/api/stripe/subscription`, {
      headers: {
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      next: { revalidate: 0 },
      cache: 'no-store'
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Subscription] Backend error:", response.status, error)
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    console.log("[Subscription] Backend response:", JSON.stringify(data))
    
    return NextResponse.json({
      subscriptionStatus: data.subscriptionStatus || data.status || "not_subscribed",
      plan: data.plan,
      credits: data.credits,
      stripeCustomerId: data.stripeCustomerId,
      subscriptionId: data.subscriptionId,
    })
  } catch (error: unknown) {
    console.error("Subscription status error:", error)
    const message = error instanceof Error ? error.message : "Failed to get subscription status"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
