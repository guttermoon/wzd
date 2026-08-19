import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Press kit",
  description:
    "Boilerplate, key facts, logos and credited photography for journalists covering World Zombie Day: London.",
  alternates: { canonical: "/press" },
}

const FACTS = ["date", "place", "cost", "charity", "scale", "origin", "tags"]

export default async function PressPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)

  // Editable in Notion (press.photos.url). Only http(s) is honoured, so a
  // malformed or unexpected value falls back to the "not up yet" message
  // rather than becoming a live link.
  const raw = (copy["press.photos.url"] ?? "").trim()
  const photoFolder = /^https?:\/\//i.test(raw) ? raw : ""

  return (
    <PageShell title={<T k="press.title" />} standfirst={<T k="press.standfirst" />}>
      <div className="cut-panel mt-10 p-6">
        <h2 className="display text-xl"><T k="press.contact.title" /></h2>
        <p className="mt-2 font-body">
          <a className="link" href={`mailto:${EVENT.email}`}>
            <T k="press.contact.body" />
          </a>
        </p>
      </div>

      <Photo
        photo={photo("the-horde")}
        sizes="(min-width: 72rem) 68rem, 100vw"
        className="mt-10"
      />

      <Section title={<T k="press.facts.title" />}>
        <dl className="grid gap-6 sm:grid-cols-2">
          {FACTS.map((fact) => (
            <div key={fact} className="border-l-4 border-accent pl-4">
              <dt className="display text-base"><T k={`press.facts.${fact}.label`} /></dt>
              <dd className="mt-1 font-body text-muted">
                <T k={`press.facts.${fact}.value`} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={<T k="press.boiler.short.title" />}>
        <p className="prose-wzd cut-panel p-6 font-body">
          <T k="press.boiler.short.body" />
        </p>
      </Section>

      <Section title={<T k="press.boiler.long.title" />}>
        <p className="prose-wzd cut-panel p-6 font-body">
          <T k="press.boiler.long.body" />
        </p>
      </Section>

      <Section title={<T k="press.logo.title" />}>
        <p className="prose-wzd font-body"><T k="press.logo.body" /></p>
        <p className="mt-4 flex flex-wrap gap-3">
          <a href="/brand/wordmark.svg" download className="btn btn-secondary">
            Download the wordmark (SVG)
          </a>
          <a href="/brand/brain.svg" download className="btn btn-secondary">
            Download the brain mark (SVG)
          </a>
        </p>
      </Section>

      {/* Photography lives in an external folder so it can be repointed
          year to year from Notion, without a deploy. */}
      <Section title={<T k="press.photos.title" />}>
        <p className="prose-wzd font-body">
          <T k="press.photos.body" />
        </p>
        {photoFolder ? (
          <a
            href={photoFolder}
            rel="noopener noreferrer"
            className="btn btn-primary mt-6"
          >
            <T k="press.photos.cta" />
          </a>
        ) : (
          <p className="prose-wzd mt-4 font-body text-muted">
            <T k="press.photos.pending" />
          </p>
        )}
      </Section>

      <Section title={<T k="press.coverage.title" />}>
        <p className="prose-wzd font-body"><T k="press.coverage.body" /></p>
      </Section>

      <Section title={<T k="press.shooting.title" />}>
        <p className="prose-wzd font-body"><T k="press.shooting.body" /></p>
        <Link href="/photo-policy" className="btn btn-primary mt-6">
          <T k="press.shooting.cta" />
        </Link>
      </Section>
    </PageShell>
  )
}
