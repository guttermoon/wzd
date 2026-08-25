/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Lint is run separately; a lint warning shouldn't block a deploy.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // components/wordmark.tsx and components/brain-mark.tsx read these off
    // disk to inline them. public/ is served as static assets and is not
    // part of the serverless bundle, and the path is built at runtime, so
    // tracing cannot infer it: without this the read works during the
    // build and then throws ENOENT in the lambda. That took every page
    // regeneration down with it and froze the site on its last good
    // render — see lib/brand-art.ts.
    outputFileTracingIncludes: {
      "/**": ["./public/brand/*.svg"],
    },
  },
  images: {
    // Renditions are pre-built by scripts/prepare-images.mjs and served as
    // a plain <picture>, so there is nothing for the optimiser to do.
    unoptimized: true,
  },
  /**
   * Response headers the whole site gets.
   *
   * These are the ones that cost nothing and are missing by default. What
   * is deliberately *not* here is a script-restricting Content-Security-
   * Policy: /register and /donate load Zeffy's embed, which injects
   * scripts from origins we do not control and which in turn pull in
   * Stripe, hCaptcha and Google Pay. A `script-src` written without
   * knowing that list in full breaks the form that takes the money, and a
   * broken booking form is a worse outcome than a missing header. It is
   * worth doing properly — in report-only first, with the real list read
   * off a live /register — and it is not worth guessing at.
   *
   * `frame-ancestors` is safe to set on its own: it restricts who may put
   * this site in a frame and says nothing about what may run inside it.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nothing here is meant to be reinterpreted by sniffing. Chiefly
          // this stops a response typed as text from being run as script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Nobody else frames this site, so clickjacking has nothing to
          // work with. Both spellings: the second is the modern one and
          // the first is what older browsers read.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          // Outbound links carry the origin but not the path. The path is
          // the part that says which page someone was reading.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Features this site has no use for, switched off so an embedded
          // third party cannot ask for them either. `payment` is
          // deliberately absent rather than set: it defaults to `self`,
          // which is what the Zeffy form is already working under, and
          // naming it here would mean changing that by accident.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          // Two years, and no `includeSubDomains`: subdomains of
          // worldzombieday.co.uk are not all known from in here, and a
          // subdomain still served over http would become unreachable
          // rather than merely insecure. Add it once they are accounted
          // for.
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ]
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
