import type { Metadata } from "next"

import { getSiteCopy } from "@/lib/site-copy"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { makeCta } from "@/components/cta"
import { PageShell, Section } from "@/components/page-shell"
import { ExternalLink } from "@/components/external-link"
import { DmnEmbed } from "@/components/dmn-embed"
import { Photo } from "@/components/photo"
import { photo } from "@/lib/photos"
import { EVENT } from "@/lib/event"
import { SITE_URL } from "@/lib/site"
import { pageMetadata } from "@/lib/seo"
import { jsonLd } from "@/lib/json-ld"

export const revalidate = 60

/**
 * The after party, on its own page.
 *
 * It had been a section of /register, which put it behind a decision it
 * does not depend on: **you do not have to do the walk to come**, and a
 * page reached by way of "register for the walk" says the opposite of
 * that. It is also a separate event, at a separate venue, with its own
 * tickets, its own age limit and its own ticketing company. Its own page
 * is what all of that adds up to.
 *
 * The walk's section on /register stays and now links here.
 */
export const metadata: Metadata = pageMetadata({
  title: "After party",
  description:
    "The official World Zombie Day: London after-party at BLOODSport by MEATliquor, " +
    "Saturday 10 October 2026 from 7:30pm. Over 18s. You don't have to do the walk to come.",
  path: "/after-party",
})

const FACTS = ["when", "where", "age", "music"]
const VIP = ["1", "2", "3", "4"]
const CAUSE = ["1", "2", "3"]

