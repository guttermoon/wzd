import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { Photo } from "@/components/photo"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { photo, allPhotos } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Photo policy",
  description:
    "Photography and filming at World Zombie Day: London: consent, the schedule, commercial restrictions, and how to credit.",
  alternates: { canonical: "/photo-policy" },
}

export default async function PhotoPolicyPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  // One entry per photographer, in first-appearance order.
  const photographers = [...new Map(allPhotos().map((p) => [p.credit, p])).values()]

  return (
    <PageShell
      title={<T k="photo.title" />}
      titleText={S("photo.title")}
      standfirst={<T k="photo.standfirst" />}
      banner={
        <Photo
          photo={photo("selfie")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <div className="prose-wzd mt-8">
        <p><T k="photo.intro1" /></p>
        <p><T k="photo.intro2" /></p>
        <ul className="list-disc space-y-2 pl-5">
          {["photo.basics.1", "photo.basics.2", "photo.basics.3"]
            .filter(has)
            .map((k) => (
              <li key={k}><T k={k} /></li>
            ))}
        </ul>
      </div>

      <Section title={<T k="photo.credit.title" />}>
        <blockquote className="cut-panel p-6 font-body italic">
          <T k="photo.credit.body" />
        </blockquote>
        <P k="photo.credit.tags" className="prose-wzd mt-4 font-body" />
      </Section>

      <Section title={<T k="photo.rules.title" />}>
        <div className="space-y-10">
          <article>
            <h3 className="display text-xl"><T k="photo.rule1.title" /></h3>
            <ul className="prose-wzd mt-3 list-disc space-y-2 pl-5 font-body">
              {["photo.rule1.item1", "photo.rule1.item2", "photo.rule1.item3"]
                .filter(has)
                .map((k) => (
                  <li key={k}><T k={k} /></li>
                ))}
            </ul>
            <p className="prose-wzd mt-4 border-l-4 border-accent pl-4 font-body font-semibold">
              <T k="photo.rule1.important" />
            </p>
          </article>

          <article>
            <h3 className="display text-xl"><T k="photo.rule2.title" /></h3>
            <ul className="prose-wzd mt-3 list-disc space-y-2 pl-5 font-body">
              {["photo.rule2.item1", "photo.rule2.item2", "photo.rule2.item3"]
                .filter(has)
                .map((k) => (
                  <li key={k}><T k={k} /></li>
                ))}
            </ul>
          </article>

          <article>
            <h3 className="display text-xl"><T k="photo.rule3.title" /></h3>
            <ul className="prose-wzd mt-3 list-disc space-y-2 pl-5 font-body">
              {["photo.rule3.item1", "photo.rule3.item2"]
                .filter(has)
                .map((k) => (
                  <li key={k}><T k={k} /></li>
                ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section title={<T k="photo.consent.title" />}>
        <P k="photo.consent.body" className="prose-wzd font-body" />
      </Section>

      {/* Every photographer whose work appears anywhere on this site. */}
      <Section title={<T k="photo.credits.title" />}>
        <P k="photo.credits.body" className="prose-wzd font-body" />
        <ul className="mt-6 grid gap-2 font-body sm:grid-cols-2 lg:grid-cols-3">
          {photographers.map((p) => (
            <li key={p.credit}>{p.credit}</li>
          ))}
        </ul>
      </Section>

      <Section title={<T k="photo.press.title" />}>
        <P k="photo.press.body" className="prose-wzd font-body" />
        <div className="mt-6 flex flex-wrap gap-3">
          <Cta k="photo.press.cta" href="/press" className="btn btn-primary" />
          <Cta
            k="photo.press.email"
            href={`mailto:${EVENT.email}`}
            className="btn btn-secondary"
          />
        </div>
      </Section>
    </PageShell>
  )
}
