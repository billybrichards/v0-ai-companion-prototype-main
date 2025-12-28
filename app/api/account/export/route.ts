import { type NextRequest, NextResponse } from "next/server"
import { sendDataExportEmail } from "@/lib/email"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://2-terminal-companion--billy130.replit.app"

export async function POST(req: NextRequest) {
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
      console.log("[Export] Could not fetch user email for notification")
    }

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
        
        if (userEmail) {
          sendDataExportEmail(userEmail, userName || undefined).catch(err => {
            console.error("[Export] Failed to send confirmation email:", err)
          })
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
    
    if (userEmail) {
      sendDataExportEmail(userEmail, userName || undefined).catch(err => {
        console.error("[Export] Failed to send confirmation email:", err)
      })
    }
    
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
