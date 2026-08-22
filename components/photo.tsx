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
 * components/vhs-filter.tsx. Photographs marked `busy` in
 * content/photos.json take it at about half strength: a crowd cannot
 * afford the split and the tear the way one large subject can.
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
  // underneath it, on every photograph including the full-width banners.
  // It goes to whichever bottom corner is clear: a panel running off the
  // left of the screen has its left corner off it too, and a banner has
  // the page title sitting on its bottom-left. See `.credit-tag` in
  // globals.css.
  const corner =
    bleed === "left"
      ? "credit-tag-right"
      : bleed === "full"
        ? "credit-tag-right credit-tag-band"
        : ""

  return (
    <figure className={`relative ${rotation} ${className}`}>
      <div className={`${bleed ? "panel-ground" : ""} ${mat}`}>
        <picture
          className={`vhs ${photo.busy ? "vhs-light" : ""} ${cut} ${imageClassName}`}
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
      <figcaption className={`credit-tag font-body ${corner}`}>
        {caption ? <span className="mb-1 block text-text">{caption}</span> : null}
        <span>Photo: {photo.credit}</span>
      </figcaption>
    </figure>
  )
}

/**
 * A graphic, not a photograph: artwork we made rather than a picture
 * somebody took.
 *
 * It lives in this file because this file is the only one allowed to emit
 * an `<img>` — scripts/check-credits.mjs enforces that, so that no
 * photograph can ever reach a page without its credit. A graphic has no
 * photographer, so it carries no credit and is deliberately not a
 * `<figure>`: the credit check counts figures against photo images, and a
 * figure with nothing to caption would break that count as well as being
 * a lie about what it is.
 *
 * It takes a mat so it sits in the page like everything else does, and
 * none of the tape treatment: no `.vhs`, so no channel split, no tear, no
 * red wash. Nor is it cropped. Artwork that arrived the way the designer
 * drew it should leave that way, entire: a poster has its own type on it,
 * and an asymmetric cut across the corners takes the credit line and the
 * logos with it. The hand-cut shape is drawn under the artwork instead.
 *
 * `still` is for animated artwork. An animated GIF cannot be stopped by
 * CSS — `prefers-reduced-motion` has no purchase on it — so the only way
 * to honour that preference is to serve a different file, and a <picture>
 * with a `media` source is the one mechanism that can. Everything else on
 * this site stops for that preference; a poster hung on the page should
 * not be the exception.
 */
export function Graphic({
  src,
  still,
  narrowStill,
  narrowUpTo = "48rem",
  alt,
  width,
  height,
  sizes = "100vw",
  className = "",
  frame = true,
}: {
  src: string
  /** A single frame, served instead when the visitor asks for less motion. */
  still?: string
  /**
   * A static image served in place of the animation on narrow screens.
   *
   * An animated poster is several megabytes, and over a phone connection
   * it frequently never finishes arriving: the visitor is left looking at
   * the top third of it, which reads as a broken image rather than as a
   * slow one. A still that lands beats an animation that does not.
   */
  narrowStill?: string
  /** The width below which `narrowStill` is used. */
  narrowUpTo?: string
  /** Empty when the graphic says nothing the surrounding copy does not. */
  alt: string
  width: number
  height: number
  sizes?: string
  className?: string
  frame?: boolean | "accent"
}) {
  // No cut on the artwork itself, and `graphic-mat` rather than
  // `photo-frame`: a clip-path clips descendants, so the frames the
  // photographs wear were taking the poster's credit line off the top and
  // half its logos off the bottom. The mat here is drawn behind instead.
  const mat = frame
    ? `graphic-mat${frame === "accent" ? " graphic-mat-accent" : ""}`
    : ""

  return (
    <div className={className}>
      <div className={mat}>
        <span className="block">
          {/* The browser takes the first source that matches, so reduced
              motion is asked first: someone who has asked for less motion
              gets a still whatever the width of their screen. */}
          <picture>
            {still ? (
              <source media="(prefers-reduced-motion: reduce)" srcSet={still} />
            ) : null}
            {narrowStill ? (
              <source media={`(max-width: ${narrowUpTo})`} srcSet={narrowStill} />
            ) : null}
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </picture>
        </span>
      </div>
    </div>
  )
}
