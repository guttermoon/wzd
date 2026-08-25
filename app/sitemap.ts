import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { NAV, FOOTER_NAV, LEGAL_NAV } from "@/lib/event"

/**
 * The sitemap submitted to Google Search Console, at /sitemap.xml.
 *
 * The routes come from the same nav arrays the site renders and
 * /api/revalidate accepts, so a page cannot be added to the site and
 * forgotten here — there is one list, not three.
 *
 * ── Why lastModified is not `new Date()` ─────────────────────────────
 *
 * It used to be, which meant every URL claimed to have changed at the
 * moment the sitemap was requested — and with 60-second revalidation that
 * is a fresh timestamp on all ten pages, several times an hour, forever.
 * A crawler that takes it at face value re-fetches pages that have not
 * changed; one that doesn't learns to ignore the field, which is worse,
 * because it is then ignoring it on the occasion the site really did
 * change.
 *
 * `BUILD_DATE` is honest instead: the copy comes from the build plus
 * whatever Notion has said since, and a deploy is the last moment the
 * page's structure actually changed. Vercel sets
 * `VERCEL_GIT_COMMIT_SHA`-adjacent variables but not a build timestamp, so
 * this is stamped at module evaluation — which happens once per build, not
 * once per request.
 */
const BUILD_DATE = new Date()

/**
 * What each page is worth relative to the others. Google has said for
 * years that it ignores `priority`, and it costs nothing to be accurate
 * anyway: the walk is the thing, registering for it is the action, and the
 * legal pages are there because they have to be.
 */
function weight(href: string): { priority: number; changeFrequency: "weekly" | "monthly" | "yearly" } {
  if (href === "/") return { priority: 1, changeFrequency: "weekly" }
  if (href === "/register" || href === "/donate") {
    return { priority: 0.9, changeFrequency: "weekly" }
  }
  if (href === "/privacy" || href === "/photo-policy") {
    return { priority: 0.3, changeFrequency: "yearly" }
  }
  return { priority: 0.7, changeFrequency: "monthly" }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...NAV, ...FOOTER_NAV, ...LEGAL_NAV].map((item) => item.href)

  // The nav arrays are hand-maintained, and a duplicate href in a sitemap
  // is the kind of thing Search Console reports as a warning rather than
  // an error, so it would sit there unnoticed.
  return [...new Set(routes)].map((href) => ({
    url: `${SITE_URL}${href === "/" ? "" : href}`,
    lastModified: BUILD_DATE,
    ...weight(href),
  }))
}
