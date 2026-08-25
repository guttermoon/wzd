/**
 * A cap on how often one caller can use the routes that send mail.
 *
 * Both of them hand work to Brevo on the owner's account and with the
 * owner's verified sender. Uncapped, /api/newsletter will ask Brevo to
 * send a confirmation email to any address given to it, as fast as it is
 * asked: someone else's inbox filled in the walk's name, the account's
 * sending quota spent, and the domain's reputation with it. Nothing about
 * that needs a flaw to exploit — it is the route working as designed,
 * called in a loop.
 *
 * ── What this is, and what it is not ─────────────────────────────────
 *
 * The counter lives in the memory of one serverless instance. Vercel runs
 * several and recycles them, so a determined caller spread across
 * instances gets more than the number below, and a quiet period can reset
 * a window early. This is a brake, not a gate: it ends the trivial version
 * of the abuse — a script hammering one endpoint — at no cost to a real
 * visitor, who sends one of these a year.
 *
 * A real gate needs shared state (Vercel KV, Upstash) and is worth adding
 * if this is ever actually attacked. Brevo's own account-level sending
 * limits are the backstop underneath both.
 */

type Window = { count: number; resetAt: number }

/**
 * Kept per bucket name so the two routes cannot spend each other's
 * allowance, and swept as it goes: an entry is only interesting until its
 * window closes, and without the sweep this map is a slow memory leak on a
 * long-lived instance.
 */
const windows = new Map<string, Window>()

/**
 * How many callers are tracked before the map is treated as an attack on
 * this instance's memory rather than a record of its visitors.
 *
 * The key is derived from `x-forwarded-for`, so anything talking to the
 * origin directly chooses its own and can mint a new one per request. A
 * map that only ever grows is then a slower version of the problem the
 * limit was added to solve.
 */
const MAX_TRACKED = 20_000

/**
 * Nothing is swept on an idle instance, so it is done on the way in:
 * first the entries whose window has closed, which is almost always
 * enough, and failing that the whole map.
 *
 * Clearing it forgives every caller currently being limited, which is the
 * right way to fail. The alternative — refusing new callers because the
 * map is full — lets anyone who can forge addresses lock every real
 * visitor out of the newsletter, turning a brake on abuse into the
 * mechanism of it.
 */
function sweep(now: number) {
  if (windows.size < 1000) return

  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }

  if (windows.size > MAX_TRACKED) {
    console.warn(
      `rate-limit: tracking ${windows.size} callers, over the ${MAX_TRACKED} ` +
        `cap — clearing. If this recurs the limit needs shared state.`,
    )
    windows.clear()
  }
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfter: number }

/**
 * Whether this caller may proceed, and how long to wait if not.
 *
 * A fixed window rather than a sliding one: it is a few lines, it cannot
 * drift, and the difference only matters at a precision this does not
 * claim to have.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = windows.get(key)
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { ok: true }
}

/**
 * Who is asking, as well as that can be known.
 *
 * `x-forwarded-for` is set by Vercel's edge for requests that arrive
 * through it, and the first entry is the client. It is a header, so it is
 * forgeable by anything that can reach the origin directly — which is the
 * ceiling on what the limit above is worth, and another reason it is
 * described as a brake. Requests with no address at all share one bucket
 * rather than escaping the limit.
 */
export function callerKey(request: Request, bucket: string): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  return `${bucket}:${ip}`
}
