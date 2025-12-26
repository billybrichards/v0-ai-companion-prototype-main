import { type NextRequest } from "next/server"

export const maxDuration = 60

const API_BASE = process.env.API_URL || "http://localhost:3001"

type ResponsePreference = {
  length: "brief" | "moderate" | "detailed"
  style: "casual" | "thoughtful" | "creative"
}

type GenderOption = "male" | "female" | "non-binary" | "custom"

interface UIMessage {
  id: string
  role: "user" | "assistant" | "system"
  parts: Array<{ type: string; text?: string }>
}

export async function POST(req: NextRequest) {
  const {
    messages,
    preferences,
    gender,
    customGender,
  }: {
    messages: UIMessage[]
    preferences: ResponsePreference
    gender: GenderOption
    customGender?: string
  } = await req.json()

  // Get auth token from request headers
  const authHeader = req.headers.get("authorization")

  // Get the last user message
  const lastUserMessage = messages.filter((m) => m.role === "user").pop()
  const messageText = lastUserMessage?.parts.find((p) => p.type === "text")?.text || ""

  // Call the backend chat endpoint
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify({
      message: messageText,
      preferences: {
        length: preferences?.length || "moderate",
        style: preferences?.style || "thoughtful",
      },
      storeLocally: !authHeader, // Store locally if not authenticated
    }),
    signal: req.signal,
  })

  if (!response.ok) {
    const error = await response.text()
    return new Response(JSON.stringify({ error }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  // The backend returns SSE, we need to transform it to the AI SDK format
  const reader = response.body?.getReader()
  if (!reader) {
    return new Response(JSON.stringify({ error: "No response body" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  // Create a transform stream to convert backend SSE to AI SDK format
  const stream = new ReadableStream({
    async start(controller) {
      // Send the initial message start
      const messageId = `msg-${Date.now()}`
      controller.enqueue(
        encoder.encode(
          `0:${JSON.stringify([
            {
              type: "start",
              value: {
                messageId,
                role: "assistant",
              },
            },
          ])}\n`
        )
      )

      try {
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6)
              try {
                const data = JSON.parse(dataStr)

                if (data.type === "text" && data.content) {
                  // Send text delta in AI SDK format
                  controller.enqueue(
                    encoder.encode(
                      `0:${JSON.stringify([
                        {
                          type: "text",
                          value: data.content,
                        },
                      ])}\n`
                    )
                  )
                } else if (data.type === "done") {
                  // Send finish event
                  controller.enqueue(
                    encoder.encode(
                      `0:${JSON.stringify([
                        {
                          type: "finish",
                          value: {
                            finishReason: "stop",
                          },
                        },
                      ])}\n`
                    )
                  )
                }
              } catch {
                // Ignore invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error("Stream error:", error)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
