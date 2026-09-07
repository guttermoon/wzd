import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

/**
 * Everything is crawlable except the API, which has nothing to index: two
 * routes that only answer POST and one that describes itself. Excluding
 * them keeps them out of Search Console's coverage report, where they
 * would otherwise show up as errors nobody should act on.
 *
 * /go/ is excluded for a different reason. It has nothing to index either
 * — every one of those addresses is a redirect — but the point is that it
 * should never compete in a search result with the page it forwards to,
 * and its destination is meant to change, which is the opposite of what
 * an indexed URL promises. The route sends `X-Robots-Tag: noindex` as
 * well; this is the half a crawler reads before it asks.
 *
 * The sitemap is named here as well as submitted in Search Console —
 * that is what lets every other crawler find it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/go/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
