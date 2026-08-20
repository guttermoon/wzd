import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/site"

/**
 * The newsletter signup, posted from our own form.
 *
 * The list lives on paa.ge, whose backend is lama.co. Rather than embed
 * their page in an iframe, which cannot be styled, cannot be made to
 * match, and brought their cookie notice and their analytics onto every
 * page of ours, the form is the site's own and the address is handed on
 * from here. Nothing third party runs in the visitor's browser, so this
 * needs no consent: the only thing that happens in the page is a post to
 * our own origin.
 *
 * The endpoint is the one paa.ge's own form posts to, read off the
 * `subscribe` request in the network panel. It is public — it is in their
 * page's JavaScript — so it lives here rather than in a secret, and the
 * collection id is what ties it to this site's list.
 *
 * Three environment variables override the defaults if any of it changes:
 * PAAGE_SIGNUP_URL, PAAGE_SIGNUP_FIELD (the name of the field the address
 * goes in), and PAAGE_SIGNUP_FORMAT (`json` or `form`). JSON is the
 * default because their page sends a CORS preflight before the request,
 * which a plain form post would not trigger.
 */
export const runtime = "nodejs"
/**
 * London, so that when paa.ge geolocates a subscriber from the address the
 * request arrives on, an unforwarded one at least lands in the right
 * country rather than in whichever data centre happened to serve it.
 */
export const preferredRegion = "lhr1"

const DEFAULT_ENDPOINT =
  "https://api.lama.co/store/page-collections/page_collection_01M038F7C22B8QVP0N9ZQMQ2NH/subscribe"

const ENDPOINT = process.env.PAAGE_SIGNUP_URL || DEFAULT_ENDPOINT
const FIELD = process.env.PAAGE_SIGNUP_FIELD ?? "email"
const FORMAT = process.env.PAAGE_SIGNUP_FORMAT === "form" ? "form" : "json"

/** Where a browser would say it was posting from, had it posted directly. */
const PAGE_URL = "https://paa.ge/worldzombieday/email-signup"

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

  const [contentType, body] =
    FORMAT === "form"
      ? [
          "application/x-www-form-urlencoded",
          new URLSearchParams({ [FIELD]: email }).toString(),
        ]
      : ["application/json", JSON.stringify({ [FIELD]: email })]

  // The visitor's address, forwarded. paa.ge geolocates a subscriber from
  // the address the request arrives on, and posting from the server means
  // that address is the server's: every signup was landing in Ashburn,
  // Virginia. This is the standard header for saying who a proxied request
  // is really from. Whether they act on it is theirs to decide, and
  // preferredRegion above is the fallback if they do not.
  //
  // x-forwarded-for accumulates a list, client first, so take the head and
  // pass on only that: the rest is our own infrastructure and no business
  // of theirs.
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": contentType,
        accept: "application/json",
        // Server to server there is no CORS, but an endpoint built for a
        // browser may still check where the request says it came from.
        origin: SITE_URL,
        referer: PAGE_URL,
        ...(clientIp ? { "x-forwarded-for": clientIp, "x-real-ip": clientIp } : {}),
      },
      body,
      // Their endpoint is not ours to wait on indefinitely.
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      // The status and a little of the body, in the server log only: the
      // visitor gets "that did not go through" and a way round it, and
      // whoever is on call gets enough to tell a rejected address from a
      // changed endpoint.
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
