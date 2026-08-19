// Absolute origin for canonical URLs, sitemap, robots, and JSON-LD.
// Set NEXT_PUBLIC_SITE_URL in production (falls back to the Vercel URL).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
