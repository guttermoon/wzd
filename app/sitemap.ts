import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getAllPosts } from "@/lib/notion"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/blog", "/about", "/contact", "/categories"].map(
    (path) => ({
      url: `${SITE_URL}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    }),
  )

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    postRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  } catch {
    // Notion unavailable — ship the static routes only
  }
  return [...staticRoutes, ...postRoutes]
}
