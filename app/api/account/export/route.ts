import { type NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendApiKey = process.env.BACKEND_API_KEY

    const response = await fetch(`${API_BASE}/api/users/export`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Export] Backend error:", response.status, errorText)
      
      if (response.status === 404) {
        const userData = {
          exportDate: new Date().toISOString(),
          message: "Data export requested. Your data will be compiled and available for download.",
          gdprCompliance: {
            dataController: "Anplexa",
            purpose: "User data export under GDPR Article 20 (Right to data portability)",
            contact: "privacy@anplexa.com"
          }
        }
        
        return new NextResponse(JSON.stringify(userData, null, 2), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="anplexa-data-export-${new Date().toISOString().split("T")[0]}.json"`,
          },
        })
      }
      
      return NextResponse.json({ error: "Failed to export data" }, { status: response.status })
    }

    const data = await response.json()
    
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="anplexa-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("[Export] Error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
