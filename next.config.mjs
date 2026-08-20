/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Lint is run separately; a lint warning shouldn't block a deploy.
    ignoreDuringBuilds: true,
  },
  images: {
    // Renditions are pre-built by scripts/prepare-images.mjs and served as
    // a plain <picture>, so there is nothing for the optimiser to do.
    unoptimized: true,
  },
  async redirects() {
    // The old WordPress URLs — these are indexed and linked from a decade
    // of press coverage, so none of them should 404.
    return [
      { source: "/about-2", destination: "/", permanent: true },
      // /survival is the live URL and stays that way; /rules was only
      // ever ours, so it redirects rather than the other way round.
      { source: "/rules", destination: "/survival", permanent: true },
      { source: "/sponsors", destination: "/become-a-sponsor", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/zombiedigest", destination: "/", permanent: true },
      { source: "/gallery", destination: "/press", permanent: true },
      { source: "/win", destination: "/", permanent: true },
      { source: "/map", destination: "/faq", permanent: true },
      { source: "/t-shirts", destination: "/", permanent: true },
      // The blog that used to live here is gone; send readers to the news
      // they can actually use.
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug", destination: "/", permanent: true },
      { source: "/category/:slug", destination: "/", permanent: true },
      { source: "/categories", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/contact", destination: "/faq", permanent: true },
    ]
  },
}

export default nextConfig
