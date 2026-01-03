import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

// GET /api/conversations - List all conversations for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    const response = await fetch(`${API_BASE}/api/conversations`, {
      headers: {
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok) {
      // If backend doesn't have this endpoint yet, return empty array
      if (response.status === 404) {
        console.log("[Conversations] Backend returned 404, returning empty list")
        return NextResponse.json({ conversations: [] })
      }
      const errorText = await response.text()
      console.error("[Conversations] Backend error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: response.status })
    }

    const data = await response.json()
    // Handle different response formats from backend
    if (Array.isArray(data)) {
      return NextResponse.json({ conversations: data })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Conversations] Error:", error)
    return NextResponse.json({ conversations: [] })
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // If backend doesn't support this, return a local ID
      if (response.status === 404) {
        return NextResponse.json({
          id: `local-${Date.now()}`,
          createdAt: new Date().toISOString(),
          messages: [],
          isLocal: true
        })
      }
      const errorText = await response.text()
      console.error("[Conversations] Create error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Conversations] Create error:", error)
    return NextResponse.json({
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      messages: [],
      isLocal: true
    })
  }
}
