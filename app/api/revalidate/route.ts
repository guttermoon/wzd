import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { NAV, FOOTER_NAV, LEGAL_NAV } from "@/lib/event"

/**
 * Forces a re-fetch of the Notion copy without waiting for the 60s window.
 *
 * The secret is required, not optional: the previous version only compared
 * it when one was supplied, which left the endpoint open to anyone who
 * simply omitted it. If REVALIDATION_SECRET isn't configured the endpoint
 * refuses to do anything at all.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATION_SECRET
  if (!expected) {
    return NextResponse.json(
      { message: "Revalidation is not configured." },
      { status: 503 },
    )
  }

  let body: { path?: string; secret?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Expected a JSON body." }, { status: 400 })
  }

  if (body.secret !== expected) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  const known = new Set<string>(
    [...NAV, ...FOOTER_NAV, ...LEGAL_NAV].map((item) => item.href),
  )

  if (body.path) {
    // Only revalidate paths this site actually serves.
    if (!known.has(body.path)) {
      return NextResponse.json({ message: "Unknown path" }, { status: 400 })
    }
    revalidatePath(body.path)
    return NextResponse.json({ revalidated: true, paths: [body.path] })
  }

  const paths = [...known]
  for (const path of paths) revalidatePath(path)
  return NextResponse.json({ revalidated: true, paths })
}

export async function GET() {
  return NextResponse.json({
    message: "Revalidation endpoint. POST with { secret, path? } to trigger.",
  })
}
