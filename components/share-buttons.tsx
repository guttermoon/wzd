"use client"

import { toast } from "@/hooks/use-toast"
import type { BlogPost } from "@/lib/notion"

interface ShareButtonsProps {
  post: BlogPost
}

export function ShareButtons({ post }: ShareButtonsProps) {
  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "")

  const openShare = (network: "twitter" | "linkedin") => {
    const url = getUrl()
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }
    window.open(links[network], "_blank")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      toast({
        title: "Link copied!",
        description: "The post URL has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive",
      })
    }
  }

  const linkClass =
    "font-mono text-xs uppercase tracking-[0.16em] underline decoration-press-red decoration-2 underline-offset-4 transition-colors hover:bg-mustard/50"

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink/50">
        Wire this story:
      </span>
      <button className={linkClass} onClick={() => openShare("twitter")}>
        Twitter
      </button>
      <button className={linkClass} onClick={() => openShare("linkedin")}>
        LinkedIn
      </button>
      <button className={linkClass} onClick={copyToClipboard}>
        Copy link
      </button>
    </span>
  )
}