export default async function AfterPartyPage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const Cta = makeCta(copy)
  const has = makeHas(copy)
  const any = makeAny(copy)
  const P = makeP(copy)

  /**
   * Its own Event graph, separate from the walk's in app/layout.tsx,
   * because it is a separate event: a different venue, a different start,
   * a ticket and an age limit. Through jsonLd(), never JSON.stringify —
   * the name and description come from Notion cells.
   */
  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${EVENT.name} — ${S("party.title")}`,
    description: S("party.intro"),
    startDate: EVENT.afterParty.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    typicalAgeRange: "18-",
    location: {
      "@type": "Place",
      name: EVENT.afterParty.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: EVENT.afterParty.address,
        addressLocality: EVENT.locality,
        addressRegion: EVENT.region,
        addressCountry: EVENT.country,
      },
    },
    organizer: { "@type": "Organization", name: EVENT.name, url: SITE_URL },
    offers: {
      "@type": "Offer",
      url: EVENT.afterParty.ticketsUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "GBP",
    },
  }

  return (
    <PageShell
      title={<T k="party.title" />}
      titleText={S("party.title")}
      path="/after-party"
      standfirst={<T k="party.standfirst" />}
      banner={
        <Photo
          photo={photo("pinball-zombie")}
          priority
          bleed="full"
          /* Deeper than the 80/27 band the other pages use, and
             deliberately. This photograph is one person draped across a
             pinball table in the lower half of the frame; 80/27 from a 4:3
             original shows about a third of its height, and whichever
             third that is, she is cut in half by it. 2/1 shows two thirds
             and she is the subject. A banner ratio is a crop, and a crop
             should follow the picture rather than the other pages.

             Only the vertical is doing anything: the container is wider
             than 4:3, so `object-cover` fills the width and crops the
             height, and object-position's first number has no effect at
             all. 64% puts the band on her head and her arm, and leaves the
             title slab sitting over her shoulder rather than her face. */
          ratio="2/1"
          focus="50% 64%"
          sizes="100vw"
        />
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(eventLd) }}
      />

      <Section className="mt-10">
        <P k="party.intro" className="prose-wzd font-body text-lg" />
        <P k="party.open" className="prose-wzd mt-4 font-body" />
        <P k="party.entry" className="prose-wzd mt-4 font-body" />
      </Section>

      {/* The four things somebody decides on before they read anything —
          and one of them, the age limit, is the whole reason this cannot
          simply be folded into a family-friendly walk page. */}
      {any(...FACTS.map((f) => `party.facts.${f}.value`)) ? (
        <Section>
          <dl className="grid gap-6 sm:grid-cols-2">
            {FACTS.filter((f) => has(`party.facts.${f}.value`)).map((f) => (
              <div key={f} className="border-l-4 border-accent pl-4">
                <dt className="display text-base">
                  <T k={`party.facts.${f}.label`} />
                </dt>
                <dd className="mt-1 font-body text-muted">
                  <T k={`party.facts.${f}.value`} />
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      <Section title={<T k="party.tickets.title" />}>
        <P k="party.tickets.body" className="prose-wzd font-body" />
        {/* The portrait sits beside the widget rather than beside the
            intro. Two reasons and both are about the widget: it is the
            tallest thing on the page and it left a column of nothing next
            to three paragraphs, and their box carries a good deal of its
            own empty space that a picture alongside absorbs. Eight
            columns, not seven, so their form is not squeezed narrower
            than it was — a form this page exists for does not get made
            worse to balance a layout. */}
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <DmnEmbed
              trouble={S("party.tickets.trouble")}
              troubleCta={S("party.tickets.cta")}
              missing={S("party.tickets.missing")}
            />
          </div>
          <Photo
            photo={photo("doorway-portrait")}
            sizes="(min-width: 64rem) 20rem, 100vw"
            className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start"
          />
        </div>
      </Section>

      {any("party.vip.title", ...VIP.map((n) => `party.vip.${n}`)) ? (
        <Section>
          {has("party.vip.title") ? (
            <h2 className="display text-[clamp(1.5rem,3.5vw,2.25rem)]">
              <T k="party.vip.title" />
            </h2>
          ) : null}
          {VIP.some((n) => has(`party.vip.${n}`)) ? (
            <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
              {VIP.filter((n) => has(`party.vip.${n}`)).map((n) => (
                <li key={n}>
                  <T k={`party.vip.${n}`} />
                </li>
              ))}
            </ul>
          ) : null}
          <P k="party.vip.limit" className="prose-wzd mt-4 font-body" />
        </Section>
      ) : null}

      {any("party.cause.title", "party.cause.body", ...CAUSE.map((n) => `party.cause.${n}`)) ? (
        <Section title={<T k="party.cause.title" />}>
          <P k="party.cause.body" className="prose-wzd font-body" />
          {CAUSE.some((n) => has(`party.cause.${n}`)) ? (
            <ul className="prose-wzd mt-4 list-disc space-y-2 pl-5 font-body">
              {CAUSE.filter((n) => has(`party.cause.${n}`)).map((n) => (
                <li key={n}>
                  <T k={`party.cause.${n}`} />
                </li>
              ))}
            </ul>
          ) : null}
          <P k="party.cause.thanks" className="prose-wzd mt-4 font-body" />
        </Section>
      ) : null}

      {/* The walk is the other thing, and it is free — said plainly here
          because somebody who arrived for the party may not know it is on
          at all, and because its meeting point only reaches registrants. */}
      <Section>
        <div className="border-2 border-text p-6">
          <P k="party.walk" className="prose-wzd font-body" />
          {has("party.walk.cta") ? (
            <Cta k="party.walk.cta" href="/register" className="btn btn-primary mt-6" />
          ) : null}
        </div>
      </Section>

      {/* The room itself. Two shots rather than one because they are two
          different rooms, and somebody deciding whether to come out after
          a day on their feet is deciding about a place. */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <Photo photo={photo("bloodsport-booths")} sizes="(min-width: 40rem) 50vw, 100vw" />
          <Photo photo={photo("bloodsport-bar")} sizes="(min-width: 40rem) 50vw, 100vw" />
        </div>
        <p className="mt-6 font-body">
          <ExternalLink className="link" href={EVENT.afterParty.url}>
            {EVENT.afterParty.venue}
          </ExternalLink>{" "}
          &middot; {EVENT.afterParty.address}
        </p>
        <P k="party.thanks" className="prose-wzd mt-4 font-body text-muted" />
        {has("party.venue.cta") ? (
          <Cta
            k="party.venue.cta"
            href={EVENT.afterParty.url}
            className="btn btn-secondary mt-6"
          />
        ) : null}
      </Section>
    </PageShell>
  )
}
