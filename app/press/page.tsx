import type { Metadata } from "next"
import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { makeT, makeS } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { BrandKit } from "@/components/brand-kit"
import { EVENT } from "@/lib/event"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Press kit",
  description:
    "Boilerplate, key facts, logos and credited photography for journalists covering World Zombie Day: London.",
  alternates: { canonical: "/press" },
}

const FACTS = ["date", "place", "cost", "cause", "scale", "origin", "tags"]

export default async function PressPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)

  // Both editable in Notion. Only http(s) is honoured, so a malformed or
  // unexpected value falls back to the "not up yet" message rather than
  // becoming a live link.
  const link = (key: string) => {
    const raw = (copy[key] ?? "").trim()
    return /^https?:\/\//i.test(raw) ? raw : ""
  }
  const photoFolder = link("press.photos.url")
  const pressRelease = link("press.release.url")

  return (
    <PageShell
      title={<T k="press.title" />}
      titleText={S("press.title")}
      standfirst={<T k="press.standfirst" />}
      banner={
        <Photo
          photo={photo("stop-sign-couple")}
          priority
          bleed="full"
          ratio="32/9"
          sizes="100vw"
        />
      }
    >
      <div className="cut-panel mt-10 p-6">
        <h2 className="display text-xl"><T k="press.contact.title" /></h2>
        <p className="mt-2 font-body">
          <a className="link" href={`mailto:${EVENT.email}`}>
            <T k="press.contact.body" />
          </a>
        </p>
      </div>

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
        <BrandKit />
        {/* The supplied artwork itself, copied into public/brand by
            `npm run logos` and never resized or recoloured. The lock-up
            comes twice because it was drawn twice: one version for light
            grounds and one for dark. */}
        <p className="mt-6 flex flex-wrap gap-3">
          <a href="/brand/wordmark-light-bg.png" download className="btn btn-secondary">
            Wordmark (PNG)
          </a>
          <a href="/brand/wordmark-dark-bg.png" download className="btn btn-secondary">
            Wordmark for dark backgrounds (PNG)
          </a>
          <a href="/brand/brain.png" download className="btn btn-secondary">
            Brain mark (PNG)
          </a>
        </p>
      </Section>

      {/* Photography lives in an external folder so it can be repointed
          year to year from Notion, without a deploy. */}
      <Section title={<T k="press.photos.title" />}>
        <p className="prose-wzd font-body">
          <T k="press.photos.body" />
        </p>
        {/* The button appears the moment `press.photos.url` has a value in
            Notion, and no deploy is needed to put it there: the folder
            moves year to year and the owner is the one who moves it. Until
            then, the line below says so. */}
        {photoFolder ? (
          <a
            href={photoFolder}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6"
          >
            <T k="press.photos.cta" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <p className="prose-wzd mt-4 font-body text-muted">
            <T k="press.photos.pending" />
          </p>
        )}
      </Section>

      {/* Same pattern as the photographs: the owner points it at this
          year's release from Notion, and the button appears. */}
      <Section title={<T k="press.release.title" />}>
        <p className="prose-wzd font-body">
          <T k="press.release.body" />
        </p>
        {pressRelease ? (
          <a
            href={pressRelease}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6"
          >
            <T k="press.release.cta" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <p className="prose-wzd mt-4 font-body text-muted">
            <T k="press.release.pending" />
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
