import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json()

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE}/api/auth/check-uid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ exists: false })
      }
      throw new Error("Failed to check user ID")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Check uid error:", error)
    return NextResponse.json({ exists: false })
  }
}
