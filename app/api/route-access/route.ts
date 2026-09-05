import { NextRequest, NextResponse } from "next/server"

import {
  COOKIE_MAX_AGE,
  ROUTE_COOKIE,
  cookieOptions,
  isConfigured,
  mintToken,
  passwordMatches,
} from "@/lib/route-access"
import { callerKey, rateLimit } from "@/lib/rate-limit"

/**
 * Takes the password for /the-route and, if it is right, hands back the
 * signed cookie that lets the page render.
 *
 * Node rather than the edge only because it sits beside the other route
 * handlers; lib/route-access.ts is Web Crypto throughout and would run on
 * either.
 */
export const runtime = "nodejs"

/**
 * Rate limited for a different reason than the two routes that send mail:
 * nothing here costs the owner an email, but a password is guessable in a
 * way an API secret is not — it has to be short enough to read out at a
 * check-in desk. A cap on attempts is most of what stands between a short
 * password and someone working through a word list.
 *
 * The same warning applies as in lib/rate-limit.ts: the counter is per
 * serverless instance, so this slows an attack rather than stopping one.
 * The password's own length is still doing the real work.
 */
const ATTEMPTS = 10
const WINDOW_MS = 10 * 60 * 1000

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { message: "The route page is not configured." },
      { status: 503 },
    )
  }

  const limit = rateLimit(callerKey(request, "route-access"), {
    limit: ATTEMPTS,
    windowMs: WINDOW_MS,
  })
  if (!limit.ok) {
    return NextResponse.json(
      { message: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    )
  }

  let body: { password?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Expected a JSON body." }, { status: 400 })
  }

  if (!(await passwordMatches(body.password))) {
    return NextResponse.json({ message: "Wrong password." }, { status: 401 })
  }

  const token = await mintToken()
  if (!token) {
    return NextResponse.json(
      { message: "The route page is not configured." },
      { status: 503 },
    )
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ROUTE_COOKIE, token, cookieOptions(COOKIE_MAX_AGE))
  return response
}
