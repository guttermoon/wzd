import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

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
    <PageShell title={<T k="faq.title" />} standfirst={<T k="faq.standfirst" />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Native <details>: keyboard-operable and readable before hydration. */}
      <div className="mt-10 border-t-2 border-edge">
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

      <Section>
        <Photo
          photo={photo("zombie-dog")}
          sizes="(min-width: 48rem) 32rem, 100vw"
          className="max-w-lg"
          caption="Yes, dogs really are welcome."
        />
      </Section>

      <Section title={<T k="faq.more.title" />}>
        <p className="prose-wzd font-body">
          <T k="faq.more.body" />
        </p>
        <a href={`mailto:${EVENT.email}`} className="btn btn-primary mt-6">
          Email us
        </a>
      </Section>
    </PageShell>
  )
}
