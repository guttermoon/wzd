import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { Photo } from "@/components/photo"
import { Reveal } from "@/components/reveal"
import { Swipe } from "@/components/swipe"
import { Bars, type Bar } from "@/components/bars"
import { Divider } from "@/components/divider"
import { Hand } from "@/components/hand"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"
import { makeCta } from "@/components/cta"

export const revalidate = 60

/**
 * The slabs behind the hero type. Lengths and depths are all different and
 * none is level, which is the whole point — a set of matched bars reads as
 * a table, not a title card. They stop clear of the middle so nothing lands
 * on the type.
 */
const HERO_BARS: Bar[] = [
  { from: "left", top: "4%", left: "0", width: "22%", height: "16px", tilt: -1.4, tone: "ink", delay: 0 },
  { from: "right", top: "34%", right: "0", width: "26%", height: "12px", tilt: 0.9, tone: "ink", delay: 100 },
  { from: "top", top: "0", left: "82%", width: "14px", height: "30%", tilt: 1.8, tone: "ink", delay: 200 },
  { from: "bottom", bottom: "0", left: "74%", width: "10px", height: "26%", tilt: -2.2, tone: "ink", delay: 290 },
  { from: "left", bottom: "4%", left: "0", width: "14%", height: "10px", tilt: 1.2, tone: "ink", delay: 380 },
]

