import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/fx/reveal"
import { Marquee } from "@/components/fx/marquee"
import { getSectionContent } from "@/lib/notion-content"

export const metadata = {
  title: "About This Publication | The Dead Good Club",
  description:
    "The story, standards, and correspondents behind The Dead Good Club.",
}

export const revalidate = 60

const contributors = [
  {
    name: "Sarah Chen",
    role: "Editor & Content Strategist",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Decides what makes the front page. Believes every dispatch should earn its column inches.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Chief Typesetter & Technical Correspondent",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Keeps the presses (and the deploys) running. Files in-depth technical dispatches from the workshop.",
  },
  {
    name: "Alex Kim",
    role: "Art Department",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Cuts, pastes, and tapes the whole publication together. Responsible for every stray highlighter mark.",
  },
]

const standards = [
  {
    title: "Plain speaking",
    note: "No fluff, no corporate speak — copy you can read on the bus.",
    stamp: "" as const,
  },
  {
    title: "Dead good only",
    note: "If it isn't worth clipping out and taping to the fridge, it doesn't run.",
    stamp: "stamp-cobalt" as const,
  },
  {
    title: "Readers first",
    note: "Every issue is assembled for the people who actually read it.",
    stamp: "stamp-avocado" as const,
  },
  {
    title: "Always in print",
    note: "We keep publishing. The archive only grows.",
    stamp: "" as const,
  },
]

export default async function AboutPage() {
  const content = await getSectionContent("about")

  return (
    <div className="min-h-screen overflow-x-clip">
      {/* Masthead-style page header */}
      <section className="border-b border-ink/80">
        <div className="container py-14 md:py-20">
          <Reveal effect="fade">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
              Who we are — and why
            </p>
          </Reveal>
          <Reveal effect="settle" delay={80}>
            <h1 className="mt-2 font-display uppercase leading-[0.95] text-ink">
              <span
                className="overprint text-[clamp(2.75rem,9vw,6rem)]"
                data-text="About This"
              >
                About This
              </span>
              <br />
              <span
                className="overprint text-[clamp(2.75rem,9vw,6rem)]"
                data-text="Publication"
              >
                Publication
              </span>
            </h1>
          </Reveal>
        </div>
        <div className="torn-top bg-ink py-2.5 text-paper">
          <Marquee
            text="EST. 2026 — A DEAD GOOD PERIODICAL —"
            speed={28}
            textClassName="font-mono text-xs uppercase tracking-[0.25em]"
          />
        </div>
      </section>

      {/* Editorial note (Notion-fed) */}
      <section className="container py-14 md:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">
          <Reveal effect="fade" className="lg:col-span-3">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-none text-ink">
              <span className="highlight">A note from the editor</span>
            </h2>
            <div className="rule-thick mt-4" />
            {content?.html ? (
              <div
                className="prose mt-6"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            ) : (
              <div className="prose mt-6">
                <p>
                  The Dead Good Club began the way all decent publications do:
                  with too many clippings and nowhere to put them. Dispatches,
                  features, and curiosities were piling up — so we bought some
                  digital paper, warmed up the presses, and started pasting.
                </p>
                <p>
                  Everything you read here is typeset straight out of Notion and
                  delivered to any screen that will have us. No paywall, no
                  postage — just dead good reading, assembled by hand and taped
                  down with care.
                </p>
              </div>
            )}
          </Reveal>

          {/* Colophon card */}
          <Reveal effect="settle" delay={150} rotate={1.2} className="lg:col-span-2">
            <div
              className="clipping tape bg-paper-2 p-6"
              style={{ "--clip-rot": "1.2deg" } as React.CSSProperties}
            >
              <h3 className="font-display text-xl uppercase text-ink">
                On the record
              </h3>
              <div className="rule mt-2" />
              <dl className="mt-4 space-y-3 font-mono text-sm">
                {[
                  ["Founded", "2026"],
                  ["Frequency", "Whenever it's ready"],
                  ["Presses", "Next.js & Notion"],
                  ["Price", "Free, forever"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="uppercase tracking-[0.16em] text-ink/60">{k}</dt>
                    <dd className="text-right text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* House standards */}
      <section className="torn-top bg-paper-2 pt-4">
        <div className="container py-14 md:py-16">
          <Reveal effect="fade">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-none text-ink">
              <span className="highlight-green">House standards</span>
            </h2>
            <div className="rule-thick mt-4" />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map((value, index) => (
              <Reveal
                key={value.title}
                effect="stamp"
                delay={index * 100}
                className="text-center"
              >
                <div className="flex h-full flex-col items-center gap-3 p-4">
                  <span className={`stamp ${value.stamp} px-4 py-2 text-sm`}>
                    {value.title}
                  </span>
                  <p className="font-serif italic leading-relaxed text-ink/75">
                    {value.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="container overflow-x-clip py-14 md:py-16">
        <Reveal effect="fade">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
            The names on the masthead
          </p>
          <h2 className="mt-1 font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-none text-ink">
            <span className="highlight">Contributors</span>
          </h2>
          <div className="rule-thick mt-4" />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((member, index) => (
            <Reveal
              key={member.name}
              effect="settle"
              delay={index * 110}
              rotate={index % 2 === 0 ? -1.2 : 1.2}
            >
              <div
                className="clipping tape flex h-full flex-col items-center p-6 text-center"
                style={{ "--clip-rot": `${index % 2 === 0 ? -1.2 : 1.2}deg` } as React.CSSProperties}
              >
                <div className="develop group relative h-28 w-28 overflow-hidden border border-ink/70">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="develop-img object-cover grayscale contrast-125 transition-[filter] duration-700 group-hover:grayscale-0 group-hover:contrast-100"
                  />
                  <div className="develop-dots halftone absolute inset-0 transition-opacity duration-700 group-hover:opacity-0" />
                </div>
                <h3 className="mt-4 font-display text-xl uppercase text-ink">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
                  {member.role}
                </p>
                <div className="rule mt-3 w-16" />
                <p className="mt-3 font-serif italic leading-relaxed text-ink/75">
                  {member.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="torn-top relative bg-press-red">
        <div className="halftone absolute inset-0 opacity-50" />
        <div className="container relative py-14 text-center md:py-16">
          <Reveal effect="settle">
            <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] uppercase leading-none text-paper">
              Join the club
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-paper/90">
              Start with the current issue, or send a letter to the editor —
              either way, you&apos;re in.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/blog"
                className="inline-block bg-paper px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.18em] text-ink shadow-clip transition-transform hover:-translate-y-0.5"
              >
                Read this issue
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-paper px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Write to us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
