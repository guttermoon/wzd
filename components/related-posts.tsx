import { getRelatedPosts } from "@/lib/notion"
import { PostClipping } from "@/components/post-clipping"
import { Reveal } from "@/components/fx/reveal"

interface RelatedPostsProps {
  currentPostId: string
  category: string
}

export async function RelatedPosts({ currentPostId, category }: RelatedPostsProps) {
  const posts = await getRelatedPosts(currentPostId, category)

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 overflow-x-clip">
      <Reveal effect="fade">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
          Keep reading
        </p>
        <h2 className="mt-1 font-display text-[clamp(1.75rem,4vw,2.5rem)] uppercase leading-none text-ink">
          <span className="highlight">Also in this issue</span>
        </h2>
        <div className="rule-thick mt-4" />
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostClipping key={post.id} post={post} index={index} variant="compact" />
        ))}
      </div>
    </section>
  )
}
