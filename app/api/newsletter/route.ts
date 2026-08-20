import { NextResponse } from "next/server"

/**
 * The newsletter signup, posted from our own form.
 *
 * The list lives on paa.ge. Rather than embed their page in an iframe,
 * which cannot be styled, cannot be made to match, and brings their cookie
 * notice onto ours, the form is the site's own and the address is handed
 * on from here. Nothing third party runs in the visitor's browser, so this
 * needs no consent: the only thing that happens is a form post to us.
 *
 * PAAGE_SIGNUP_URL is where the address goes. It is not committed because
 * it is paa.ge's endpoint and only they can say what it is: open the form
 * on paa.ge, submit it with the browser's network panel open, and copy the
 * request URL. If it wants named fields other than `email`, set
 * PAAGE_SIGNUP_FIELD to the name it uses.
 *
 * Unset, this returns 503 and the form falls back to a link to paa.ge, the
 * same way /api/revalidate refuses to run without its secret rather than
 * quietly doing nothing.
 */
export const runtime = "nodejs"

const ENDPOINT = process.env.PAAGE_SIGNUP_URL
const FIELD = process.env.PAAGE_SIGNUP_FIELD ?? "email"

/**
 * Deliberately loose. The only test that means anything is whether the
 * address accepts mail, and a regex that tries to be clever about it turns
 * away real addresses; this rejects the obvious typos and nothing else.
 */
function looksLikeAnAddress(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 320 &&
    /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value)
  )
}

export async function POST(request: Request) {
  if (!ENDPOINT) {
    return NextResponse.json(
      { error: "not-configured" },
      { status: 503 },
    )
  }

  let email: unknown
  try {
    email = (await request.json())?.email
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 })
  }

  if (!looksLikeAnAddress(email)) {
    return NextResponse.json({ error: "bad-email" }, { status: 400 })
  }

  // Form-encoded, which is what an ordinary form post looks like and what
  // a page builder's endpoint is most likely to expect. If paa.ge wants
  // JSON, this is the one line to change.
  const body = new URLSearchParams({ [FIELD]: email })

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      // Their endpoint is not ours to wait on indefinitely.
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
