import Link from "next/link"
import type { BlogPost } from "@/lib/notion"
import { Reveal } from "@/components/fx/reveal"
import { HalftoneImage } from "@/components/fx/halftone-image"
import { cn } from "@/lib/utils"

interface PostClippingProps {
  post: BlogPost
  index?: number
  /** compact: smaller image + tighter copy (recent/related grids) */
  variant?: "default" | "compact"
  className?: string
}

const ROTATIONS = [-1.5, 1.2, -0.8, 1.6, -1.2, 0.9]

/**
 * A blog post rendered as a newsprint clipping taped to the page: halftone
 * cover photo, rubber-stamped category, Anton headline, serif excerpt and a
 * typewritten byline. Settles into place on scroll; straightens on hover.
 */
export function PostClipping({
  post,
  index = 0,
  variant = "default",
  className,
}: PostClippingProps) {
  const rotate = ROTATIONS[index % ROTATIONS.length]
  const compact = variant === "compact"
  const tapeSide = index % 3 === 0 ? "tape" : index % 3 === 1 ? "tape-left tape" : "tape-right tape"

  return (
    <Reveal
      effect="settle"
      delay={(index % 3) * 110}
      rotate={rotate}
      as="article"
      className={className}
    >
      <div
        className={cn("clipping flex h-full flex-col", tapeSide)}
        style={{ "--clip-rot": `${rotate}deg` } as React.CSSProperties}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="flex h-full flex-col"
          aria-label={post.title}
        >
          {post.coverImage && (
            <HalftoneImage
              src={post.coverImage}
              alt={post.title}
              className={cn("w-full border-b border-ink/60", compact ? "h-36" : "h-48")}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-5 sm:p-6")}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className="stamp text-[10px]"
                style={{ "--stamp-rot": `${index % 2 === 0 ? -3 : 2}deg` } as React.CSSProperties}
              >
                {post.category}
              </span>
              {!compact &&
                post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] lowercase tracking-wide text-ink/60"
                  >
                    [{tag}]
                  </span>
                ))}
            </div>

            <h3
              className={cn(
                "mt-3 font-display uppercase leading-[1.05] text-ink",
                compact ? "text-lg line-clamp-2" : "text-xl sm:text-2xl line-clamp-2",
              )}
            >
              {post.title}
            </h3>

            <p
              className={cn(
                "mt-2 font-serif leading-relaxed text-ink/75",
                compact ? "text-sm line-clamp-2" : "text-base line-clamp-3",
              )}
            >
              {post.excerpt}
            </p>

            <div className="mt-auto pt-4">
              <div className="rule" />
              <div className="flex items-center justify-between gap-2 pt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                <span className="truncate">By {post.author.name}</span>
                <time dateTime={post.publishedAt} className="shrink-0">
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Reveal>
  )
}
