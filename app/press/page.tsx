import type { Metadata } from "next"
import { getSiteCopy, urlKey } from "@/lib/site-copy"
import { Photo, Graphic } from "@/components/photo"
import { photo } from "@/lib/photos"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { EVENT } from "@/lib/event"
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
      {/* Media enquiries, first thing: a journalist who has landed here
          from a search wants the address before they want the boilerplate.
          Outlined rather than filled, in the page's own ink, so it reads
          as a note pinned to the page in both themes rather than a panel
          competing with the sections below it. */}
      <Section className="mt-10">
        <div className="border-2 border-text p-6">
          <h2 className="display text-xl"><T k="press.contact.title" /></h2>
          <P k="press.contact.body" className="prose-wzd mt-3 font-body" />
        </div>
      </Section>

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
            <T k="press.logo.download.light" />
          </a>
          <a href="/brand/wordmark-dark-bg.png" download className="btn btn-secondary">
            <T k="press.logo.download.dark" />
          </a>
          <a href="/brand/brain.png" download className="btn btn-secondary">
            <T k="press.logo.download.brain" />
          </a>
        </p>
      </Section>

      {/* The typefaces, next to the logos: both are brand assets, and a
          journalist setting a caption wants them in the same place.
          Specimen pages rather than files — they are Google's to serve,
          and linking their page is how anyone is meant to get them. Each
          name is set in its own face, which says more than describing it
          would. */}
      <Section title={<T k="press.fonts.title" />}>
        <P k="press.fonts.intro" className="prose-wzd font-body" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <article className="cut-panel p-6">
            <h3 className="display text-2xl"><T k="press.fonts.display.title" /></h3>
            <P k="press.fonts.display.body" className="prose-wzd mt-3 font-body" />
            <Cta
              k="press.fonts.display.cta"
              href={EVENT.fonts.display}
              className="btn btn-secondary mt-5"
            />
          </article>
          <article className="cut-panel p-6">
            {/* Raleway, set in Raleway, sentence case as it is used. */}
            <h3 className="font-body text-2xl font-semibold">
              <T k="press.fonts.text.title" />
            </h3>
            <P k="press.fonts.text.body" className="prose-wzd mt-3 font-body" />
            <Cta
              k="press.fonts.text.cta"
              href={EVENT.fonts.text}
              className="btn btn-secondary mt-5"
            />
          </article>
        </div>
      </Section>

      {/* The donation QR, and an invitation to take it away and use it.
          The one on the page is the black-on-white version, because it
          carries its own ground and stays scannable in either theme; the
          other three are for whatever the person putting it somewhere
          already has behind it.

          It is a Graphic rather than a Photo: no credit, no tape
          treatment, no crop. A QR code with a torn edge is a QR code that
          does not scan. */}
      <Section title={<T k="press.qr.title" />}>
        <div className="grid items-start gap-8 sm:grid-cols-12">
          <div className="sm:col-span-4 lg:col-span-3">
            <Graphic
              src="/brand/qr-donate.png"
              alt="QR code linking to the donation page"
              width={180}
              height={180}
              frame={false}
              sizes="12rem"
              className="w-full max-w-[11rem]"
            />
          </div>
          <div className="sm:col-span-8 lg:col-span-9">
            <P k="press.qr.body" className="prose-wzd font-body" />
            <p className="mt-6 flex flex-wrap gap-3">
              <a href="/brand/qr-donate.png" download className="btn btn-secondary">
                <T k="press.qr.download.standard" />
              </a>
              <a href="/brand/qr-donate-transparent.png" download className="btn btn-secondary">
                <T k="press.qr.download.transparent" />
              </a>
              <a href="/brand/qr-donate-red.png" download className="btn btn-secondary">
                <T k="press.qr.download.red" />
              </a>
              <a href="/brand/qr-donate-white.png" download className="btn btn-secondary">
                <T k="press.qr.download.white" />
              </a>
            </p>
          </div>
        </div>
      </Section>

      {/* The cause's own mark, kept apart from ours: it is not our logo to
          put in our lock-up section, and a journalist looking for it wants
          it labelled with whose it is. Both grounds, shown and offered. */}
      <Section title={<T k="press.dgc.title" />}>
        <P k="press.dgc.body" className="prose-wzd font-body" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="cut-panel flex items-center justify-center bg-[#fefefc] p-6">
            <Graphic
              src="/brand/dgc-light-bg.webp"
              alt="The Dead Good Club lock-up, for light backgrounds"
              width={1083}
              height={1536}
              frame={false}
              sizes="(min-width: 40rem) 14rem, 45vw"
              className="w-full max-w-[10rem]"
            />
          </div>
          <div className="cut-panel flex items-center justify-center bg-[#1a1a1a] p-6">
            <Graphic
              src="/brand/dgc-dark-bg.webp"
              alt="The Dead Good Club lock-up, for dark backgrounds"
              width={1083}
              height={1536}
              frame={false}
              sizes="(min-width: 40rem) 14rem, 45vw"
              className="w-full max-w-[10rem]"
            />
          </div>
        </div>
        <p className="mt-6 flex flex-wrap gap-3">
          <a href="/brand/dgc-light-bg.png" download className="btn btn-secondary">
            <T k="press.dgc.download.light" />
          </a>
          <a href="/brand/dgc-dark-bg.png" download className="btn btn-secondary">
            <T k="press.dgc.download.dark" />
          </a>
        </p>
      </Section>

      {/* Photography lives in an external folder so it can be repointed
          year to year from Notion, without a deploy. */}
      <Section title={<T k="press.photos.title" />}>
        <p className="prose-wzd font-body">
          <T k="press.photos.body" />
        </p>
        {/* The button is here either way, exactly as it is for the
            release below: until `press.photos.cta` has a URL in Notion it
            is a real disabled <button> rather than a link dressed as one,
            which is what a screen reader announces as unavailable. The
            line underneath says why and how to get the images meanwhile. */}
        {photoFolder ? (
          <Cta k="press.photos.cta" href={photoFolder} className="btn btn-primary mt-6" />
        ) : (
          <>
            <button
              type="button"
              disabled
              aria-describedby="press-photos-pending"
              className="btn btn-secondary mt-6 opacity-60"
            >
              <T k="press.photos.cta" />
            </button>
            <p
              id="press-photos-pending"
              className="prose-wzd mt-4 font-body text-muted"
            >
              <T k="press.photos.pending" />
            </p>
          </>
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
