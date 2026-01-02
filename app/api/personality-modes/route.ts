import { NextResponse } from "next/server"

const API_URL = process.env.API_URL || "https://api.anplexa.com"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const response = await fetch(`${API_URL}/api/auth/personality-modes`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch personality modes" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Personality Modes] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch(`${API_URL}/api/auth/personality-mode`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || "Failed to update personality mode" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Personality Mode Update] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
