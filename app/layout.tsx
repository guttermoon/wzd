import type React from "react"
import type { Metadata } from "next"
import { Grandstander, Raleway } from "next/font/google"

import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VhsFilter } from "@/components/vhs-filter"
import { ConsentBanner } from "@/components/consent-banner"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { getSiteCopy } from "@/lib/site-copy"
import { EVENT } from "@/lib/event"
import { SITE_URL } from "@/lib/site"
import { jsonLd } from "@/lib/json-ld"

/**
 * Display type. Grandstander in all caps stands in for the Saul Bass hand
 * lettering of the old site — set with text-transform, never typed as
 * capitals, so screen readers still read words rather than letters.
 */
const grandstander = Grandstander({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

const title = "World Zombie Day: London"
const description =
  "A free, family-friendly Community Fundraising event: a zombie walk through central London. Saturday 10 October 2026."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${title}` },
  description,
  alternates: { canonical: "/" },
  keywords: [
    "World Zombie Day",
    "zombie walk London",
    "London events",
    "community fundraiser",
    "Halloween London",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: title,
    images: [{ url: "/photos/bridge-horde-1600.jpg", width: 1600, height: 1199 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/photos/bridge-horde-1600.jpg"],
  },
  /**
   * Google Search Console's meta-tag verification, when it is being used.
   *
   * Set GOOGLE_SITE_VERIFICATION to the token out of the
   * `<meta name="google-site-verification" content="…">` snippet Search
   * Console offers — the content value on its own, not the whole tag.
   * Left unset, nothing is rendered, which is the right default: an empty
   * verification tag is worse than none.
   *
   * The DNS TXT method is the better one if the domain's DNS is to hand,
   * because it verifies the whole domain rather than one deployment and
   * survives the site being rebuilt by someone who does not know this
   * variable exists. This is here for when it is not.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: title,
      description,
      inLanguage: "en-GB",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: title,
      url: SITE_URL,
      email: EVENT.email,
      logo: `${SITE_URL}/brand/wordmark.svg`,
      sameAs: EVENT.social.map((s) => s.url),
    },
    {
      "@type": "Event",
      "@id": `${SITE_URL}/#event`,
      name: `${title} 2026`,
      description,
      url: SITE_URL,
      startDate: EVENT.startsAt,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      // No street address, and that is not an omission: the meeting point
      // goes to people who have registered, which is the whole reason
      // registration exists. A Place with a locality is what can honestly
      // be published, and it is enough for Google to place the event in
      // London.
      location: {
        "@type": "Place",
        name: "Central London",
        address: {
          "@type": "PostalAddress",
          addressLocality: EVENT.locality,
          addressRegion: EVENT.region,
          addressCountry: EVENT.country,
        },
      },
      organizer: { "@id": `${SITE_URL}/#organization` },
      isAccessibleForFree: true,
      // Free, but ticketed — the walk costs nothing and still wants a
      // registration. Spelling that out as an Offer of 0 is what makes a
      // search result say "Free" and link to the right page; without it
      // `isAccessibleForFree` alone is frequently ignored.
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/register`,
        category: "Free",
      },
      // The after party is a real separate event at a real address, so it
      // can carry the one thing the walk cannot: somewhere to go.
      subEvent: {
        "@type": "Event",
        name: `${EVENT.afterParty.venue} after party`,
        startDate: EVENT.afterParty.startsAt,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        url: `${SITE_URL}/register`,
        location: {
          "@type": "Place",
          name: EVENT.afterParty.venue,
          address: EVENT.afterParty.address,
        },
        organizer: { "@id": `${SITE_URL}/#organization` },
      },
      image: [
        `${SITE_URL}/photos/bridge-horde-1600.jpg`,
        `${SITE_URL}/photos/the-horde-1600.jpg`,
      ],
    },
  ],
}

export const revalidate = 60

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const copy = await getSiteCopy()

  return (
    <html
      lang="en-GB"
      // next-themes writes the class before paint; React must not complain.
      suppressHydrationWarning
      className={`${grandstander.variable} ${raleway.variable}`}
    >
      <body className="font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-rule focus:bg-bg focus:px-4 focus:py-3 focus:text-text"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer copy={copy} />
          <Analytics />
          <VhsFilter />
          {/* Last in the layout, so it is last in the tab order. */}
          <ConsentBanner
            copy={{
              title: copy["site.consent.title"] ?? "",
              body: copy["site.consent.body"] ?? "",
              link: copy["site.consent.link"] ?? "",
              accept: copy["site.consent.accept"] ?? "",
              reject: copy["site.consent.reject"] ?? "",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
