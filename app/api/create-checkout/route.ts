import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Price IDs - MUST match across all repos (api, frontend, funnel-forge)
const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY || "price_1Sj3Q4Hf3F7YsE79EfGL6BuF"
const STRIPE_PRICE_YEARLY = process.env.STRIPE_PRICE_YEARLY || "price_1SkBhsHf3F7YsE79UDhlyjdG"

// Auto-select Stripe keys based on NODE_ENV
function getStripeKeys() {
  const isProduction = process.env.NODE_ENV === "production"

  const secretKey = isProduction
    ? (process.env.STRIPE_LIVE_SECRET || process.env.STRIPE_SECRET)
    : (process.env.STRIPE_TEST_SECRET || process.env.STRIPE_SECRET)

  const publicKey = isProduction
    ? (process.env.STRIPE_LIVE_PUBLIC || process.env.STRIPE_PUBLIC)
    : (process.env.STRIPE_TEST_PUBLIC || process.env.STRIPE_PUBLIC)

  return { secretKey, publicKey, isProduction }
}

// Validate Stripe configuration on startup
const validateStripeConfig = () => {
  const { secretKey, isProduction } = getStripeKeys()
  const warnings: string[] = []

  if (!secretKey) {
    console.error("[Stripe] ❌ Stripe keys not configured - payments will fail")
    return { valid: false, mode: null, warnings }
  }

  if (!secretKey.startsWith("sk_")) {
    console.error("[Stripe] ❌ Stripe key invalid format - must start with sk_")
    return { valid: false, mode: null, warnings }
  }

  const isTestKey = secretKey.includes("_test_")
  const mode = isTestKey ? "test" : "live"

  // Warn about environment/key mismatch
  if (isProduction && isTestKey) {
    warnings.push("⚠️  Using TEST keys in PRODUCTION environment!")
  }
  if (!isProduction && !isTestKey) {
    warnings.push("⚠️  Using LIVE keys in DEVELOPMENT - real charges will occur!")
  }

  if (!process.env.STRIPE_PRICE_MONTHLY) {
    warnings.push("STRIPE_PRICE_MONTHLY not set, using default")
  }
  if (!process.env.STRIPE_PRICE_YEARLY) {
    warnings.push("STRIPE_PRICE_YEARLY not set, using default")
  }

  console.log(`[Stripe] ✓ Configured in ${mode} mode (NODE_ENV=${process.env.NODE_ENV})`)
  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`[Stripe] ${w}`))
  }

  return { valid: true, mode, warnings }
}

// Run validation on module load
const stripeConfig = validateStripeConfig()

function getStripeClient() {
  const { secretKey } = getStripeKeys()
  if (!secretKey) {
    throw new globalThis.Error("Stripe secret not configured")
  }
  return new Stripe(secretKey, {
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
    
    const priceId = plan === "yearly" ? STRIPE_PRICE_YEARLY : STRIPE_PRICE_MONTHLY
    
    const stripe = getStripeClient()
    
    const origin = req.headers.get("origin") || req.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
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
  } catch (err: unknown) {
    console.error("Checkout error:", err)
    const message = err instanceof globalThis.Error ? err.message : "Failed to create checkout session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