export default async function HomePage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  const essentials = [
    { k: "when", href: "/faq" },
    { k: "where", href: "/faq" },
    { k: "cost", href: "/register" },
    { k: "who", href: "/faq" },
    { k: "wear", href: "/survival" },
  ]

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────
          The Saul Bass composition: a flat field of colour carrying the
          type, with black slabs driving in from the edges behind it. No
          photographs — the owner's instruction. The title card is type and
          shape, and the photographs start below it.

          The field is --blood rather than Zombie Red because everything on
          it is text: white on Zombie Red measures 3.82:1, which is short of
          the 4.5:1 body copy needs, and white on --blood is 6.02:1. */}
      <section className="on-blood relative w-full overflow-hidden bg-blood text-blood-text">
        <Bars bars={HERO_BARS} />

        <div className="relative mx-auto w-full max-w-page px-4 py-16 sm:px-6 lg:py-24">
          {/* Centred in the container, set from the left inside it. The
              slabs are pushed clear: everything above 74% of the width, or
              hard against the top and bottom edges, so nothing drives
              through the type or the buttons. */}
          <div className="mx-auto max-w-[46rem]">
            <Reveal variant="cut" as="p" className="display text-sm sm:text-base">
              <T k="home.hero.eyebrow" />
            </Reveal>
            {/* The one heading that arrives word by word. Every heading on
                the site doing it would read as a novelty; the title card
                is where it belongs. */}
            <Swipe
              text={S("home.hero.title")}
              as="h1"
              delay={140}
              className="mt-3 display text-[clamp(2.5rem,7vw,5rem)]"
            />
            <Reveal
              variant="slide-right"
              delay={180}
              className="mt-5 h-[6px] w-full bg-blood-text"
            />
            <Reveal variant="slide-up" delay={270} as="p" className="mt-6 max-w-[46ch] font-body text-lg">
              <T k="home.hero.standfirst" />
            </Reveal>
            {/* The pair arrives as a beat of its own, one behind the other,
                rather than appearing with the paragraph above them. */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Reveal variant="slide-left" delay={420}>
                <Cta
                  k="home.hero.cta.primary"
                  href="/register"
                  className="btn bg-blood-text text-blood"
                />
              </Reveal>
              <Reveal variant="slide-left" delay={520}>
                <Cta
                  k="home.hero.cta.secondary"
                  href={EVENT.cause.donateUrl}
                  className="btn border-2 border-blood-text text-blood-text"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Divider lead="left" className="mt-12" />

      {/* ── The essentials ─────────────────────────────────────────────
          Everything someone needs before they read anything else. */}
      <section className="relative overflow-hidden bg-surface py-12">
        {/* Reaching in over the corner of the block. Behind everything,
            inert, and gone below lg where there is no room for it. */}
        <Hand
          from="right"
          delay={120}
          className="-right-16 -bottom-32 hidden h-[560px] w-[210px] opacity-[0.14] lg:block"
        />
        <div className="relative mx-auto w-full max-w-page px-4 sm:px-6">
          <Reveal variant="wipe-red">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.essentials.title" />
            </h2>
          </Reveal>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {essentials.filter((it) => any(`home.essentials.${it.k}.label`, `home.essentials.${it.k}.value`)).map((item, i) => (
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

      <Divider lead="right" />

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
            frame
            bleed="right"
            ratio="4/3"
            sizes="(min-width: 64rem) 26rem, 100vw"
            className="lg:col-start-3"
          />
        </div>

        <div className="edge-left mt-20 items-center gap-8 lg:gap-0">
          <Photo
            photo={photo("the-horde")}
            frame="accent"
            bleed="left"
            ratio="3/2"
            sizes="(min-width: 64rem) 26rem, 100vw"
            className="lg:col-start-1 lg:row-start-1"
          />
          <div className="prose-wzd px-4 sm:px-6 lg:col-start-2 lg:row-start-1 lg:px-0 lg:ps-12">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.day.title" />
            </h2>
            <p><T k="home.day.body1" /></p>
            <p><T k="home.day.body2" /></p>
            {/* A button, not an underlined line of prose: this is the way
                on to the next page, and it should look like something you
                press. Still a link, because it navigates. */}
            <Cta k="home.day.cta" href="/survival" className="btn btn-secondary mt-6" />
          </div>
        </div>
      </section>

      <Divider lead="left" />

      {/* ── Everyone's welcome ─────────────────────────────────────────── */}
      <section className="w-full bg-surface py-14">
        <div className="edge-right items-center gap-8 lg:gap-0">
          <div className="prose-wzd px-4 sm:px-6 lg:col-start-2 lg:px-0 lg:pe-12">
            {/* The home page's own keys, not /register's. The words
                start out the same, but this is the trailer and that is the
                page: they should be free to diverge, and a row for what is
                on the home page belongs under home in the table rather
                than filed halfway down register. */}
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.access.title" />
            </h2>
            <p><T k="home.access.body" /></p>
            <Cta k="home.access.cta" href="/faq" className="btn btn-secondary mt-6" />
          </div>
          <Photo
            photo={photo("family-kerb")}
            frame
            bleed="right"
            ratio="5/4"
            sizes="(min-width: 64rem) 26rem, 100vw"
            className="lg:col-start-3"
          />
        </div>
      </section>


      {/* ── The cause ────────────────────────────────────────────────────── */}
      <Divider lead="right" />

      <section className="relative w-full overflow-hidden py-14">
        <Hand
          from="left"
          tone="accent"
          delay={80}
          className="-left-16 -bottom-36 hidden h-[600px] w-[225px] opacity-[0.18] lg:block"
        />
        <div className="relative mx-auto w-full max-w-page px-4 sm:px-6">
        <div className="prose-wzd">
          <Reveal variant="wipe-red">
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)]">
              <T k="home.cause.title" />
            </h2>
          </Reveal>
          <p><T k="home.cause.body1" /></p>
          <p><T k="home.cause.body2" /></p>
          <p><T k="home.cause.body3" /></p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Cta k="home.cause.cta" href={EVENT.cause.donateUrl} className="btn btn-primary" />
          <Cta k="home.cause.visit" href={EVENT.cause.url} className="btn btn-secondary" />
        </div>
        </div>
      </section>

      {/* ── Final call to action ───────────────────────────────────────── */}
      <Divider lead="left" />

      <section className="mx-auto w-full max-w-page px-4 py-16 text-center sm:px-6">
        <h2 className="display text-[clamp(2rem,6vw,4rem)]">
          <T k="home.cta.title" />
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] font-body text-lg text-muted">
          <T k="home.cta.body" />
        </p>
        <Cta k="home.cta.button" href="/register" className="btn btn-primary mt-8" />
      </section>

    </>
  )
}
