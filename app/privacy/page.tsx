import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { makeT, makeS } from "@/components/notion-text"
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
        <p className="prose-wzd font-body"><T k="privacy.who.body" /></p>
      </Section>

      <Section title={<T k="privacy.collect.title" />}>
        <div className="space-y-6">
          {["reg", "contact", "analytics"].map((k) => (
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
        <p className="prose-wzd font-body"><T k="privacy.why.body" /></p>
      </Section>

      <Section title={<T k="privacy.cookies.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.cookies.body" /></p>
        <ConsentChoice />
      </Section>

      <Section title={<T k="privacy.sharing.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.sharing.body" /></p>
      </Section>

      <Section title={<T k="privacy.retention.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.retention.body" /></p>
      </Section>

      <Section title={<T k="privacy.rights.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.rights.body" /></p>
        <p className="prose-wzd mt-4 font-body"><T k="privacy.rights.complain" /></p>
        <p className="mt-4 font-body">
          <a className="link" href={`mailto:${EVENT.email}`}>{EVENT.email}</a>
        </p>
      </Section>

      <Section title={<T k="privacy.photos.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.photos.body" /></p>
        <Link href="/photo-policy" className="btn btn-secondary mt-6">
          <T k="privacy.photos.cta" />
        </Link>
      </Section>

      <Section title={<T k="privacy.changes.title" />}>
        <p className="prose-wzd font-body"><T k="privacy.changes.body" /></p>
      </Section>
    </PageShell>
  )
}
