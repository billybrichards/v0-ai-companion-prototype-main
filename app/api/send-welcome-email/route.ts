import { type NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"
import { z } from "zod"

const requestSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
    
    const { email, name } = parsed.data
    
    const result = await sendWelcomeEmail(email, name)
    
    if (!result.success) {
      console.error("[Welcome Email] Failed to send:", result.error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Welcome Email] Error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
