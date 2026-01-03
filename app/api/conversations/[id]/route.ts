import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

// GET /api/conversations/:id - Get a specific conversation with messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
      headers: {
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
      const errorText = await response.text()
      console.error("[Conversation] Get error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to fetch conversation" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Conversation] Get error:", error)
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 })
  }
}

// PUT /api/conversations/:id - Update conversation (messages, title, etc.)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // If backend doesn't support updates, return success anyway for local storage
      if (response.status === 404) {
        return NextResponse.json({ success: true, isLocal: true })
      }
      const errorText = await response.text()
      console.error("[Conversation] Update error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to update conversation" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Conversation] Update error:", error)
    return NextResponse.json({ success: true, isLocal: true })
  }
}

// DELETE /api/conversations/:id - Delete a conversation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text()
      console.error("[Conversation] Delete error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to delete conversation" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Conversation] Delete error:", error)
    return NextResponse.json({ success: true })
  }
}
