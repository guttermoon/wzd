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
 * The VHS treatment and the hand-cut frame are applied here, so they are
 * consistent everywhere and impossible to forget. Both are pure CSS and
 * entirely static — see the note in globals.css about why nothing moves.
 */

/** Stable per-photo variation: same photo always gets the same cut. */
function hash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0
  return Math.abs(h)
}

const TILTS = ["tilt-a", "tilt-b", "tilt-c"]

export function Photo({
  photo,
  sizes = "100vw",
  priority = false,
  className = "",
  imageClassName = "",
  caption,
  tilt = false,
}: {
  photo: PhotoData
  sizes?: string
  priority?: boolean
  className?: string
  imageClassName?: string
  /** Optional editorial caption, shown above the credit. */
  caption?: React.ReactNode
  /** Adds a slight rotation. For grids; leave off for full-width images. */
  tilt?: boolean
}) {
  const width = widestWidth(photo)
  const height = Math.round(width / aspect(photo))
  const seed = hash(photo.slug)
  const cut = `cut-${seed % 6}`
  const rotation = tilt ? TILTS[seed % TILTS.length] : ""

  return (
    <figure className={`${rotation} ${className}`}>
      <picture className={`vhs ${cut} ${imageClassName}`}>
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
          className="h-auto w-full"
        />
      </picture>
      <figcaption className="mt-2 font-body text-sm leading-snug text-muted">
        {caption ? <span className="mb-1 block text-text">{caption}</span> : null}
        <span>Photo: {photo.credit}</span>
      </figcaption>
    </figure>
  )
}
