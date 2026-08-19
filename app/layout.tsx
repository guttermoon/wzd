import type React from "react"
import type { Metadata } from "next"
import {
  Anton,
  Newsreader,
  Courier_Prime,
  Archivo,
  Oswald,
  Playfair_Display,
  Libre_Baskerville,
  Special_Elite,
  Spicy_Rice,
  Grandstander,
} from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VintageFooter } from "@/components/vintage-footer"
import { Toaster } from "@/components/ui/toaster"
import { getCategories } from "@/lib/notion"
import { getHomeText } from "@/lib/homepage-content"
import { SITE_URL } from "@/lib/site"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-grotesk",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-oswald",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
})

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-basker",
})

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-typewriter",
})

const spicyRice = Spicy_Rice({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-spicy",
})

const grandstander = Grandstander({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-grand",
})

const archivoBold = Archivo({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-archblack",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "The Dead Good Club",
  description:
    "A dead good periodical. Dispatches, features, and curiosities — printed on digital paper, powered by Notion.",
  keywords: ["blog", "magazine", "notion", "cms", "vintage", "zine"],
  authors: [{ name: "The Dead Good Club" }],
  openGraph: {
    title: "The Dead Good Club",
    description:
      "A dead good periodical. Dispatches, features, and curiosities — printed on digital paper.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "The Dead Good Club",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dead Good Club",
    description:
      "A dead good periodical. Dispatches, features, and curiosities — printed on digital paper.",
    images: ["/og.jpg"],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "The Dead Good Club",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "The Dead Good Club",
      description:
        "A dead good periodical. Dispatches, features, and curiosities — printed on digital paper.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
}

export const revalidate = 60

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()
  const homeContent = await getHomeText()

  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${newsreader.variable} ${courierPrime.variable} ${archivo.variable} ${oswald.variable} ${playfair.variable} ${libreBaskerville.variable} ${specialElite.variable} ${spicyRice.variable} ${grandstander.variable} ${archivoBold.variable} font-serif paper`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header categories={categories} />
        <main>{children}</main>
        <VintageFooter content={homeContent} />
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
