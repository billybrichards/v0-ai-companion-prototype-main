const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export interface HealthStatus {
  status: "healthy" | "unhealthy" | "unknown"
  message: string
  timestamp: string
}

export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Short timeout for health checks
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        status: "healthy",
        message: `Backend v${data.version || "unknown"} is running`,
        timestamp: new Date().toISOString(),
      }
    }

    return {
      status: "unhealthy",
      message: `Backend returned status ${response.status}`,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Failed to connect to backend",
      timestamp: new Date().toISOString(),
    }
  }
}
