import { NextResponse } from "next/server"
import { EVENT } from "@/lib/event"

/**
 * Photograph submissions, posted from the site's own form and delivered
 * as an email to whoever handles them.
 *
 * There is no database behind this on purpose. A submission is three
 * lines of text and a link to someone else's Drive folder; it wants to
 * arrive in an inbox where it can be replied to, not sit in a table
 * waiting for someone to remember it.
 *
 * ── If it is not configured ──────────────────────────────────────────
 *
 * Sending needs a key, and a key is something the owner has to add. Until
 * `BREVO_API_KEY` is set this returns 503 with `reason: "unconfigured"`,
 * and the form turns itself into a pre-filled mail link so the visitor
 * can send exactly the same thing from their own client. That matters
 * more than it sounds: a photographer who has just typed out where their
 * folder is should never lose it to a missing environment variable.
 *
 * Brevo because it is the transactional sender this project already has
 * an account with. `PHOTO_SUBMISSIONS_URL` and `PHOTO_SUBMISSIONS_FROM`
 * override the endpoint and the from-address if that ever changes.
 */
export const runtime = "nodejs"
export const preferredRegion = "lhr1"

const ENDPOINT =
  process.env.PHOTO_SUBMISSIONS_URL || "https://api.brevo.com/v3/smtp/email"

/**
 * From and to are the same address, and that is deliberate.
 *
 * Brevo will only send from a sender it has verified, and the verified
 * one on this account is Megan's, with DKIM and DMARC set up on the
 * domain behind it. Sending from anything else is refused, so a
 * submission arrives from her address as well as to it, which is the
 * ordinary shape of a form notification.
 *
 * It is not sent from the photographer either way: their address would
 * fail SPF and DKIM for a domain that is not theirs, and the form does
 * not ask for one.
 *
 * `PHOTO_SUBMISSIONS_FROM` overrides it if another sender is verified
 * later.
 */
const FROM = process.env.PHOTO_SUBMISSIONS_FROM || EVENT.photoSubmissions
const TO = process.env.PHOTO_SUBMISSIONS_TO || EVENT.photoSubmissions

/** Long enough for a folder full of links, short enough not to be a dump. */
const LIMITS = { credit: 300, links: 4000, notes: 4000 } as const

const text = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : ""

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 })
  }

  const credit = text(body?.credit, LIMITS.credit)
  const links = text(body?.links, LIMITS.links)
  const notes = text(body?.notes, LIMITS.notes)

  // The two the form marks required. Checked here as well as in the page,
  // because a form is only a suggestion once it has left the browser.
  if (!credit || !links) {
    return NextResponse.json({ error: "Missing credit or links" }, { status: 400 })
  }

  const key = process.env.BREVO_API_KEY
  if (!key) {
    return NextResponse.json({ reason: "unconfigured" }, { status: 503 })
  }

  // Plain text, because that is what it is. Anything a submitter typed is
  // someone else's input arriving in an inbox, so it goes in the body as
  // text and never as markup.
  const lines = [
    `Credit: ${credit}`,
    "",
    "Links:",
    links,
    ...(notes ? ["", "Notes:", notes] : []),
  ].join("\n")

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: FROM, name: "World Zombie Day: London" },
        to: [{ email: TO }],
        subject: `Photo submission from ${credit}`,
        textContent: lines,
      }),
    })
    if (!response.ok) {
      console.error("Photo submission failed:", response.status, await response.text())
      return NextResponse.json({ error: "Upstream refused" }, { status: 502 })
    }
  } catch (error) {
    console.error("Photo submission could not be sent:", error)
    return NextResponse.json({ error: "Could not send" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
