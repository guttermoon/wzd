/**
 * The official WZD London lock-up: WORLD ZOMBIE DAY over LONDON, with the
 * brain-globe standing in for the O. Built from the artwork in the style
 * guide kit by scripts/prepare-logos.mjs.
 *
 * The guide is explicit that the logo must not be stretched, recoloured, or
 * given effects, so both variants ship as-is and the theme simply chooses
 * between them: the light lock-up on the dark ground, the dark lock-up on
 * greige. Swapping in CSS rather than JavaScript means the right one is
 * painted immediately, with no flash and nothing to hydrate.
 *
 * Clear space is the guide's rule — at least the width of the "W", roughly
 * an eighth of the lock-up — and is applied as padding by the caller.
 *
 * Both variants are marked decorative and the accessible name is carried by
 * whatever wraps this. Putting alt text on the images instead would drop
 * the name in one theme, because the hidden variant exposes nothing.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark-light-640.webp"
        srcSet="/brand/wordmark-light-320.webp 320w, /brand/wordmark-light-640.webp 640w"
        sizes="(min-width: 640px) 260px, 200px"
        alt=""
        aria-hidden="true"
        width={501}
        height={313}
        className="hidden h-auto w-full dark:block"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark-dark-640.webp"
        srcSet="/brand/wordmark-dark-320.webp 320w, /brand/wordmark-dark-640.webp 640w"
        sizes="(min-width: 640px) 260px, 200px"
        alt=""
        aria-hidden="true"
        width={502}
        height={266}
        className="h-auto w-full dark:hidden"
      />
    </span>
  )
}
