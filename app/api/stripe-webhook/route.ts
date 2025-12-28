import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!stripeSecret) {
    throw new Error("STRIPE_SECRET not configured")
  }
  
  return {
    stripe: new Stripe(stripeSecret, {
      apiVersion: "2025-12-15.clover",
    }),
    webhookSecret: webhookSecret || "",
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const { stripe, webhookSecret } = getStripeClient()

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret || "")
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id || session.metadata?.userId

      if (userId) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "stripe-webhook-internal"
        const backendApiKey = process.env.BACKEND_API_KEY
        const response = await fetch(`${API_BASE}/api/webhooks/subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": webhookSecret,
            ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
          },
          body: JSON.stringify({ userId, subscriptionStatus: "subscribed" }),
        })

        if (!response.ok) {
          console.error("Failed to update subscription status:", await response.text())
        } else {
          console.log(`Subscription updated for user ${userId}`)
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "stripe-webhook-internal"
        const backendApiKey = process.env.BACKEND_API_KEY
        const response = await fetch(`${API_BASE}/api/webhooks/subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": webhookSecret,
            ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
          },
          body: JSON.stringify({ userId, subscriptionStatus: "not_subscribed" }),
        })

        if (!response.ok) {
          console.error("Failed to update subscription status:", await response.text())
        } else {
          console.log(`Subscription canceled for user ${userId}`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
