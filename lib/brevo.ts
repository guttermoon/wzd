/**
 * The one way this site talks to Brevo.
 *
 * Two routes send through it — the newsletter confirmation and the
 * photograph submissions — and they were each carrying their own copy of
 * the same twenty lines: read the key, post JSON with an `api-key` header,
 * decide what a non-2xx means, catch the throw. Two copies of a thing like
 * that drift, and one of them had already lost its timeout.
 *
 * What is deliberately *not* here is what a failure means to the visitor.
 * A duplicate contact is a success to the newsletter and would be nonsense
 * to a photograph submission, so this reports what happened and each route
 * decides what to make of it.
 */

/** Not configured, so nothing was attempted. */
export type BrevoUnconfigured = { status: "unconfigured" }
/** Brevo accepted it. */
export type BrevoSent = { status: "sent" }
/** Brevo answered, and refused. `detail` is their body, truncated. */
export type BrevoRefused = { status: "refused"; code: number; detail: string }
/** Brevo could not be reached, or took too long. */
export type BrevoUnreachable = { status: "unreachable" }

export type BrevoResult =
  | BrevoUnconfigured
  | BrevoSent
  | BrevoRefused
  | BrevoUnreachable

/**
 * Long enough for a slow upstream, short enough that a hung one does not
 * hold a serverless function open until the platform kills it. The
 * newsletter had this and the submissions route did not; both do now.
 */
const TIMEOUT_MS = 8000

/** Enough of a refusal to tell them apart in a log, not a whole page of it. */
const DETAIL_LIMIT = 200

/**
 * Post a payload to a Brevo endpoint.
 *
 * `label` only ever reaches the server log. The payload is not logged:
 * these carry an email address, and a refusal is worth recording while the
 * address it was for is not.
 */
export async function brevoPost(
  endpoint: string,
  payload: unknown,
  label: string,
): Promise<BrevoResult> {
  const key = process.env.BREVO_API_KEY
  if (!key) {
    console.error(`${label}: BREVO_API_KEY is not set`)
    return { status: "unconfigured" }
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (response.ok) return { status: "sent" }

    const detail = (await response.text()).slice(0, DETAIL_LIMIT)
    return { status: "refused", code: response.status, detail }
  } catch (error) {
    console.error(`${label}: upstream unreachable`, error)
    return { status: "unreachable" }
  }
}
