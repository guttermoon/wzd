import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { NAV, FOOTER_NAV } from "@/lib/event"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...NAV, ...FOOTER_NAV].map((item) => item.href)
  return routes.map((href) => ({
    url: `${SITE_URL}${href === "/" ? "" : href}`,
    lastModified: new Date(),
    changeFrequency: href === "/" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/register" ? 0.9 : 0.7,
  }))
}
