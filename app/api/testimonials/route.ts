import { sql } from "@vercel/postgres"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
