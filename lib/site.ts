/**
 * The absolute origin, used for canonical URLs, the sitemap, robots.txt,
 * Open Graph and the structured data.
 *
 * Set `NEXT_PUBLIC_SITE_URL` in production. It is read at **build** time —
 * Next inlines it — so a deploy without it produces a sitemap and
 * canonicals pointing at the Vercel deployment URL rather than the real
 * domain.
 *
 * ── Why it is normalised ─────────────────────────────────────────────
 *
 * Everything downstream joins onto this with a leading slash of its own:
 * `${SITE_URL}/sitemap.xml`, `${SITE_URL}${path}`, `${SITE_URL}/#event`.
 * So an origin entered with a trailing slash — which is exactly how a
 * browser offers it when you copy the address, and what most people would
 * paste — yields `https://example.com//sitemap.xml` in robots.txt, a
 * doubled slash on every URL in the sitemap, and a structured-data image
 * that does not load.
 *
 * None of that fails a build or a check. It fails quietly, in the files
 * only a crawler reads, which is the worst place for it. The value is
 * cleaned here instead of asking whoever sets the variable to know this.
 *
 * A whole path is left alone beyond its trailing slash: a site served from
 * a subdirectory is a legitimate thing, even if this one isn't.
 */
function normalise(url: string): string {
  return url.trim().replace(/\/+$/, "")
}

export const SITE_URL = normalise(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
)
