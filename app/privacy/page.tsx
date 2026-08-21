import type { Metadata } from "next"
import { getSiteCopy } from "@/lib/site-copy"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { ConsentChoice } from "@/components/consent-choice"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What World Zombie Day: London collects, why, and what you can ask us to do about it.",
  alternates: { canonical: "/privacy" },
}

export default async function PrivacyPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  return (
    <PageShell
      title={<T k="privacy.title" />}
      titleText={S("privacy.title")}
      standfirst={<T k="privacy.standfirst" />}
      banner={
        <Photo
          photo={photo("makeup-blood")}
          priority
          bleed="full"
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <p className="mt-4 font-body text-sm text-muted">
        <T k="privacy.updated" />
      </p>

      <Section title={<T k="privacy.who.title" />}>
        <P k="privacy.who.body" className="prose-wzd font-body" />
      </Section>

      <Section title={<T k="privacy.collect.title" />}>
        <div className="space-y-6">
          {["reg", "contact", "analytics"].filter((k) => any(`privacy.collect.${k}.title`, `privacy.collect.${k}.body`)).map((k) => (
            <article key={k}>
              <h3 className="display text-lg">
                <T k={`privacy.collect.${k}.title`} />
              </h3>
              <p className="prose-wzd mt-2 font-body">
                <T k={`privacy.collect.${k}.body`} />
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title={<T k="privacy.why.title" />}>
        <P k="privacy.why.body" className="prose-wzd font-body" />
      </Section>

      <Section title={<T k="privacy.cookies.title" />}>
        <P k="privacy.cookies.body" className="prose-wzd font-body" />
        <ConsentChoice />
      </Section>

      <Section title={<T k="privacy.sharing.title" />}>
        <P k="privacy.sharing.body" className="prose-wzd font-body" />
      </Section>

      <Section title={<T k="privacy.retention.title" />}>
        <P k="privacy.retention.body" className="prose-wzd font-body" />
      </Section>

      <Section title={<T k="privacy.rights.title" />}>
        <P k="privacy.rights.body" className="prose-wzd font-body" />
        <P k="privacy.rights.complain" className="prose-wzd mt-4 font-body" />
        <p className="mt-4 font-body">
          <a className="link" href={`mailto:${EVENT.email}`}>{EVENT.email}</a>
        </p>
      </Section>

      <Section title={<T k="privacy.photos.title" />}>
        <P k="privacy.photos.body" className="prose-wzd font-body" />
        <Cta k="privacy.photos.cta" href="/photo-policy" className="btn btn-secondary mt-6" />
      </Section>

      <Section title={<T k="privacy.changes.title" />}>
        <P k="privacy.changes.body" className="prose-wzd font-body" />
      </Section>
    </PageShell>
  )
}
