import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"

export const revalidate = 60
export const metadata: Metadata = {
  title: "FAQ",
  description:
    "When is World Zombie Day: London, where does it start, is it family-friendly, are dogs allowed, and what should you wear?",
  alternates: { canonical: "/faq" },
}

const QUESTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default async function FaqPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)

  // Mirrors the visible copy so search engines get the same answers.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((n) => ({
      "@type": "Question",
      name: copy[`faq.q${n}`],
      acceptedAnswer: { "@type": "Answer", text: copy[`faq.a${n}`] },
    })),
  }

  return (
    <PageShell
      title={<T k="faq.title" />}
      titleText={S("faq.title")}
      standfirst={<T k="faq.standfirst" />}
      banner={
        <Photo
          photo={photo("london-eye-pair")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* The questions and the dog run side by side: a wedge down the right
          of the list rather than a rectangle dropped underneath it. The
          panel sticks as the answers open and close, so it stays beside
          the questions instead of stranding itself at the top. */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Native <details>: keyboard-operable and readable before hydration. */}
        <div className="border-t-2 border-edge lg:col-span-8">
          {QUESTIONS.map((n) => (
            <details key={n} className="group border-b-2 border-edge">
              <summary className="display flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg [&::-webkit-details-marker]:hidden">
                <T k={`faq.q${n}`} />
                <span
                  aria-hidden="true"
                  className="shrink-0 text-accent-text transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="prose-wzd pb-5 font-body">
                <T k={`faq.a${n}`} />
              </p>
            </details>
          ))}
        </div>

        <Photo
          photo={photo("zombie-dog")}
          bleed="right"
          ratio="3/4"
          focus="55% 35%"
          sizes="(min-width: 64rem) 22rem, 100vw"
          className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start"
        />
      </div>

      <Section title={<T k="faq.more.title" />}>
        <p className="prose-wzd font-body">
          <T k="faq.more.body" />
        </p>
      </Section>
    </PageShell>
  )
}
