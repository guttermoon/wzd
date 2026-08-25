/**
 * Structured data, serialised so it cannot climb out of its own script tag.
 *
 * `<script type="application/ld+json">` is not a JavaScript context but it
 * is still parsed as one by the HTML tokeniser, which ends the element at
 * the first `</script` it sees and starts reading markup again. So a value
 * containing that sequence closes the block early and everything after it
 * becomes live HTML in the page.
 *
 * That is not hypothetical here. The FAQ page mirrors its visible copy into
 * a `FAQPage` graph, and that copy comes from a `Text` cell in Notion —
 * typed by hand, and by the same reasoning as a pasted `URL`, not trusted.
 * `JSON.stringify` escapes quotes and backslashes and leaves `<` alone, so
 * on its own it is not enough.
 *
 * Escaping the three characters below is enough to make that impossible,
 * and `\uXXXX` is ordinary JSON: every parser reads it back as the
 * character it stands for, so the structured data a search engine sees is
 * unchanged.
 *
 * U+2028 and U+2029 go with them. They are valid inside a JSON string but
 * are line terminators to a JavaScript parser, which is a syntax error in
 * anything that reads this block as script rather than as data.
 */
const ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
}

/**
 * JSON for a `<script type="application/ld+json">` block, safe to pass to
 * `dangerouslySetInnerHTML`. Use this rather than `JSON.stringify` for
 * anything that ends up inside a script element — including data that
 * looks like it is all constants today, because the next value added to it
 * may not be.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (c) => ESCAPES[c])
}
