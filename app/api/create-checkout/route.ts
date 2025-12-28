import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

async function getStripeClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null

  if (!xReplitToken || !hostname) {
    throw new Error("Stripe credentials not available")
  }

  const isProduction = process.env.REPLIT_DEPLOYMENT === "1"
  const targetEnvironment = isProduction ? "production" : "development"

  const url = new URL(`https://${hostname}/api/v2/connection`)
  url.searchParams.set("include_secrets", "true")
  url.searchParams.set("connector_names", "stripe")
  url.searchParams.set("environment", targetEnvironment)

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      X_REPLIT_TOKEN: xReplitToken,
    },
  })

  const data = await response.json()
  const connectionSettings = data.items?.[0]

  if (!connectionSettings?.settings?.secret) {
    throw new Error("Stripe connection not found")
  }

  return new Stripe(connectionSettings.settings.secret, {
    apiVersion: "2025-12-15.clover",
  })
}

async function validateToken(authHeader: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const backendApiKey = process.env.BACKEND_API_KEY
    console.log("[Checkout] Validating token against backend:", API_BASE)
    console.log("[Checkout] Has BACKEND_API_KEY:", !!backendApiKey)
    
    const response = await fetch(`${API_BASE}/api/auth/validate`, {
      headers: { 
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })
    
    console.log("[Checkout] Backend response status:", response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log("[Checkout] Token valid, userId:", data.user?.id)
      return { valid: true, userId: data.user?.id }
    }
    
    const errorText = await response.text()
    console.log("[Checkout] Token validation failed:", errorText)
    return { valid: false, error: errorText }
  } catch (err) {
    console.error("[Checkout] Token validation error:", err)
    return { valid: false, error: String(err) }
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId, userId } = await req.json()
    
    const validation = await validateToken(authHeader)
    if (!validation.valid) {
      console.error("[Checkout] Token validation failed:", validation.error)
      return NextResponse.json({ error: "Invalid token", details: validation.error }, { status: 401 })
    }
    
    const validatedUserId = validation.userId || userId
    
    const stripe = await getStripeClient()
    
    const origin = req.headers.get("origin") || req.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        userId: validatedUserId,
      },
      client_reference_id: validatedUserId,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error("Checkout error:", error)
    const message = error instanceof Error ? error.message : "Failed to create checkout session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
