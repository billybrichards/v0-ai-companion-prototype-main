import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    
    // Try new endpoint first, fallback to old one
    let response = await fetch(`${API_BASE}/api/auth/subscription-status`, {
      headers: {
        Authorization: authHeader,
        "Cache-Control": "no-cache",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      cache: 'no-store',
    })

    // Fallback to old endpoint if new one doesn't exist
    if (response.status === 404) {
      console.log("[Subscription] New endpoint not found, falling back to /api/stripe/subscription")
      response = await fetch(`${API_BASE}/api/stripe/subscription`, {
        headers: {
          Authorization: authHeader,
          "Cache-Control": "no-cache",
          ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
        },
        cache: 'no-store',
      })
    }

    if (!response.ok) {
      const error = await response.text()
      console.error("[Subscription] Backend error:", response.status, error)
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    console.log("[Subscription] Backend response:", JSON.stringify(data))
    
    // Handle both old and new response formats
    const isSubscribed = data.isSubscribed ?? (data.subscriptionStatus === "subscribed" || data.status === "subscribed")
    const subscriptionStatus = isSubscribed ? "subscribed" : (data.subscriptionStatus || data.status || "not_subscribed")
    
    const res = NextResponse.json({
      subscriptionStatus,
      isSubscribed,
      credits: data.credits,
      plan: data.plan,
      stripeCustomerId: data.stripeCustomerId,
      subscriptionId: data.subscriptionId,
      hasStripeCustomer: data.hasStripeCustomer,
      hasActiveSubscription: data.hasActiveSubscription,
      timestamp: data.timestamp || new Date().toISOString(),
    })
    
    // Aggressive cache-busting headers
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    res.headers.set("Pragma", "no-cache")
    res.headers.set("Expires", "0")
    
    return res
  } catch (error: unknown) {
    console.error("Subscription status error:", error)
    const message = error instanceof Error ? error.message : "Failed to get subscription status"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
