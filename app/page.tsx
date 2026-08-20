import Link from "next/link"
import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS } from "@/components/notion-text"
import { Photo } from "@/components/photo"
import { Reveal } from "@/components/reveal"
import { Swipe } from "@/components/swipe"
import { Bars, type Bar } from "@/components/bars"
import { Divider } from "@/components/divider"
import { TornEdge } from "@/components/torn-edge"
import { Hand } from "@/components/hand"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"

export const revalidate = 60

/**
 * The slabs behind the hero type. Lengths and depths are all different and
 * none is level, which is the whole point — a set of matched bars reads as
 * a table, not a title card. They stop clear of the middle so nothing lands
 * on the type.
 */
const HERO_BARS: Bar[] = [
  { from: "left", top: "14%", left: "0", width: "26%", height: "18px", tilt: -1.4, tone: "ink", delay: 0 },
  { from: "right", top: "38%", right: "0", width: "34%", height: "12px", tilt: 0.9, tone: "ink", delay: 100 },
  { from: "top", top: "0", left: "62%", width: "14px", height: "30%", tilt: 1.8, tone: "ink", delay: 200 },
  { from: "bottom", bottom: "0", left: "22%", width: "10px", height: "26%", tilt: -2.2, tone: "ink", delay: 290 },
  { from: "left", bottom: "18%", left: "0", width: "16%", height: "10px", tilt: 1.2, tone: "ink", delay: 380 },
]

export default async function HomePage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)

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
          type, with small photographic panels tucked into the corners of
          it. The photographs are accents, not the subject — none of them
          is more than a couple of columns wide, and none sits in the
          middle. Black slabs drive in from the edges behind the type.

          The field is --blood rather than Zombie Red because everything on
          it is text: white on Zombie Red measures 3.82:1, which is short of
          the 4.5:1 body copy needs, and white on --blood is 6.02:1. */}
      <section className="on-blood relative w-full overflow-hidden bg-blood text-blood-text">
        <Bars bars={HERO_BARS} />

        {/* Full width, not the page container: the frames in columns 1 and
            11-12 run off the left and right edges of the screen, the way
            the panels in the reference do. Only the type is held to the
            container line. */}
        <div className="relative grid w-full grid-cols-2 gap-4 py-12 lg:grid-cols-12 lg:gap-5 lg:py-20">
          <Photo
            photo={photo("half-face-portrait")}
            priority
            frame
            ratio="3/4"
            focus="50% 35%"
            sizes="(min-width: 64rem) 15rem, 50vw"
            className="photo-mini tilt-a -ml-4 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:ml-0"
          />

          {/* Type first on a phone: the panels are accents, and nobody
              should meet a photograph before they meet the name of the
              event. On lg the grid puts it back in the middle. */}
          <div className="order-first col-span-2 px-4 sm:px-6 lg:order-none lg:col-span-6 lg:col-start-4 lg:row-span-3 lg:row-start-1 lg:self-center lg:px-4">
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
                <Link href="/register" className="btn bg-blood-text text-blood">
                  <T k="home.hero.cta.primary" />
                </Link>
              </Reveal>
              <Reveal variant="slide-left" delay={520}>
                <a
                  href={EVENT.cause.donateUrl}
                  rel="noopener noreferrer"
                  className="btn border-2 border-blood-text text-blood-text"
                >
                  <T k="home.hero.cta.secondary" />
                </a>
              </Reveal>
            </div>
          </div>

          <Photo
            photo={photo("zombies-crossing")}
            priority
            frame="accent"
            ratio="2/3"
            focus="50% 30%"
            sizes="(min-width: 64rem) 15rem, 50vw"
            className="photo-mini tilt-c -mr-4 lg:col-span-2 lg:col-start-11 lg:row-span-2 lg:row-start-1 lg:mr-0"
          />

          <Photo
            photo={photo("piccadilly-rain")}
            priority
            frame
            ratio="4/3"
            sizes="(min-width: 64rem) 22rem, 50vw"
            className="photo-mini tilt-b -ml-4 lg:col-span-3 lg:col-start-1 lg:row-start-3 lg:ml-0"
          />

          <Photo
            photo={photo("teddy-bear")}
            priority
            frame
            ratio="1/1"
            focus="50% 35%"
            sizes="(min-width: 64rem) 15rem, 50vw"
            className="photo-mini tilt-a -mr-4 lg:col-span-2 lg:col-start-11 lg:row-start-3 lg:mr-0"
          />
        </div>
      </section>

      <Divider lead="left" className="mt-12" />

      {/* ── The essentials ─────────────────────────────────────────────
          Everything someone needs before they read anything else. */}
      <TornEdge />
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
      <TornEdge />

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
            <p>
              <Link href="/survival" className="link">
                <T k="home.day.cta" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Divider lead="right" />

      {/* ── Everyone's welcome ─────────────────────────────────────────── */}
      <TornEdge />
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
            frame
            bleed="right"
            ratio="5/4"
            sizes="(min-width: 64rem) 26rem, 100vw"
            className="lg:col-start-3"
          />
        </div>
      </section>

      <TornEdge />

      {/* ── The cause ────────────────────────────────────────────────────── */}
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
          <a href={EVENT.cause.donateUrl} rel="noopener noreferrer" className="btn btn-primary">
            <T k="home.cause.cta" />
          </a>
          <a href={EVENT.cause.url} rel="noopener noreferrer" className="btn btn-secondary">
            Visit {EVENT.cause.name}
          </a>
        </div>
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
