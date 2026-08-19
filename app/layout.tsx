import type React from "react"
import type { Metadata } from "next"
import { Grandstander, Raleway } from "next/font/google"

import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { getSiteCopy } from "@/lib/site-copy"
import { EVENT } from "@/lib/event"
import { SITE_URL } from "@/lib/site"

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
  "A free, family-friendly charity zombie walk through central London. Saturday 10 October 2026."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s — ${title}` },
  description,
  alternates: { canonical: "/" },
  keywords: [
    "World Zombie Day",
    "zombie walk London",
    "London events",
    "charity walk",
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
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: title,
      url: SITE_URL,
      email: EVENT.email,
      sameAs: EVENT.social.map((s) => s.url),
    },
    {
      "@type": "Event",
      "@id": `${SITE_URL}/#event`,
      name: `${title} 2026`,
      description,
      startDate: EVENT.startsAt,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
      image: [`${SITE_URL}/photos/bridge-horde-1600.jpg`],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
        </ThemeProvider>
      </body>
    </html>
  )
}
