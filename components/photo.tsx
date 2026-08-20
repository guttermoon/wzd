import type React from "react"
import {
  type Photo as PhotoData,
  srcSet,
  fallbackSrc,
  widestWidth,
  aspect,
} from "@/lib/photos"

/**
 * The only way a photograph appears on this site.
 *
 * Every photo renders inside a <figure> with a visible photographer credit
 * in its <figcaption> — the credit is not optional, and is not merely alt
 * text. lib/photos.ts refuses to return a photo without one, so an
 * uncredited image cannot reach the page.
 *
 * Renditions are pre-built by scripts/prepare-images.mjs, so this is a
 * plain <picture>: WebP where supported, JPEG everywhere else, and real
 * width/height so nothing shifts as it loads.
 *
 * The tape treatment and the shape both live here, so they are consistent
 * everywhere and impossible to forget — see globals.css and
 * components/vhs-filter.tsx.
 */

/** Stable per-photo variation: same photo always gets the same cut. */
function hash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Every class name below is written out in full, and none is built by
 * interpolation.
 *
 * Tailwind scans the source for literal class names and drops anything in
 * `@layer components` it cannot find. A name assembled at runtime — say
 * `cut-${n}` — is invisible to that scan, so the rule is deleted from the
 * stylesheet and the class silently does nothing. It looks fine in the
 * source, in the DOM and in devtools; only the compiled CSS is missing.
 * scripts/check-css.mjs fails the build if any of these disappear.
 */
const TILTS = ["tilt-a", "tilt-b", "tilt-c"] as const

const CUTS = ["cut-0", "cut-1", "cut-2", "cut-3", "cut-4", "cut-5"] as const

const BANDS = [
  "cut-band-0",
  "cut-band-1",
  "cut-band-2",
  "cut-band-3",
  "cut-band-4",
] as const

const FRAMES = ["frame-0", "frame-1", "frame-2", "frame-3", "frame-4"] as const

/** Which edge the panel runs off, and therefore where its angle falls. */
const BLEED_CUT = {
  left: "cut-inner-r",
  right: "cut-inner-l",
} as const

export function Photo({
  photo,
  sizes = "100vw",
  priority = false,
  className = "",
  imageClassName = "",
  caption,
  tilt = false,
  bleed,
  ratio,
  focus,
  frame,
}: {
  photo: PhotoData
  sizes?: string
  priority?: boolean
  className?: string
  imageClassName?: string
  /** Optional editorial caption, shown above the credit. */
  caption?: React.ReactNode
  /** Adds a slight rotation. For in-column photographs; never for panels. */
  tilt?: boolean
  /**
   * Run the panel off an edge of the screen. The angle moves to the inner
   * edge, and the credit is padded back to the container line so a
   * photographer's name is never pushed off the screen.
   */
  bleed?: "left" | "right" | "full"
  /**
   * Aspect ratio for a bleeding panel, e.g. "16/9". Without one a panel
   * two-thirds of a wide screen across becomes absurdly tall. In-column
   * photographs keep their natural height and ignore this.
   */
  ratio?: string
  /**
   * Where the crop holds when `ratio` is doing the cropping, as a CSS
   * object-position. A shallow band centred on the frame cuts heads off,
   * because faces sit in the upper third of almost every photograph here,
   * so bands hold high by default. Override per photograph when the
   * subject is somewhere else.
   */
  focus?: string
  /**
   * Mount the photograph on a heavy mat: a thick, skewed card of near-black
   * or Zombie Red, cut at a different angle from the photograph on it. See
   * `.photo-frame` in globals.css.
   */
  frame?: boolean | "accent"
}) {
  const width = widestWidth(photo)
  const height = Math.round(width / aspect(photo))
  const seed = hash(photo.slug)
  // A full-width band picks one of five angles by the same slug hash that
  // picks the in-column frames, so the band at the top of one page differs
  // from the next and a given page always gets the same one.
  const cut =
    bleed === "full"
      ? BANDS[seed % BANDS.length]
      : bleed
        ? BLEED_CUT[bleed]
        : CUTS[seed % CUTS.length]
  const rotation = tilt && !bleed ? TILTS[seed % TILTS.length] : ""

  // The mat is cut one step round from the photograph's own frame, so the
  // two shapes disagree rather than tracing each other.
  const mat = frame
    ? `photo-frame ${FRAMES[(seed + 2) % FRAMES.length]}${
        frame === "accent" ? " frame-accent" : ""
      }`
    : ""

  // The credit is tucked into the corner of the frame rather than set
  // underneath it, except on the full-width banners: those carry the page
  // title over them, and a chip in the corner would be one more thing
  // fighting for the same space. See `.credit-tag` in globals.css.
  const tucked = bleed !== "full"

  return (
    <figure className={`relative ${rotation} ${className}`}>
      <div className={`${bleed ? "panel-ground" : ""} ${mat}`}>
        <picture
          className={`vhs ${cut} ${imageClassName}`}
          style={ratio ? { aspectRatio: ratio } : undefined}
        >
          <source type="image/webp" srcSet={srcSet(photo)} sizes={sizes} />
          <img
            src={fallbackSrc(photo)}
            alt={photo.alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : undefined}
            className={ratio ? "h-full w-full object-cover" : "h-auto w-full"}
            style={
              ratio
                ? { objectPosition: focus ?? (bleed === "full" ? "50% 28%" : "50% 40%") }
                : undefined
            }
          />
        </picture>
      </div>
      <figcaption
        className={
          tucked
            ? `credit-tag font-body ${bleed === "left" ? "credit-tag-right" : ""}`
            : "credit-inset mt-3 font-body text-sm leading-snug text-muted"
        }
      >
        {caption ? <span className="mb-1 block text-text">{caption}</span> : null}
        <span>Photo: {photo.credit}</span>
      </figcaption>
    </figure>
  )
}
