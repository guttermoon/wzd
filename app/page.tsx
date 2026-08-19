import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT } from "@/components/notion-text"
import { Photo } from "@/components/photo"
import { Reveal } from "@/components/reveal"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60

export default async function HomePage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)

  const essentials = [
    { k: "when", href: "/faq" },
    { k: "where", href: "/faq" },
    { k: "cost", href: "/register" },
    { k: "who", href: "/faq" },
    { k: "wear", href: "/rules" },
  ]

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────
          The headline sits in its own block, not on top of the photo, so
          it stays legible whatever the image does at small sizes. */}
      <section className="mx-auto w-full max-w-page px-4 pt-10 sm:px-6 sm:pt-14">
        <Reveal variant="cut" as="p" className="display text-sm text-accent-text sm:text-base">
          <T k="home.hero.eyebrow" />
        </Reveal>
        <Reveal variant="wipe" delay={90} className="mt-3">
          <h1 className="display text-[clamp(2.5rem,9vw,6rem)]">
            <T k="home.hero.title" />
          </h1>
        </Reveal>
        <Reveal variant="slide-right" delay={180} className="slab-rule mt-5" />
        <Reveal variant="slide-up" delay={270} as="p" className="mt-6 max-w-[52ch] font-body text-lg sm:text-xl">
          <T k="home.hero.standfirst" />
        </Reveal>
        <Reveal variant="slide-up" delay={360} className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-primary">
            <T k="home.hero.cta.primary" />
          </Link>
          <a
            href={EVENT.cause.donateUrl}
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <T k="home.hero.cta.secondary" />
          </a>
        </Reveal>

      </section>

      {/* The horde runs the full width of the screen — the first thing that
          says this is not a column of text with pictures in it. */}
      <Reveal variant="wipe" delay={450} className="mt-10 w-full">
        <Photo
          photo={photo("bridge-horde")}
          priority
          bleed="full"
          ratio="21/9"
          sizes="100vw"
        />
      </Reveal>

      <div className="torn-bar mt-12" aria-hidden="true" />

      {/* ── The essentials ─────────────────────────────────────────────
          Everything someone needs before they read anything else. */}
      <section className="bg-surface py-12">
        <div className="mx-auto w-full max-w-page px-4 sm:px-6">
          <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
            <T k="home.essentials.title" />
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {essentials.map((item, i) => (
              <Reveal
                key={item.k}
                variant="slide-right"
                delay={i * 100}
                className="border-l-4 border-accent pl-4"
              >
                <dt className="display text-base">
                  <T k={`home.essentials.${item.k}.label`} />
                </dt>
                <dd className="mt-2 font-body text-muted">
                  <T k={`home.essentials.${item.k}.value`} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── What it is ───────────────────────────────────────────────────
          The sections below run the full width of the screen and pad only
          their text side back to the container line, so each photograph
          reaches the edge. The splits are deliberately uneven — 7/5 then
          5/7 — so no two rows scan the same way. */}
      <section className="w-full py-14">
        <div className="edge-right items-center gap-8 lg:gap-0">
          <div className="prose-wzd px-4 sm:px-6 lg:col-start-2 lg:px-0 lg:pe-12">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.about.title" />
            </h2>
            <p><T k="home.about.body1" /></p>
            <p><T k="home.about.body2" /></p>
          </div>
          <Photo
            photo={photo("leicester-square-banner")}
            bleed="right"
            ratio="4/3"
            sizes="(min-width: 64rem) 55vw, 100vw"
            className="lg:col-start-3"
          />
        </div>

        <div className="edge-left mt-20 items-center gap-8 lg:gap-0">
          <Photo
            photo={photo("the-horde")}
            bleed="left"
            ratio="3/2"
            sizes="(min-width: 64rem) 55vw, 100vw"
            className="lg:col-start-1 lg:row-start-1"
          />
          <div className="prose-wzd px-4 sm:px-6 lg:col-start-2 lg:row-start-1 lg:px-0 lg:ps-12">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.day.title" />
            </h2>
            <p><T k="home.day.body1" /></p>
            <p><T k="home.day.body2" /></p>
            <p>
              <Link href="/rules" className="link">
                <T k="home.day.cta" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="torn-bar" aria-hidden="true" />

      {/* ── Everyone's welcome ─────────────────────────────────────────── */}
      <section className="w-full bg-surface py-14">
        <div className="edge-right items-center gap-8 lg:gap-0">
          <div className="prose-wzd px-4 sm:px-6 lg:col-start-2 lg:px-0 lg:pe-12">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="register.access.title" />
            </h2>
            <p><T k="register.access.body" /></p>
            <p>
              <Link href="/faq" className="link">
                More about access, dogs and children
              </Link>
            </p>
          </div>
          <Photo
            photo={photo("family-kerb")}
            bleed="right"
            ratio="5/4"
            sizes="(min-width: 64rem) 55vw, 100vw"
            className="lg:col-start-3"
          />
        </div>
      </section>

      {/* ── The cause ────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-page px-4 py-14 sm:px-6">
        <div className="prose-wzd">
          <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
            <T k="home.cause.title" />
          </h2>
          <p><T k="home.cause.body1" /></p>
          <p><T k="home.cause.body2" /></p>
          <p><T k="home.cause.body3" /></p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={EVENT.cause.donateUrl} rel="noopener noreferrer" className="btn btn-primary">
            <T k="home.cause.cta" />
          </a>
          <a href={EVENT.cause.url} rel="noopener noreferrer" className="btn btn-secondary">
            Visit {EVENT.cause.name}
          </a>
        </div>
      </section>

      {/* ── Final call to action ───────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-page px-4 py-16 text-center sm:px-6">
        <h2 className="display text-[clamp(2rem,6vw,4rem)]">
          <T k="home.cta.title" />
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] font-body text-lg text-muted">
          <T k="home.cta.body" />
        </p>
        <Link href="/register" className="btn btn-primary mt-8">
          <T k="home.cta.button" />
        </Link>
      </section>
    </>
  )
}
