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

const TILTS = ["tilt-a", "tilt-b", "tilt-c"]

/** Which edge the panel runs off, and therefore where its angle falls. */
const BLEED_CUT = {
  left: "cut-inner-r",
  right: "cut-inner-l",
  full: "cut-band",
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
}) {
  const width = widestWidth(photo)
  const height = Math.round(width / aspect(photo))
  const seed = hash(photo.slug)
  const cut = bleed ? BLEED_CUT[bleed] : `cut-${seed % 6}`
  const rotation = tilt && !bleed ? TILTS[seed % TILTS.length] : ""

  return (
    <figure className={`${rotation} ${className}`}>
      <div className={bleed ? "panel-ground" : ""}>
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
          />
        </picture>
      </div>
      <figcaption
        className={`mt-3 font-body text-sm leading-snug text-muted ${
          bleed ? "credit-inset" : ""
        }`}
      >
        {caption ? <span className="mb-1 block text-text">{caption}</span> : null}
        <span>Photo: {photo.credit}</span>
      </figcaption>
    </figure>
  )
}
