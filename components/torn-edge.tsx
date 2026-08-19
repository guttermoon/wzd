/**
 * The torn strip that sits on a change of ground tone.
 *
 * Two tones meeting on a straight line reads as a CSS section boundary.
 * The same two tones meeting on a torn edge reads as cut paper, which is
 * the whole idea, and it is the one device that appears at every such
 * boundary on the site rather than only on the home page.
 *
 * The shape comes from `.torn-bar` in globals.css. Decorative, so it
 * carries no accessible name, and it reserves its own height so nothing
 * reflows around it.
 */
export function TornEdge({ className = "" }: { className?: string }) {
  return <div className={`torn-bar ${className}`} aria-hidden="true" />
}
