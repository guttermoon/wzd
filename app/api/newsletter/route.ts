import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/site"

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
 * ── Double opt-in ───────────────────────────────────────────────────
 *
 * Nobody is added to the list by this route. It asks Brevo to send a
 * confirmation email, and the address joins the list only when the person
 * clicks the link in it. That is the difference between someone typing an
 * address and someone consenting to be written to, and it is worth having:
 * it keeps out typos and other people's addresses, and it means the list
 * is made of people who said yes twice.
 *
 * `BREVO_LIST_ID` picks the list. It defaults to 7, "WZDNewsletter". Not
 * 2, which is "DGCNewsletter" and belongs to the club rather than to the
 * walk; the two are easy to confuse and should not be mixed.
 *
 * `BREVO_DOI_TEMPLATE_ID` is the confirmation email, and it has to be a
 * template containing Brevo's `{{ doubleoptin }}` link or the recipient
 * has nothing to click. It defaults to 14, the walk's own copy of that
 * template, which goes out from megan@worldzombieday.co.uk as World
 * Zombie Day: London. Not 1, Brevo's default: that one is The Dead Good
 * Club's, and a confirmation from a name the reader does not recognise is
 * a confirmation nobody clicks.
 *
 * `BREVO_DOI_REDIRECT` is where clicking it lands them, and defaults to
 * the site root.
 */
export const runtime = "nodejs"
export const preferredRegion = "lhr1"

const ENDPOINT =
  process.env.BREVO_CONTACTS_URL ||
  "https://api.brevo.com/v3/contacts/doubleOptinConfirmation"
const LIST_ID = Number(process.env.BREVO_LIST_ID || 7)
const TEMPLATE_ID = Number(process.env.BREVO_DOI_TEMPLATE_ID || 14)
const REDIRECT = process.env.BREVO_DOI_REDIRECT || SITE_URL

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
      body: JSON.stringify({
        email,
        includeListIds: [LIST_ID],
        templateId: TEMPLATE_ID,
        redirectionUrl: REDIRECT,
      }),
      signal: AbortSignal.timeout(8000),
    })

    // 204 when the confirmation is on its way.
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 200)

      // Someone who is already on the list gets no second confirmation,
      // and Brevo says so with a duplicate error. From where they are
      // standing they have subscribed, which is what the form should tell
      // them: this is not a failure to report back.
      if (response.status === 400 && /duplicate|already/i.test(detail)) {
        console.warn(`newsletter: already subscribed (${detail})`)
        return NextResponse.json({ ok: true })
      }

      console.error(`newsletter: upstream ${response.status} ${detail}`)
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
  } catch (error) {
    console.error("newsletter: upstream unreachable", error)
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
