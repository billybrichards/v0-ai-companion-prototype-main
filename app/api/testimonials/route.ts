import { db } from "@vercel/postgres"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await db.connect()
    try {
      const { rows } = await client.sql`SELECT * FROM testimonials ORDER BY created_at DESC`
      return NextResponse.json(rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Failed to fetch testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
