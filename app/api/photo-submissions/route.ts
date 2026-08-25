import { NextResponse } from "next/server"
import { EVENT } from "@/lib/event"
import { brevoPost } from "@/lib/brevo"
import { callerKey, rateLimit } from "@/lib/rate-limit"

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
 *
 * ── Why it is rate limited ──────────────────────────────────────────
 *
 * It sends mail on the owner's account, to the owner's inbox, for anyone
 * who can reach the URL. Capped, an abusive caller wastes their own time;
 * uncapped, they bury a real submission under a thousand fakes and spend
 * the sending quota that the newsletter shares. See lib/rate-limit.ts for
 * how much the cap is actually worth.
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

/**
 * A subject line is one line.
 *
 * The credit is typed by a stranger and goes into the `subject` field, and
 * a subject is a mail header wherever this ends up — Brevo's API takes it
 * as JSON, but what it writes is SMTP, and a header that contains a
 * newline is two headers. Nothing here relies on Brevo rejecting it: the
 * line breaks and control characters come out before it is sent, and the
 * whole credit is in the body anyway, where it can say what it likes.
 */
const oneLine = (value: string): string =>
  // eslint-disable-next-line no-control-regex
  value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim()

export async function POST(request: Request) {
  const limit = rateLimit(callerKey(request, "photo-submissions"), {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate-limited" },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 })
  }

  const fields = (body ?? {}) as Record<string, unknown>
  const credit = text(fields.credit, LIMITS.credit)
  const links = text(fields.links, LIMITS.links)
  const notes = text(fields.notes, LIMITS.notes)
  // Whether they confirmed the folder is reachable. Not required of them,
  // but the answer saves a round trip when it turns out not to be.
  const access = fields.access === true

  // The two the form marks required. Checked here as well as in the page,
  // because a form is only a suggestion once it has left the browser.
  if (!credit || !links) {
    return NextResponse.json({ error: "Missing credit or links" }, { status: 400 })
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
    "",
    `Access confirmed: ${access ? "yes" : "no"}`,
  ].join("\n")

  const result = await brevoPost(
    ENDPOINT,
    {
      sender: { email: FROM, name: "World Zombie Day: London" },
      to: [{ email: TO }],
      subject: `Photo submission from ${oneLine(credit)}`,
      textContent: lines,
    },
    "photo-submission",
  )

  switch (result.status) {
    case "sent":
      return NextResponse.json({ ok: true })

    case "unconfigured":
      // The form turns itself into a pre-filled mailto: rather than losing
      // what they typed. That fallback is the point, not a nicety.
      return NextResponse.json({ reason: "unconfigured" }, { status: 503 })

    case "refused":
      console.error(`photo-submission: upstream ${result.code} ${result.detail}`)
      return NextResponse.json({ error: "Upstream refused" }, { status: 502 })

    default:
      return NextResponse.json({ error: "Could not send" }, { status: 502 })
  }
}
