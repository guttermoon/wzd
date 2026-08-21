import { NextResponse } from "next/server"

/**
 * The newsletter signup, posted from our own form.
 *
 * The list lives in Brevo. Rather than embed their form, which arrives
 * with its own stylesheet, its own Roboto webfont and its own JavaScript,
 * the form is the site's own and the address is handed on from here.
 * Nothing third party runs in the visitor's browser, so this needs no
 * consent: the only thing that happens in the page is a post to our own
 * origin. That was the reason for doing it this way when the list was on
 * paa.ge, and it is the reason now.
 *
 * ── Why the API and not the embed's endpoint ─────────────────────────
 *
 * Brevo's embed posts to a `sibforms.com/serve/...` address which answers
 * with a redirect and a page of HTML. A server cannot read that and know
 * whether the address was actually added; it can only guess from a status
 * code that is 200 either way. The contacts API answers 201 when it
 * creates a contact and 204 when it updates one, which is something worth
 * checking rather than assuming, and it is what lets this route tell the
 * form the difference between "done" and "that did not go through".
 *
 * ── If it is not configured ─────────────────────────────────────────
 *
 * `BREVO_API_KEY` is the same key the photograph submissions use. Without
 * it this answers 503 and the form offers a way to be added by hand, so a
 * missing environment variable costs a signup rather than losing one
 * silently.
 *
 * `BREVO_LIST_ID` picks the list. It defaults to 7, "WZDNewsletter".
 * Not 2, which is "DGCNewsletter" and belongs to the club rather than to
 * the walk; the two are easy to confuse and should not be mixed.
 */
export const runtime = "nodejs"
export const preferredRegion = "lhr1"

const ENDPOINT = process.env.BREVO_CONTACTS_URL || "https://api.brevo.com/v3/contacts"
const LIST_ID = Number(process.env.BREVO_LIST_ID || 7)

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
  let email: unknown
  try {
    email = (await request.json())?.email
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 })
  }

  if (!looksLikeAnAddress(email)) {
    return NextResponse.json({ error: "bad-email" }, { status: 400 })
  }

  const key = process.env.BREVO_API_KEY
  if (!key) {
    console.error("newsletter: BREVO_API_KEY is not set")
    return NextResponse.json({ reason: "unconfigured" }, { status: 503 })
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      // updateEnabled so that someone signing up again is added back to
      // the list rather than refused as a duplicate. Re-subscribing is a
      // thing people do, and it should not read as an error.
      body: JSON.stringify({
        email,
        listIds: [LIST_ID],
        updateEnabled: true,
      }),
      signal: AbortSignal.timeout(8000),
    })

    // 201 created, 204 updated. Anything else is a failure worth logging.
    if (!response.ok) {
      console.error(
        `newsletter: upstream ${response.status} ${(await response.text()).slice(0, 200)}`,
      )
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
  } catch (error) {
    console.error("newsletter: upstream unreachable", error)
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
