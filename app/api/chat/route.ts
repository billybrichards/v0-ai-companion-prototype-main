import { type NextRequest } from "next/server"
import { z } from "zod"

export const maxDuration = 60

const API_BASE = process.env.API_URL || "http://localhost:3001"

const MessagePartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
})

const UIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(MessagePartSchema),
})

const ChatRequestSchema = z.object({
  messages: z.array(UIMessageSchema),
  preferences: z.object({
    length: z.enum(["brief", "moderate", "detailed"]).optional(),
    style: z.enum(["casual", "thoughtful", "creative"]).optional(),
  }).optional(),
  newChat: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof ChatRequestSchema>
  
  try {
    const rawBody = await req.json()
    body = ChatRequestSchema.parse(rawBody)
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
  
  const { messages, preferences, newChat } = body

  // Prepend NSFW/Adult friendly instruction to the system prompt if needed
  const nsfwInstruction = "You are an NSFW and Adult friendly AI companion. "
  const authHeader = req.headers.get("authorization")
  const lastUserMessage = messages.filter((m) => m.role === "user").pop()
  const messageText = lastUserMessage?.parts.find((p) => p.type === "text")?.text || ""

  // Call the backend chat endpoint
  const backendApiKey = process.env.BACKEND_API_KEY
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(backendApiKey ? { "X-API-Key": backendApiKey } : {}),
    },
    body: JSON.stringify({
      message: messageText,
      systemPrompt: nsfwInstruction, // Pass the NSFW/Adult friendly instruction
      preferences: {
        length: preferences?.length || "moderate",
        style: preferences?.style || "thoughtful",
      },
      storeLocally: !authHeader, // Store locally if not authenticated
      newChat: newChat || false, // Pass newChat flag for ice-breaker context
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

  // AI SDK v5 uses SSE format with specific event types:
  // data: {"type":"start","messageId":"..."} - message start
  // data: {"type":"text-start","id":"..."} - text block start
  // data: {"type":"text-delta","id":"...","delta":"..."} - text delta
  // data: {"type":"text-end","id":"..."} - text block end
  const messageId = crypto.randomUUID()
  const textId = crypto.randomUUID()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send message start event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "start", messageId })}\n\n`)
        )
        
        // Send text-start event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "text-start", id: textId })}\n\n`)
        )
        
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
                  // Filter out backend metadata artifacts (exact pattern: "| <digits> |<")
                  let content = data.content
                  content = content.replace(/\s*\|\s*\d+\s*\|\s*<$/g, '')
                  
                  if (content) {
                    // AI SDK v5 SSE format: text-delta
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ 
                        type: "text-delta", 
                        id: textId, 
                        delta: content 
                      })}\n\n`)
                    )
                  }
                }
              } catch {
                // Ignore invalid JSON
              }
            }
          }
        }
        
        // Process remaining buffer
        if (buffer.trim()) {
          const line = buffer.trim()
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6)
            try {
              const data = JSON.parse(dataStr)
              if (data.type === "text" && data.content) {
                // Filter out backend metadata artifacts (exact pattern: "| <digits> |<")
                let content = data.content
                content = content.replace(/\s*\|\s*\d+\s*\|\s*<$/g, '')
                
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ 
                      type: "text-delta", 
                      id: textId, 
                      delta: content 
                    })}\n\n`)
                  )
                }
              }
            } catch {
              // Ignore invalid JSON
            }
          }
        }
        
        // Send text-end event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "text-end", id: textId })}\n\n`)
        )
        
        // Send finish event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: "finish", 
            finishReason: "stop",
            usage: { promptTokens: 0, completionTokens: 0 }
          })}\n\n`)
        )
      } catch (error) {
        console.error("Stream error:", error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", errorText: String(error) })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "x-vercel-ai-ui-message-stream": "v1",
    },
  })
}
