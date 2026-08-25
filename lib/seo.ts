import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import { EVENT } from "@/lib/event"

/**
 * Page metadata, in one place.
 *
 * Every page already declared a title, a description and a canonical, and
 * every page stopped there — which meant the Open Graph block in
 * app/layout.tsx was the only one, so a link to /register or /faq shared
 * to Facebook, WhatsApp or Discord carried the *homepage's* title and
 * description. For an event whose reach is mostly people forwarding a link
 * to each other, that is the wrong text on the most-shared surface.
 *
 * This builds all of it from the two strings a page actually has to
 * supply, so the per-page Open Graph and Twitter cards cannot drift from
 * the per-page title and description again.
 */

/** The share image. 4:3 rather than 1.91:1, so expect some cropping. */
const OG_IMAGE = {
  url: "/photos/bridge-horde-1600.jpg",
  width: 1600,
  height: 1199,
  alt: "A zombie with bloodied outstretched hands lunges towards the camera on Golden Jubilee Bridge, a crowd of costumed zombies behind him.",
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Without the site name — the layout's template appends that. */
  title: string
  description: string
  /** The canonical path, e.g. `/register`. */
  path: string
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`
  // The layout's title template appends the site name to `title`, but only
  // for the <title> tag; og:title is set literally, so it is spelled out
  // here or the shared card reads as a bare word like "FAQ".
  const shared = `${title} | ${EVENT.name}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shared,
      description,
      url,
      type: "website",
      locale: "en_GB",
      siteName: EVENT.name,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shared,
      description,
      images: [OG_IMAGE.url],
    },
  }
}

/**
 * Breadcrumbs, for the search result rather than the page.
 *
 * There is no breadcrumb trail in the design and there should not be — the
 * site is two levels deep and the nav is on every page. This is only the
 * machine-readable version, which is what lets a result show
 * "worldzombieday.co.uk › Register" instead of a bare URL.
 */
export function breadcrumbLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
}
