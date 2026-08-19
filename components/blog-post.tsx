import { ShareButtons } from "@/components/share-buttons"
import { AuthorBio } from "@/components/author-bio"
import { Reveal } from "@/components/fx/reveal"
import { HalftoneImage } from "@/components/fx/halftone-image"
import type { BlogPost as BlogPostType } from "@/lib/notion"

interface BlogPostProps {
  post: BlogPostType
}

export function BlogPost({ post }: BlogPostProps) {
  const dateline = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <article className="mx-auto max-w-3xl">
      {/* Kicker + headline */}
      <header>
        <Reveal effect="stamp">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="stamp text-xs">{post.category}</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs lowercase tracking-wide text-ink/60"
              >
                [{tag}]
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal effect="settle" delay={100}>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,7vw,4.5rem)] uppercase leading-[0.98] text-ink">
            {post.title}
          </h1>
        </Reveal>

        <Reveal effect="fade" delay={220}>
          <div className="rule-double mt-6" />
          <div className="flex flex-col gap-2 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink/70 sm:flex-row sm:items-center sm:justify-between">
            <span>
              By {post.author.name} — {dateline} — {post.readingTime} min read
            </span>
            <ShareButtons post={post} />
          </div>
          <div className="rule" />
        </Reveal>
      </header>

      {/* Cover photo as a taped-down print */}
      {post.coverImage && (
        <Reveal effect="settle" delay={150} rotate={0.8} className="mt-8">
          <figure
            className="clipping tape p-2 pb-3"
            style={{ "--clip-rot": "0.8deg" } as React.CSSProperties}
          >
            <HalftoneImage
              src={post.coverImage}
              alt={post.title}
              className="h-64 w-full md:h-96"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            <figcaption className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
              Fig. 1 — {post.title}
            </figcaption>
          </figure>
        </Reveal>
      )}

      {/* Body copy */}
      <div className="prose mx-auto mt-10">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div className="rule-double mt-12" />
      <p className="py-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
        — End of dispatch —
      </p>

      {/* Author */}
      <div className="mt-6">
        <AuthorBio author={post.author} />
      </div>
    </article>
  )
}
