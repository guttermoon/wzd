import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo, allPhotos } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Photo policy",
  description:
    "Photography and filming at World Zombie Day: London — consent, the schedule, commercial restrictions, and how to credit.",
  alternates: { canonical: "/photo-policy" },
}

export default async function PhotoPolicyPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)

  // One entry per photographer, in first-appearance order.
  const photographers = [...new Map(allPhotos().map((p) => [p.credit, p])).values()]

  return (
    <PageShell title={<T k="photo.title" />} standfirst={<T k="photo.standfirst" />}>
      <div className="prose-wzd mt-8">
        <p><T k="photo.intro1" /></p>
        <p><T k="photo.intro2" /></p>
        <ul className="list-disc space-y-2 pl-5">
          <li><T k="photo.basics.1" /></li>
          <li><T k="photo.basics.2" /></li>
          <li><T k="photo.basics.3" /></li>
        </ul>
      </div>

      <Section title={<T k="photo.credit.title" />}>
        <blockquote className="cut-panel p-6 font-body italic">
          <T k="photo.credit.body" />
        </blockquote>
        <p className="prose-wzd mt-4 font-body"><T k="photo.credit.tags" /></p>
      </Section>

      <Section>
        <Photo
          photo={photo("selfie")}
          bleed="full"
          ratio="2/1"
          sizes="100vw"
          className="breakout"
        />
      </Section>

      <Section title={<T k="photo.rules.title" />}>
        <div className="space-y-10">
          <article>
            <h3 className="display text-xl"><T k="photo.rule1.title" /></h3>
            <ul className="prose-wzd mt-3 list-disc space-y-2 pl-5 font-body">
              <li><T k="photo.rule1.item1" /></li>
              <li><T k="photo.rule1.item2" /></li>
              <li><T k="photo.rule1.item3" /></li>
            </ul>
            <p className="prose-wzd mt-4 border-l-4 border-accent pl-4 font-body font-semibold">
              <T k="photo.rule1.important" />
            </p>
          </article>

          <article>
            <h3 className="display text-xl"><T k="photo.rule2.title" /></h3>
            <ul className="prose-wzd mt-3 list-disc space-y-2 pl-5 font-body">
              <li><T k="photo.rule2.item1" /></li>
              <li><T k="photo.rule2.item2" /></li>
              <li><T k="photo.rule2.item3" /></li>
            </ul>
          </article>

          <article>
            <h3 className="display text-xl"><T k="photo.rule3.title" /></h3>
            <ul className="prose-wzd mt-3 list-disc space-y-2 pl-5 font-body">
              <li><T k="photo.rule3.item1" /></li>
              <li><T k="photo.rule3.item2" /></li>
            </ul>
          </article>
        </div>
      </Section>

      <Section title={<T k="photo.consent.title" />}>
        <p className="prose-wzd font-body"><T k="photo.consent.body" /></p>
      </Section>

      {/* Every photographer whose work appears anywhere on this site. */}
      <Section title={<T k="photo.credits.title" />}>
        <p className="prose-wzd font-body"><T k="photo.credits.body" /></p>
        <ul className="mt-6 grid gap-2 font-body sm:grid-cols-2 lg:grid-cols-3">
          {photographers.map((p) => (
            <li key={p.credit}>{p.credit}</li>
          ))}
        </ul>
      </Section>

      <Section title={<T k="photo.press.title" />}>
        <p className="prose-wzd font-body"><T k="photo.press.body" /></p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/press" className="btn btn-primary">
            <T k="photo.press.cta" />
          </Link>
          <a href={`mailto:${EVENT.email}`} className="btn btn-secondary">
            Email the team
          </a>
        </div>
      </Section>
    </PageShell>
  )
}
