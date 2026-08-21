import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * The brand SVGs, read off disk and inlined.
 *
 * Two things here are load-bearing, and both were learned the hard way.
 *
 * **The files have to be traced into the serverless bundle.** `public/` is
 * served as static assets and is not part of the function bundle, and Next
 * cannot see through `join(process.cwd(), …)` to work out that these are
 * needed. Without the `outputFileTracingIncludes` entry in
 * next.config.mjs, this read succeeds during the build — where the whole
 * repo is on disk — and then fails in the lambda with ENOENT.
 *
 * **And it must never throw.** These are read at module scope by the
 * masthead, which is on every page. When the read failed in production,
 * every attempt to regenerate a page died with it, so Next went on serving
 * the last HTML that had built successfully — for days. The site looked
 * fine and was frozen: no copy change in Notion could ever appear, and no
 * amount of clearing caches made any difference, because nothing was being
 * rebuilt at all.
 *
 * A missing logo is worth a missing logo. It is not worth the site.
 */
const cache = new Map<string, string>()

export function brandSvg(file: string): string {
  const hit = cache.get(file)
  if (hit !== undefined) return hit

  let svg = ""
  try {
    svg = readFileSync(join(process.cwd(), "public/brand", file), "utf8")
      // Standalone documents: mark them decorative, and let the caller
      // size them. The accessible name comes from whatever wraps them.
      .replace(/<svg([^>]*)>/, '<svg$1 aria-hidden="true" focusable="false">')
  } catch (error) {
    console.error(
      `Brand artwork could not be read: public/brand/${file}. ` +
        `Rendering without it rather than failing the page.`,
      error,
    )
  }

  cache.set(file, svg)
  return svg
}
