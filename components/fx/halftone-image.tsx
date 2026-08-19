import Image from "next/image"
import { cn } from "@/lib/utils"

interface HalftoneImageProps {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
}

/**
 * Vintage print photo: grayscale + boosted contrast with a halftone dot
 * screen on top. The photo "develops" into full color on hover; on touch
 * devices it develops when a wrapping Reveal adds .is-inview (see the
 * `@media (hover: none)` rules in globals.css).
 */
export function HalftoneImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority,
}: HalftoneImageProps) {
  return (
    <div className={cn("develop group relative overflow-hidden", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "develop-img object-cover grayscale contrast-125 transition-[filter] duration-700 ease-out group-hover:grayscale-0 group-hover:contrast-100",
          imgClassName,
        )}
      />
      <div className="develop-dots halftone absolute inset-0 transition-opacity duration-700 ease-out group-hover:opacity-0" />
    </div>
  )
}
