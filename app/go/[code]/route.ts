import { NextRequest, NextResponse } from "next/server"

import { qrCode } from "@/lib/event"
import { getSiteCopy, urlKey, type SiteCopy } from "@/lib/site-copy"
import { hrefKind } from "@/lib/href"

/**
 * The far end of a printed QR code.
 *
 * A QR code is ink. Once it is on a poster, a wristband or the side of a
 * collection bucket it cannot be changed, and it outlives the decision
 * that produced it — "scan to register" is still on a wall in November. So
 * the code carries this address, which never changes, and where it sends
 * people is a `URL` cell in Notion that the owner can repoint in seconds.
 *
 * The terms are the ones `components/cta.tsx` already uses for every
 * button on the site: the Notion row wins, the built-in in `QR_CODES`
 * stands with the cell empty or with no Notion at all, and the value is
 * run through lib/href.ts before it is allowed anywhere near a `Location`
 * header. Nothing in the request can influence the destination — there is
 * no `?url=` here and there must never be one, or this stops being a QR
 * target and becomes an open redirect with the site's own domain on it.
 *
 * Three details are load-bearing:
 *
 *  - **307, never 301.** A permanent redirect is cached by the browser
 *    more or less forever, so the first person to scan the poster would
 *    be pinned to whatever it said that day and the owner could never
 *    move them. Temporary is the honest answer anyway: this address is
 *    permanent precisely so that what it points at is not.
 *  - **`no-store`.** Same reasoning one layer out. A redirect held by a
 *    CDN is a link the owner has changed and nobody is following yet.
 *  - **`noindex`.** A search result for /go/poster helps no one, and it
 *    would compete with the page it forwards to.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * How long one instance may reuse a copy read before asking Notion again.
 *
 * The route is uncached on purpose, so without this every scan is a Notion
 * API call — and a poster being scanned by a crowd on the day is exactly
 * the traffic shape that trips a rate limit. What happens then is the part
 * that matters: `getSiteCopy` swallows a failed read and returns the
 * built-in layer, so a throttled instance does not error, it quietly
 * forwards people to the built-in destination instead of the one the owner
 * set. Ten seconds is short enough that a repoint is live before anyone
 * has finished reading the poster, and long enough that a thousand scans
 * a minute cost six reads.
 */
const TTL_MS = 10_000

let recent: { at: number; copy: SiteCopy } | null = null

async function copyForRedirect(): Promise<SiteCopy> {
  const now = Date.now()
  if (recent && now - recent.at < TTL_MS) return recent.copy
  const copy = await getSiteCopy()
  recent = { at: now, copy }
  return copy
}

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  const entry = qrCode(params.code)
  // An address nobody printed. 404 rather than falling back to the home
  // page: a code that quietly works is a code that gets printed by
  // mistake, and then it is ink too.
  if (!entry) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" },
    })
  }

  const override = (await copyForRedirect())[urlKey(`qr.${entry.code}`)] ?? ""
  // Checked here as well as on the way in from Notion, for the reason
  // lib/href.ts gives: this is the last thing between a value somebody
  // typed into a spreadsheet cell and a `Location` header.
  const target = hrefKind(override) ? override.trim() : entry.href

  return NextResponse.redirect(new URL(target, request.url), {
    status: 307,
    headers: {
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  })
}
