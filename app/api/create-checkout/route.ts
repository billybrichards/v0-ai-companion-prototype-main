import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const STRIPE_PRICE_MONTHLY = "price_1Sj3Q4Hf3F7YsE79EfGL6BuF"
const STRIPE_PRICE_YEARLY = "price_1SkBhsHf3F7YsE79UDhlyjdG"

function getStripeClient() {
  const stripeSecret = process.env.STRIPE_SECRET
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

    const { userId, plan } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }
    
    // Select price based on plan
    const priceId = plan === "yearly" ? STRIPE_PRICE_YEARLY : STRIPE_PRICE_MONTHLY
    
    const stripe = getStripeClient()
    
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
      success_url: `${origin}/dash?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/dash?canceled=true`,
      metadata: {
        userId,
        plan: plan || "monthly",
      },
      client_reference_id: userId,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error("Checkout error:", error)
    const message = error instanceof Error ? error.message : "Failed to create checkout session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
