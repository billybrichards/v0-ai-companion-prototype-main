import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/users/delete`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Delete] Backend error:", response.status, errorText)
      return NextResponse.json({ error: "Failed to delete account" }, { status: response.status })
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" })
  } catch (error) {
    console.error("[Delete] Error:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
