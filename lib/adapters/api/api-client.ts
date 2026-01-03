/**
 * Centralized API client for backend communication
 * Handles auth headers, error handling, and base URL configuration
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com"

export interface ApiClientOptions {
  accessToken?: string | null
  apiKey?: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
  }

  private getHeaders(options?: ApiClientOptions): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (options?.accessToken) {
      headers["Authorization"] = `Bearer ${options.accessToken}`
    }

    if (options?.apiKey) {
      headers["X-API-Key"] = options.apiKey
    }

    return headers
  }

  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(options),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          data: null,
          error: errorData.error || errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
        }
      }

      const data = await response.json()
      return { data, error: null, status: response.status }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      }
    }
  }

  async post<T>(endpoint: string, body: unknown, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(options),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          data: null,
          error: errorData.error || errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
        }
      }

      const data = await response.json()
      return { data, error: null, status: response.status }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      }
    }
  }

  async put<T>(endpoint: string, body: unknown, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(options),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          data: null,
          error: errorData.error || errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
        }
      }

      const data = await response.json()
      return { data, error: null, status: response.status }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      }
    }
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(options),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          data: null,
          error: errorData.error || errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
        }
      }

      const data = await response.json().catch(() => ({}))
      return { data, error: null, status: response.status }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      }
    }
  }
}

// Singleton instance for client-side use
export const apiClient = new ApiClient()

// Factory for creating clients with custom base URLs (useful for SSR)
export function createApiClient(baseUrl?: string): ApiClient {
  return new ApiClient(baseUrl)
}
