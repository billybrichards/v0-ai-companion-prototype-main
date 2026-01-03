import { NextResponse } from "next/server"

/**
 * Shared API utilities for Next.js API routes
 * Eliminates boilerplate repeated across 20+ routes
 */

export function getApiConfig() {
  return {
    baseUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.anplexa.com",
    apiKey: process.env.BACKEND_API_KEY,
  }
}

export function getAuthHeader(req: Request): string | null {
  return req.headers.get("authorization")
}

export function createProxyHeaders(req: Request): HeadersInit {
  const auth = getAuthHeader(req)
  const { apiKey } = getApiConfig()

  return {
    ...(auth ? { Authorization: auth } : {}),
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
    "Content-Type": "application/json",
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Proxy a GET request to the backend
 */
export async function proxyGet(
  endpoint: string,
  req: Request,
  options?: { requireAuth?: boolean }
) {
  const { baseUrl } = getApiConfig()

  if (options?.requireAuth) {
    const auth = getAuthHeader(req)
    if (!auth) {
      return unauthorizedResponse()
    }
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers: createProxyHeaders(req),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`[API Proxy] GET ${endpoint} error:`, error)
    return errorResponse("Backend unavailable")
  }
}

/**
 * Proxy a POST request to the backend
 */
export async function proxyPost(
  endpoint: string,
  req: Request,
  options?: { requireAuth?: boolean }
) {
  const { baseUrl } = getApiConfig()

  if (options?.requireAuth) {
    const auth = getAuthHeader(req)
    if (!auth) {
      return unauthorizedResponse()
    }
  }

  try {
    const body = await req.json()

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: createProxyHeaders(req),
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`[API Proxy] POST ${endpoint} error:`, error)
    return errorResponse("Backend unavailable")
  }
}

/**
 * Proxy a PUT request to the backend
 */
export async function proxyPut(
  endpoint: string,
  req: Request,
  options?: { requireAuth?: boolean }
) {
  const { baseUrl } = getApiConfig()

  if (options?.requireAuth) {
    const auth = getAuthHeader(req)
    if (!auth) {
      return unauthorizedResponse()
    }
  }

  try {
    const body = await req.json()

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "PUT",
      headers: createProxyHeaders(req),
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`[API Proxy] PUT ${endpoint} error:`, error)
    return errorResponse("Backend unavailable")
  }
}

/**
 * Proxy a DELETE request to the backend
 */
export async function proxyDelete(
  endpoint: string,
  req: Request,
  options?: { requireAuth?: boolean }
) {
  const { baseUrl } = getApiConfig()

  if (options?.requireAuth) {
    const auth = getAuthHeader(req)
    if (!auth) {
      return unauthorizedResponse()
    }
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: createProxyHeaders(req),
    })

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`[API Proxy] DELETE ${endpoint} error:`, error)
    return errorResponse("Backend unavailable")
  }
}
