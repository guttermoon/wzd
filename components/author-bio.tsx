import Image from "next/image"
import Link from "next/link"
import { Twitter, Linkedin, Github } from "lucide-react"
import { Reveal } from "@/components/fx/reveal"
import type { Author } from "@/lib/notion"

interface AuthorBioProps {
  author: Author
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <Reveal effect="settle" rotate={-0.7}>
      <div
        className="clipping tape-left tape p-5 sm:p-6"
        style={{ "--clip-rot": "-0.7deg" } as React.CSSProperties}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
          About the correspondent
        </p>
        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="develop group relative h-20 w-20 shrink-0 overflow-hidden border border-ink/70">
            <Image
              src={author.avatar || "/placeholder.svg"}
              alt={author.name}
              fill
              className="develop-img object-cover grayscale contrast-125 transition-[filter] duration-700 group-hover:grayscale-0 group-hover:contrast-100"
            />
            <div className="develop-dots halftone absolute inset-0 transition-opacity duration-700 group-hover:opacity-0" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-xl uppercase text-ink">{author.name}</h3>
            <p className="mt-2 font-serif italic leading-relaxed text-ink/75">
              {author.bio || "Filed this dispatch for The Dead Good Club."}
            </p>
            {(author.social.twitter || author.social.linkedin || author.social.github) && (
              <div className="mt-4 flex justify-center gap-3 sm:justify-start">
                {author.social.twitter && (
                  <Link
                    href={`https://twitter.com/${author.social.twitter}`}
                    target="_blank"
                    aria-label="Twitter"
                    className="border border-ink/60 p-2 text-ink/70 transition-colors hover:bg-ink hover:text-paper"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                )}
                {author.social.linkedin && (
                  <Link
                    href={`https://linkedin.com/in/${author.social.linkedin}`}
                    target="_blank"
                    aria-label="LinkedIn"
                    className="border border-ink/60 p-2 text-ink/70 transition-colors hover:bg-ink hover:text-paper"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                )}
                {author.social.github && (
                  <Link
                    href={`https://github.com/${author.social.github}`}
                    target="_blank"
                    aria-label="GitHub"
                    className="border border-ink/60 p-2 text-ink/70 transition-colors hover:bg-ink hover:text-paper"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
