import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { RouteMap } from "@/components/route-map"
import { makeT, makeS, makeHas } from "@/components/notion-text"
import { getSiteCopy } from "@/lib/site-copy"
import { ROUTE_COOKIE, verifyToken } from "@/lib/route-access"

/**
 * The route on one sheet of A4.
 *
 * This is what `npm run route:pdf` prints. It is a second rendering of the
 * same day rather than the same page shrunk: /the-route is a web page and
 * scrolls, and squeezing it onto a sheet produced five of them. Here the
 * map and the running order are laid out against a fixed 186x269mm block
 * and sized to fill it once.
 *
 * It reads the same copy rows as /the-route, so a Notion edit reaches both
 * — but only the page updates by itself. This one is a photograph until
 * `npm run route:pdf` is run again.
 *
 * Gated exactly as the page is, and for the same reason: it is the meeting
 * point on one sheet, which is a more useful thing to leak, not less. It
 * 404s rather than showing a form — nobody navigates here, the PDF builder
 * arrives with a cookie or it has no business being served.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "The route",
  robots: { index: false, follow: false },
}

const WALKS = [
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

export default async function RouteSheetPage() {
  if (!(await verifyToken(cookies().get(ROUTE_COOKIE)?.value))) notFound()

  const copy = await getSiteCopy()
  const T = makeT(copy)
  const S = makeS(copy)
  const has = makeHas(copy)

  const rows = WALKS.filter((d) => has(`route.${d.key}.what`))

  return (
    <div className="sheet">
      <header className="sheet-head">
        <div>
          <p className="sheet-eyebrow">World Zombie Day: London</p>
          {has("route.title") ? (
            <h1 className="sheet-title">
              <T k="route.title" />
            </h1>
          ) : null}
          {has("route.standfirst") ? (
            <p className="sheet-sub">
              <T k="route.standfirst" />
            </p>
          ) : null}
        </div>
        {has("route.confidential.label") ? (
          <p className="sheet-confid">
            <T k="route.confidential.label" />
          </p>
        ) : null}
      </header>

      <div className="sheet-map">
        <RouteMap />
      </div>

      <ol className="sheet-list" aria-label={S("route.day.title")}>
        {rows.map((d) => (
          <li
            key={d.key}
            className={d.w ? "sheet-row sheet-row-walk" : "sheet-row"}
            style={d.w ? { borderLeftColor: `var(--w${d.w})` } : undefined}
          >
            {has(`route.${d.key}.when`) ? (
              <span className="sheet-when">
                <T k={`route.${d.key}.when`} />
              </span>
            ) : null}
            <span className="sheet-what">
              <T k={`route.${d.key}.what`} />
            </span>
          </li>
        ))}
      </ol>

      <footer className="sheet-foot">
        {has("route.map.oxford") ? (
          <p className="sheet-note">
            <T k="route.map.oxford" />
          </p>
        ) : null}
        {/* The domain always prints — it is how somebody who picks this up
            off a pavement finds out what it is. The separator belongs to
            the confidential line, not to the domain, so clearing that row
            takes the middot with it rather than leaving the sheet ending
            in a dangling bullet. */}
        <p className="sheet-note">
          worldzombieday.co.uk
          {has("route.confidential.body") ? (
            <>
              {" · "}
              <T k="route.confidential.body" />
            </>
          ) : null}
        </p>
      </footer>
    </div>
  )
}
