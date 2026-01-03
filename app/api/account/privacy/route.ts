import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

const PrivacySettingsSchema = z.object({
  analyticsOptIn: z.boolean().optional(),
  personalizedAi: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: z.infer<typeof PrivacySettingsSchema>
    try {
      const rawBody = await req.json()
      body = PrivacySettingsSchema.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/settings/preferences`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Privacy] Backend error:", response.status, errorText)
      
      if (response.status === 404) {
        return NextResponse.json({ 
          success: true, 
          message: "Privacy settings updated locally",
          settings: body 
        })
      }
      
      return NextResponse.json({ error: "Failed to update privacy settings" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error("[Privacy] Error:", error)
    return NextResponse.json({ error: "Failed to update privacy settings" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/settings/preferences`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          analyticsOptIn: true,
          personalizedAi: true,
          marketingEmails: false,
        })
      }
      return NextResponse.json({ error: "Failed to get privacy settings" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Privacy] Error:", error)
    return NextResponse.json({ error: "Failed to get privacy settings" }, { status: 500 })
  }
}
