import { timingSafeEqual } from "node:crypto"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { NAV, FOOTER_NAV, LEGAL_NAV, UNLISTED_NAV } from "@/lib/event"

/**
 * Forces a re-fetch of the Notion copy without waiting for the 60s window.
 *
 * The secret is required, not optional: the previous version only compared
 * it when one was supplied, which left the endpoint open to anyone who
 * simply omitted it. If REVALIDATION_SECRET isn't configured the endpoint
 * refuses to do anything at all.
 */
export const runtime = "nodejs"

/**
 * Compared in constant time, so the answer takes as long for a secret that
 * is wrong in the first character as for one wrong in the last.
 *
 * `!==` on two strings stops at the first difference, and the time it
 * saves by doing so is a measurement of how much of the secret is right —
 * which is enough, given sufficient requests, to recover it one character
 * at a time. Network jitter makes that a poor channel and this is not a
 * high-value secret, but the fix is three lines and the argument for
 * leaving it is only that the attack is inconvenient.
 *
 * The lengths are compared first and separately: `timingSafeEqual` throws
 * on a mismatch rather than returning false, and a length is not the part
 * worth protecting.
 */
function secretMatches(given: unknown, expected: string): boolean {
  if (typeof given !== "string") return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
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

  if (!secretMatches(body.secret, expected)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  // UNLISTED_NAV as well as the three nav arrays: a page nobody links to
  // is still a page whose copy can need pushing out in a hurry.
  const known = new Set<string>(
    [...NAV, ...FOOTER_NAV, ...LEGAL_NAV, ...UNLISTED_NAV].map((i) => i.href),
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
