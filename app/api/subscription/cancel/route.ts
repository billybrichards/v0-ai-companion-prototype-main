import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY

    // Call the backend to cancel the subscription
    const response = await fetch(`${API_BASE}/api/stripe/cancel-subscription`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Subscription Cancel] Backend error:", response.status, error)
      return NextResponse.json(
        { error: error || "Failed to cancel subscription" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("[Subscription Cancel] Success:", JSON.stringify(data))

    return NextResponse.json({
      success: true,
      message: data.message || "Subscription cancelled successfully",
      ...data,
    })
  } catch (error: unknown) {
    console.error("Subscription cancel error:", error)
    const message = error instanceof Error ? error.message : "Failed to cancel subscription"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
