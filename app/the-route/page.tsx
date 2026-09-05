import type { Metadata } from "next"
import { cookies } from "next/headers"

import { RouteMap } from "@/components/route-map"
import { RouteUnlock } from "@/components/route-unlock"
import { makeCta } from "@/components/cta"
import { makeT, makeS, makeHas, makeAny, makeP } from "@/components/notion-text"
import { PageShell, Section } from "@/components/page-shell"
import { getSiteCopy } from "@/lib/site-copy"
import { EVENT } from "@/lib/event"
import { ROUTE_COOKIE, isConfigured, verifyToken } from "@/lib/route-access"
import { pageMetadata } from "@/lib/seo"

/**
 * The running order for the day, behind a password.
 *
 * Dynamic, not revalidated: it reads a cookie, so there is no one HTML for
 * it to cache. That is the point rather than a cost — a page whose whole
 * job is to answer differently for two visitors cannot be a static file.
 *
 * `noindex` because the gate is not a suggestion: an indexed page whose
 * body is a password form is a page that tells the world it exists and
 * what it is for, which is most of the way to a leak of the meeting point
 * even without the copy behind it.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  ...pageMetadata({
    title: "The route",
    description:
      "The walking route and running order for World Zombie Day: London. For people who have registered.",
    path: "/the-route",
  }),
  robots: { index: false, follow: false },
}

/**
 * The legs, in order, keyed by the copy rows that describe them.
 *
 * A row with a `w` is a walk, and takes that walk's own colour down its
 * left edge — the same colour its line, its numbers and its key entry
 * carry on the map, so the two can be read against each other. The rows
 * without one are the stops, and they are the ones with no rule: the
 * shape of the day is then visible before a word of it is read.
 */
const DAY = [
  { key: "arrive" },
  { key: "prepare" },
  { key: "walk1", w: "1" },
  { key: "stop1" },
  { key: "walk2", w: "2" },
  { key: "stop2" },
  { key: "walk3", w: "3" },
  { key: "stop3" },
  { key: "walk4", w: "4" },
  { key: "stop4" },
  { key: "bonus", w: "5" },
] as { key: string; w?: string }[]

export default async function TheRoutePage() {
  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const has = makeHas(copy)
  const P = makeP(copy)
  const any = makeAny(copy)
  const Cta = makeCta(copy)

  const unlocked = await verifyToken(cookies().get(ROUTE_COOKIE)?.value)
  const configured = isConfigured()

  return (
    <PageShell
      title={<T k="route.title" />}
      titleText={S("route.title")}
      path="/the-route"
      standfirst={<T k={unlocked ? "route.standfirst" : "route.locked.standfirst"} />}
    >
      {!unlocked ? (
        <Section className="mt-10">
          <div className="border-2 border-text p-6">
            <h2 className="display text-xl"><T k="route.locked.title" /></h2>
            <P k="route.locked.body" className="prose-wzd mt-3 font-body" />
            {configured ? (
              <RouteUnlock
                label={S("route.locked.label")}
                button={S("route.locked.button")}
                working={S("route.locked.working")}
                wrong={S("route.locked.wrong")}
                problem={S("route.locked.problem")}
                busy={S("route.locked.busy")}
                unconfigured={S("route.locked.unconfigured")}
              />
            ) : (
              /* No password set means no way in, deliberately: an
                 unconfigured deploy must not be the way the meeting point
                 gets out. The form is left off rather than shown and
                 refused, so nobody types into something that cannot work. */
              <P k="route.locked.unconfigured" className="prose-wzd mt-6 font-body text-muted" />
            )}
          </div>
        </Section>
      ) : (
        <>
          {/* A standing warning rather than a footnote. This page names
              the meeting point and the running order can still move, and a
              page like that gets screenshotted and forwarded — so it says
              so at the top, where a screenshot of the top will carry it. */}
          {any("route.confidential.label", "route.confidential.body") ? (
          <Section className="mt-10">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-2 border-l-8 border-accent-strong p-4">
              <span className="display text-xs text-accent-text">
                <T k="route.confidential.label" />
              </span>
              <span className="font-body text-sm text-muted">
                <T k="route.confidential.body" />
              </span>
            </p>
          </Section>
          ) : null}

          <Section title={<T k="route.arrive.title" />}>
            <P k="route.arrive.body" className="prose-wzd font-body" />
          </Section>

          <Section title={<T k="route.map.title" />}>
            {/* Focusable and named, because it scrolls sideways on a
                narrow screen and a region that scrolls has to be reachable
                from the keyboard. */}
            <div
              className="map-frame mt-6"
              tabIndex={0}
              role="group"
              aria-label={S("route.map.frame")}
            >
              <div>
                <RouteMap />
              </div>
            </div>
            <P k="route.map.note" className="prose-wzd mt-4 font-body text-muted" />
            {/* The route up Oxford Street assumes the pedestrianisation
                goes ahead. It might not have by October, and a horde that
                has been told to expect a car-free street and finds traffic
                on it is a safety problem, not a disappointment — so this
                says so on the page rather than in a briefing. */}
            <P k="route.map.oxford" className="prose-wzd mt-3 font-body text-muted" />
          </Section>

          <Section title={<T k="route.day.title" />}>
            <ol className="mt-6 border-2 border-rule">
              {DAY.filter((d) => has(`route.${d.key}.what`)).map((d) => (
                <li
                  key={d.key}
                  className={[
                    "border-b border-edge p-5 last:border-b-0 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-x-6 sm:p-6",
                    // Nothing is tinted: the site carries structure in
                    // rules and shapes, never in bands of tone, and one
                    // row on a different ground would be the only place on
                    // the site that broke that.
                    d.w ? "border-l-[6px]" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={d.w ? { borderLeftColor: `var(--w${d.w})` } : undefined}
                >
                  <div className="font-body text-sm font-bold tabular-nums">
                    <T k={`route.${d.key}.when`} />
                  </div>
                  <div>
                    <h3 className="display mt-1 text-base sm:mt-0">
                      <T k={`route.${d.key}.what`} />
                    </h3>
                    <P
                      k={`route.${d.key}.detail`}
                      className="prose-wzd mt-2 font-body text-sm text-muted"
                    />
                    {/* A <Cta>, like every other button on the site: the
                        built-in address is in EVENT.route and the row's
                        URL overrides it, so a leg can be repointed from
                        Notion when the route changes. Where a leg has no
                        button — the stops — the key is empty and nothing
                        renders. */}
                    {has(`route.${d.key}.cta`) && EVENT.route[d.key] ? (
                      <Cta
                        k={`route.${d.key}.cta`}
                        href={EVENT.route[d.key]}
                        className="btn btn-secondary mt-4 text-xs"
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Section>

        </>
      )}
    </PageShell>
  )
}
