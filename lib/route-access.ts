/**
 * The lock on /the-route.
 *
 * The running order names the meeting point, and the meeting point is not
 * public: `home.essentials.where.value` says it goes out to people who
 * register. So the page is gated, and the gate has to be a real one —
 * the words are only ever rendered on the server, for a request that has
 * already proved it knows the password. Nothing is sent to a browser that
 * has not, and there is no client-side "check" that could be stepped over
 * by opening the developer tools.
 *
 * What the visitor holds is not the password. It is a signed note saying
 * "this browser answered correctly, and this is when that expires",
 * signed with the password itself as the key. That means:
 *
 *   - the password is never stored in a cookie, so a stolen cookie does
 *     not hand over the password itself;
 *   - changing ROUTE_PASSWORD invalidates every note ever issued, which
 *     is exactly what someone changing it wants;
 *   - and the server keeps no session state, which matters on a
 *     serverless host where there is no one server to keep it on.
 *
 * Web Crypto rather than `node:crypto` throughout, so the same module can
 * be read from a server component, a route handler, or the edge, and
 * there is only one implementation to get right.
 */

/** How long a correct answer is remembered for. Long enough to cover the
 *  run-up to the day and the day itself without asking twice. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000

export const ROUTE_COOKIE = "wzd_route"

/** The label mixed into every signature, so a note minted for this lock
 *  cannot be replayed against another one that ever shares the key. */
const CONTEXT = "wzd-route-access-v1"

function password(): string | undefined {
  const value = process.env.ROUTE_PASSWORD
  return value && value.length > 0 ? value : undefined
}

/** Whether a lock exists at all. With no password set the page stays shut
 *  rather than falling open: an unconfigured deploy must not be the way
 *  the meeting point gets out. */
export function isConfigured(): boolean {
  return password() !== undefined
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function sign(message: string, key: string): Promise<string> {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  return toHex(await crypto.subtle.sign("HMAC", k, enc.encode(message)))
}

/**
 * Compared without an early exit, so the time taken says nothing about
 * how much of the signature was right. The same reasoning as
 * `timingSafeEqual` in /api/revalidate; this one is written out because
 * `node:crypto` is not there on the edge.
 */
function equalConstantTime(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** The cookie value to hand a browser that has just answered correctly. */
export async function mintToken(): Promise<string | null> {
  const key = password()
  if (!key) return null
  const expires = Date.now() + TTL_MS
  return `${expires}.${await sign(`${CONTEXT}:${expires}`, key)}`
}

/** Whether a cookie value is one we signed and has not run out. */
export async function verifyToken(value: string | undefined): Promise<boolean> {
  const key = password()
  if (!key || !value) return false
  const dot = value.indexOf(".")
  if (dot <= 0) return false
  const expires = Number(value.slice(0, dot))
  if (!Number.isFinite(expires) || expires <= Date.now()) return false
  const expected = await sign(`${CONTEXT}:${expires}`, key)
  return equalConstantTime(value.slice(dot + 1), expected)
}

/**
 * Whether a submitted password is the right one.
 *
 * Both sides are hashed before they are compared, so the comparison runs
 * over two fixed-length hex strings whatever was typed: a wrong answer of
 * the wrong length then costs exactly as much time as a wrong answer of
 * the right length, and the length of the real password stays private.
 */
export async function passwordMatches(given: unknown): Promise<boolean> {
  const key = password()
  if (!key || typeof given !== "string") return false
  const [a, b] = await Promise.all([
    sign(given, CONTEXT),
    sign(key, CONTEXT),
  ])
  return equalConstantTime(a, b)
}

/** The cookie attributes, in one place so the setter and any future
 *  clearer cannot disagree about scope. */
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  }
}

export const COOKIE_MAX_AGE = Math.floor(TTL_MS / 1000)
