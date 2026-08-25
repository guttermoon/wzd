import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

/**
 * Everything is crawlable except the API, which has nothing to index: two
 * routes that only answer POST and one that describes itself. Excluding
 * them keeps them out of Search Console's coverage report, where they
 * would otherwise show up as errors nobody should act on.
 *
 * The sitemap is named here as well as submitted in Search Console —
 * that is what lets every other crawler find it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
