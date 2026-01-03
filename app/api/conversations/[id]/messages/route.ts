import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

// POST /api/conversations/:id/messages - Add messages to a conversation
export async function POST(
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

    const response = await fetch(`${API_BASE}/api/conversations/${id}/messages`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // If backend doesn't support this endpoint, indicate local storage should be used
      if (response.status === 404) {
        return NextResponse.json({ success: true, isLocal: true })
      }
      const errorText = await response.text()
      console.error("[Messages] Add error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to add messages" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Messages] Add error:", error)
    return NextResponse.json({ success: true, isLocal: true })
  }
}
