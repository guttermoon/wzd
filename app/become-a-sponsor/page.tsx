import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Become a sponsor",
  description:
    "Sponsorship options for World Zombie Day: London: on-site promotion and online prize giveaways, raising funds for a good cause.",
  alternates: { canonical: "/become-a-sponsor" },
}

export default async function SponsorsPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)

  return (
    <PageShell
      title={<T k="sponsors.title" />}
      titleText={S("sponsors.title")}
      standfirst={<T k="sponsors.standfirst" />}
      banner={
        <Photo
          photo={photo("groaning-group")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <div className="prose-wzd mt-8">
        <p><T k="sponsors.intro1" /></p>
        <p><T k="sponsors.intro2" /></p>
      </div>

      <Section title={<T k="sponsors.options.title" />}>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="cut-panel p-6">
            <h3 className="display text-xl"><T k="sponsors.onsite.title" /></h3>
            <p className="display mt-2 text-accent-text"><T k="sponsors.onsite.amount" /></p>
            <div className="prose-wzd mt-4 font-body">
              <p><T k="sponsors.onsite.body1" /></p>
              <p><T k="sponsors.onsite.body2" /></p>
            </div>
            <h4 className="display mt-6 text-base">
              <T k="sponsors.onsite.examples.title" />
            </h4>
            <ul className="mt-3 list-disc space-y-1 pl-5 font-body">
              <li><T k="sponsors.onsite.example1" /></li>
              <li><T k="sponsors.onsite.example2" /></li>
              <li><T k="sponsors.onsite.example3" /></li>
            </ul>
            <h4 className="display mt-6 text-base">
              <T k="sponsors.onsite.noflyering.title" />
            </h4>
            <p className="mt-2 font-body"><T k="sponsors.onsite.noflyering.body" /></p>
          </article>

          <article className="cut-panel p-6">
            <h3 className="display text-xl"><T k="sponsors.prize.title" /></h3>
            <p className="display mt-2 text-accent-text"><T k="sponsors.prize.amount" /></p>
            <p className="prose-wzd mt-4 font-body"><T k="sponsors.prize.body" /></p>
            <ul className="mt-4 list-disc space-y-2 pl-5 font-body">
              <li><T k="sponsors.prize.item1" /></li>
              <li><T k="sponsors.prize.item2" /></li>
            </ul>
          </article>
        </div>
      </Section>

      <Section>
        <Photo
          photo={photo("kissing-booth")}
          bleed="full"
          ratio="5/2"
          sizes="100vw"
          className="breakout"
        />
      </Section>

      <Section title={<T k="sponsors.contact.title" />}>
        <p className="prose-wzd font-body"><T k="sponsors.contact.body" /></p>
        <Cta
          k="sponsors.contact.cta"
          href={`mailto:${EVENT.email}`}
          className="btn btn-primary mt-6"
        />
      </Section>
    </PageShell>
  )
}
