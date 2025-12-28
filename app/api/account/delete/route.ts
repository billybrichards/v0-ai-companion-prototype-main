import { type NextRequest, NextResponse } from "next/server"
import { sendAccountDeletionEmail } from "@/lib/email"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY
    let userEmail: string | null = null
    let userName: string | null = null

    try {
      const validateResponse = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: {
          Authorization: authHeader,
          ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
        },
      })
      if (validateResponse.ok) {
        const userData = await validateResponse.json()
        userEmail = userData.user?.email || userData.email
        userName = userData.user?.name || userData.name
      }
    } catch {
      console.log("[Delete] Could not fetch user email for notification")
    }

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

    if (userEmail) {
      sendAccountDeletionEmail(userEmail, userName || undefined).catch(err => {
        console.error("[Delete] Failed to send confirmation email:", err)
      })
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" })
  } catch (error) {
    console.error("[Delete] Error:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
