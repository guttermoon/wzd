import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { NextRequest, NextResponse } from "next/server"

import { ROUTE_COOKIE, verifyToken } from "@/lib/route-access"

/**
 * The running order as a PDF, behind the same lock as the page.
 *
 * **It is not in public/, and it must not be.** Anything under public/ is
 * served as a static asset with no code in front of it, so a route.pdf
 * there would hand the meeting point to anyone who guessed the filename —
 * the page would be gated and the same words downloadable beside it. It
 * lives in content/ and is read here, after the cookie has been checked,
 * so it is exactly as private as /the-route itself.
 *
 * The file is built by `npm run route:pdf` against a local server and
 * committed, because printing a page to PDF needs a browser and a
 * serverless function has no business carrying one. The cost is that it is
 * a photograph rather than a mirror: a copy edit in Notion changes the
 * page and not the PDF. Re-run the script after an edit that matters.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const FILE = "content/route.pdf"

export async function GET(request: NextRequest) {
  if (!(await verifyToken(request.cookies.get(ROUTE_COOKIE)?.value))) {
    // 404 rather than 401: a browser that has not answered has no business
    // learning that the file exists, and this is reached by a link on the
    // page rather than typed, so there is nobody to explain the difference
    // to. The page itself does the explaining.
    return new NextResponse("Not found", { status: 404 })
  }

  let pdf: Buffer
  try {
    pdf = await readFile(join(process.cwd(), FILE))
  } catch {
    // Never throw at request time. A missing file costs the download; an
    // unhandled read would cost every regeneration of every page on the
    // site, which is the failure the note in CLAUDE.md is about.
    console.error(`route download: ${FILE} is missing — run \`npm run route:pdf\`.`)
    return new NextResponse("Not found", { status: 404 })
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="world-zombie-day-route.pdf"',
      // Private, and never by a shared cache: the whole point is that this
      // is not public, and a CDN copy would outlive the cookie check.
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  })
}
