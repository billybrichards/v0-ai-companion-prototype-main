import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sendSubscriptionConfirmationEmail } from "@/lib/email"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SANDBOX_SECRET || process.env.STRIPE_SECRET
  if (!stripeSecret) {
    throw new Error("Stripe secret not configured")
  }
  return new Stripe(stripeSecret, {
    apiVersion: "2025-12-15.clover",
  })
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, userId } = await req.json()
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const stripe = getStripeClient()
    
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }
    
    const checkoutUserId = session.client_reference_id || session.metadata?.userId
    
    if (userId && checkoutUserId !== userId) {
      return NextResponse.json({ error: "User mismatch" }, { status: 403 })
    }
    
    const targetUserId = checkoutUserId || userId
    
    if (!targetUserId) {
      return NextResponse.json({ error: "No user ID found" }, { status: 400 })
    }
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "stripe-webhook-internal"
    const backendApiKey = process.env.BACKEND_API_KEY
    
    const response = await fetch(`${API_BASE}/api/webhooks/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": webhookSecret,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify({ 
        userId: targetUserId, 
        subscriptionStatus: "subscribed",
        stripeCustomerId: session.customer,
        subscriptionId: session.subscription,
        plan: session.metadata?.plan || "monthly"
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to update subscription status:", errorText)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }
    
    console.log(`Subscription verified and updated for user ${targetUserId} via checkout verification`)
    
    const customerEmail = session.customer_email || session.customer_details?.email
    if (customerEmail) {
      const customerName = session.customer_details?.name
      sendSubscriptionConfirmationEmail(customerEmail, customerName || undefined).catch(err => {
        console.error("Failed to send subscription confirmation email:", err)
      })
    }

    return NextResponse.json({ 
      success: true, 
      subscriptionStatus: "subscribed",
      plan: session.metadata?.plan || "monthly"
    })
  } catch (error: unknown) {
    console.error("Verify checkout error:", error)
    const message = error instanceof Error ? error.message : "Failed to verify checkout"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
