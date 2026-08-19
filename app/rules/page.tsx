import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Rules of conduct",
  description:
    "The zombie rules of conduct for World Zombie Day: London: safety, costumes, crossings and behaviour on the day.",
  alternates: { canonical: "/rules" },
}

const RULES = ["1", "2", "3", "4", "5", "6", "7", "8"]

export default async function RulesPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)

  return (
    <PageShell
      title={<T k="rules.title" />}
      titleText={S("rules.title")}
      standfirst={<T k="rules.standfirst" />}
      banner={
        <Photo
          photo={photo("steward-crossing")}
          priority
          bleed="full"
          ratio="32/9"
          sizes="100vw"
        />
      }
    >
      {/* A numbered list, not a set of headings: these are read in order. */}
      <ol className="prose-wzd mt-10 space-y-6">
        {RULES.map((n) => (
          <li key={n} className="flex gap-4">
            <span
              className="display shrink-0 text-3xl text-accent-text"
              aria-hidden="true"
            >
              {n}
            </span>
            <span className="font-body">
              <T k={`rules.${n}`} />
            </span>
          </li>
        ))}
      </ol>

      <p className="display mt-10 text-3xl text-accent-text">
        <T k="rules.outro" />
      </p>

      <Section title={<T k="rules.stewards.title" />}>
        <p className="prose-wzd font-body"><T k="rules.stewards.body" /></p>
      </Section>
    </PageShell>
  )
}
