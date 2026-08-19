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

        <Reveal variant="wipe" delay={450} className="mt-10">
          <Photo
            photo={photo("bridge-horde")}
            priority
            sizes="(min-width: 72rem) 68rem, 100vw"
          />
        </Reveal>
      </section>

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

      {/* ── What it is ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-page px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="prose-wzd">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.about.title" />
            </h2>
            <p><T k="home.about.body1" /></p>
            <p><T k="home.about.body2" /></p>
          </div>
          <Photo
            photo={photo("leicester-square-banner")}
            sizes="(min-width: 64rem) 34rem, 100vw"
          />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Photo
            photo={photo("the-horde")}
            sizes="(min-width: 64rem) 34rem, 100vw"
            className="lg:order-last"
          />
          <div className="prose-wzd">
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
      <section className="bg-surface py-14">
        <div className="mx-auto grid w-full max-w-page gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className="prose-wzd">
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
            sizes="(min-width: 64rem) 34rem, 100vw"
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
        <a href={EVENT.cause.donateUrl} rel="noopener noreferrer" className="btn btn-primary mt-6">
          <T k="home.cause.cta" />
        </a>
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
