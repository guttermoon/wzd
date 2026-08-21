import type { Metadata } from "next"
import { getSiteCopy, urlKey } from "@/lib/site-copy"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { BrandKit } from "@/components/brand-kit"

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
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  // Both editable in Notion, and both looked for in two places: the `URL`
  // field of the button's own row, which is where every other link on the
  // site is now set, and the older `press.*.url` row that held the address
  // as text before there was a URL field. The field wins; the row still
  // works, so nothing the owner has already pasted stops working.
  //
  // Only http(s) is honoured, so a malformed or half-typed value leaves
  // the "not up yet" message in place rather than becoming a dead link.
  const link = (key: string) => {
    const raw = (copy[urlKey(`${key}.cta`)] || copy[`${key}.url`] || "").trim()
    return /^https?:\/\//i.test(raw) ? raw : ""
  }
  const photoFolder = link("press.photos")
  const pressRelease = link("press.release")

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
          ratio="80/27"
          sizes="100vw"
        />
      }
    >
      <Section title={<T k="press.facts.title" />} className="mt-10">
        <dl className="grid gap-6 sm:grid-cols-2">
          {FACTS.filter((f) => any(`press.facts.${f}.label`, `press.facts.${f}.value`)).map((fact) => (
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
        <P k="press.logo.body" className="prose-wzd font-body" />
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
          <Cta k="press.photos.cta" href={photoFolder} className="btn btn-primary mt-6" />
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
        {/* The button is here either way. Until `press.release.url` has a
            value in Notion it is a real disabled <button>, not a link
            dressed as one: a button that goes nowhere is worse than one
            that says it cannot yet, and `disabled` is what a screen reader
            announces as unavailable. The line underneath says why and how
            to get the release in the meantime. */}
        {pressRelease ? (
          <Cta k="press.release.cta" href={pressRelease} className="btn btn-primary mt-6" />
        ) : (
          <>
            <button
              type="button"
              disabled
              aria-describedby="press-release-pending"
              className="btn btn-secondary mt-6 opacity-60"
            >
              <T k="press.release.cta" />
            </button>
            <p
              id="press-release-pending"
              className="prose-wzd mt-4 font-body text-muted"
            >
              <T k="press.release.pending" />
            </p>
          </>
        )}
      </Section>

      <Section title={<T k="press.coverage.title" />}>
        <P k="press.coverage.body" className="prose-wzd font-body" />
      </Section>

      <Section title={<T k="press.shooting.title" />}>
        <P k="press.shooting.body" className="prose-wzd font-body" />
        <Cta k="press.shooting.cta" href="/photo-policy" className="btn btn-primary mt-6" />
      </Section>
    </PageShell>
  )
}
