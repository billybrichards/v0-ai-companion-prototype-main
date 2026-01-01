import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

// GET /api/conversations - List user's conversations
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const backendApiKey = process.env.BACKEND_API_KEY
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Conversations] GET error:", response.status, error)
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Conversations] GET exception:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create or update a conversation
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { conversationId, messages, title } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify({
        conversationId,
        messages,
        title,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Conversations] POST error:", response.status, error)
      return NextResponse.json(
        { error: "Failed to save conversation" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Conversations] POST exception:", error)
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    )
  }
}
